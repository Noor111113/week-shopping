// فتح/إغلاق الأقسام عند الضغط على عنوان القسم (نمط أكورديون)
document.querySelectorAll('.category-toggle').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.category-toggle').forEach(otherButton => {
            const otherList = otherButton.nextElementSibling;
            if (otherButton !== button) {
                otherButton.classList.remove('active');
                if (otherList) {
                    otherList.classList.remove('active');
                }
            }
        });

        button.classList.toggle('active');
        const itemList = button.nextElementSibling;
        if (itemList) {
            itemList.classList.toggle('active');
        }
    });
});

// ✅ تفعيل أزرار زيادة/نقصان الكمية
document.querySelectorAll('.increase').forEach(button => {
    button.addEventListener('click', () => {
        const quantitySpan = button.parentElement.querySelector('.quantity');
        let value = parseInt(quantitySpan.textContent || '0', 10);
        quantitySpan.textContent = value + 1;
    });
});

document.querySelectorAll('.decrease').forEach(button => {
    button.addEventListener('click', () => {
        const quantitySpan = button.parentElement.querySelector('.quantity');
        let value = parseInt(quantitySpan.textContent || '0', 10);
        if (value > 0) quantitySpan.textContent = value - 1;
    });
});

// ✅ زر لتصفير الكميات والاختيارات
const resetButton = document.getElementById('reset-quantities');
if (resetButton) {
    resetButton.addEventListener('click', () => {
        document.querySelectorAll('.quantity').forEach(span => {
            span.textContent = '0';
        });
        document.querySelectorAll('input[type="checkbox"]').forEach(box => {
            box.checked = false;
        });
    });
}

// ✅ زر توليد PDF بشكل منسق
const pdfButton = document.getElementById('generate-pdf');
if (pdfButton) {
    pdfButton.addEventListener('click', () => {
        const printableContent = document.createElement('div');
        printableContent.style.fontFamily = 'Arial, sans-serif';
        printableContent.style.direction = 'rtl';
        printableContent.style.padding = '1rem';

        const date = new Date().toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const dateElement = document.createElement('p');
        dateElement.textContent = `📆 التاريخ: ${date}`;
        dateElement.style.fontSize = '0.9rem';
        dateElement.style.marginBottom = '1rem';
        printableContent.appendChild(dateElement);

        const title = document.createElement('h2');
        title.textContent = '🛒 قائمة المشتريات المختارة';
        printableContent.appendChild(title);

        document.querySelectorAll('.category').forEach(section => {
            const sectionTitle = section.querySelector('.category-toggle');
            const sectionList = document.createElement('div');
            const sectionHeader = document.createElement('h3');
            sectionHeader.textContent = sectionTitle.textContent;
            sectionList.appendChild(sectionHeader);

            let hasItems = false;

            section.querySelectorAll('.item-group').forEach(group => {
                const groupLabel = group.querySelector('label')?.textContent.trim();
                const subItems = group.querySelectorAll('.sub-item');

                let groupHasItems = false;
                const groupBlock = document.createElement('div');

                subItems.forEach(subItem => {
                    const checkbox = subItem.querySelector('input[type="checkbox"]');
                    const quantitySpan = subItem.querySelector('.quantity');

                    const quantity = quantitySpan ? quantitySpan.textContent.trim() : '';
                    const isChecked = checkbox ? checkbox.checked : false;

                    if ((quantity && parseInt(quantity) > 0) || isChecked) {
                        const itemLabel = subItem.querySelector('label')?.textContent.trim() || 'عنصر غير معروف';
                        const line = document.createElement('p');
                        line.textContent = quantity && parseInt(quantity) > 0
                            ? `- ${itemLabel}: ${quantity}`
                            : `- ${itemLabel}`;
                        groupBlock.appendChild(line);
                        groupHasItems = true;
                    }
                });

                if (groupHasItems) {
                    const groupTitle = document.createElement('h4');
                    groupTitle.textContent = `🥬 ${groupLabel}`;
                    groupBlock.prepend(groupTitle);
                    sectionList.appendChild(groupBlock);
                    hasItems = true;
                }
            });

            section.querySelectorAll('.item-list .item').forEach(subItem => {
                const checkbox = subItem.querySelector('input[type="checkbox"]');
                const quantitySpan = subItem.querySelector('.quantity');

                const quantity = quantitySpan ? quantitySpan.textContent.trim() : '';
                const isChecked = checkbox ? checkbox.checked : false;

                if ((quantity && parseInt(quantity) > 0) || isChecked) {
                    const labelText = subItem.textContent.trim();
                    const line = document.createElement('p');
                    line.textContent = quantity && parseInt(quantity) > 0
                        ? `- ${labelText}: ${quantity}`
                        : `- ${labelText}`;
                    sectionList.appendChild(line);
                    hasItems = true;
                }
            });

            if (hasItems) {
                printableContent.appendChild(sectionList);
            }
        });

        if (printableContent.children.length <= 2) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'لم يتم اختيار أي عناصر أو تحديد كميات.';
            printableContent.appendChild(emptyMsg);
        }

        const options = {
            margin: 0.5,
            filename: 'قائمة-المشتريات.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(printableContent).save();
    });
}