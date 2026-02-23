const charSet = "!@#$%^&*(),.:;\"'";
const diamondPattern = [150, 160, 150];
const bgElement = document.getElementById('matrix-bg');
first = true

function generateFrame() {
    let frame = "";
    diamondPattern.forEach(count => {
        let line = "";
        for (let i = 0; i < count; i++) {
            line += charSet[Math.floor(Math.random() * charSet.length)];
        }
        frame += line + "\n";
    });
    bgElement.textContent = frame;
}
if (first) {
    generateFrame();
    first = false;
}
// Change how quickly the text updates
setInterval(generateFrame, 300);

// ---- Email copy button ----
const emailBtn = document.getElementById('email-btn');
if (emailBtn) {
    emailBtn.addEventListener('click', function () {
        const email = 'blakeduvallrobertson@gmail.com';
        const copiedEl = emailBtn.querySelector('.email-copied');
        const textEl = emailBtn.querySelector('.email-text');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(showCopied).catch(fallbackCopy);
        } else {
            fallbackCopy();
        }

        function fallbackCopy() {
            const textarea = document.createElement('textarea');
            textarea.value = email;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showCopied();
        }

        function showCopied() {
            textEl.style.opacity = '0';
            copiedEl.classList.add('show');
            setTimeout(function () {
                copiedEl.classList.remove('show');
                textEl.style.opacity = '';
            }, 1200);
        }
    });
}

// ---- Receipt hover/tap preview ----
const receiptItems = document.querySelectorAll('.receipt-item[data-preview]');
const placeholder = document.getElementById('preview-placeholder');

function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

function showPreview(item) {
    const previewId = 'preview-' + item.getAttribute('data-preview');
    document.querySelectorAll('.receipt-preview-content').forEach(el => el.style.display = 'none');
    placeholder.style.display = 'none';
    const target = document.getElementById(previewId);
    if (target) target.style.display = 'flex';
}

function openPdf(item) {
    const previewId = 'preview-' + item.getAttribute('data-preview');
    const target = document.getElementById(previewId);
    if (target) {
        const iframe = target.querySelector('iframe');
        if (iframe) {
            const pdfUrl = iframe.src.split('#')[0];
            window.open(pdfUrl, '_blank');
        }
    }
}

receiptItems.forEach(item => {
    // Desktop: hover to preview
    item.addEventListener('mouseenter', () => {
        showPreview(item);
    });

    item.addEventListener('click', () => {
        if (isTouchDevice()) {
            // First tap shows preview, second tap opens PDF
            const previewId = 'preview-' + item.getAttribute('data-preview');
            const target = document.getElementById(previewId);
            if (target && target.style.display === 'flex') {
                openPdf(item);
            } else {
                showPreview(item);
            }
        } else {
            openPdf(item);
        }
    });
});