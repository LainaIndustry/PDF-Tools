// main.js – handles tool page interactions (upload, simulate compress, download)

document.addEventListener('DOMContentLoaded', function() {
    // elements
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const actionBtn = document.getElementById('actionBtn');
    const resultSection = document.getElementById('resultSection');
    const downloadBtn = document.getElementById('downloadBtn');

    // if not on a tool page, exit (prevents errors on homepage)
    if (!dropArea || !fileInput || !actionBtn) return;

    let selectedFile = null;

    // --- file selection via click on drop area ---
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    // prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => e.preventDefault());
        dropArea.addEventListener(eventName, (e) => e.stopPropagation());
    });

    // highlight on drag
    dropArea.addEventListener('dragenter', () => {
        dropArea.style.borderColor = '#2563eb';
        dropArea.style.background = '#eff6ff';
    });
    dropArea.addEventListener('dragleave', () => {
        dropArea.style.borderColor = '#cbd5e1';
        dropArea.style.background = '#fcfdff';
    });
    dropArea.addEventListener('drop', () => {
        dropArea.style.borderColor = '#cbd5e1';
        dropArea.style.background = '#fcfdff';
    });

    // handle dropped files
    dropArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            handleFile(files[0]);
        } else {
            alert('Please drop a PDF file.');
        }
    });

    // handle file input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        selectedFile = file;
        actionBtn.disabled = false;
        // optional: show file name in drop area
        const originalText = dropArea.innerHTML;
        dropArea.innerHTML = `<i class="fas fa-file-pdf"></i><h3>${file.name}</h3><p>${(file.size / 1024).toFixed(1)} KB · ready to compress</p>`;
        // store original to revert? not necessary now.
    }

    // --- action button click: simulate compression ---
    actionBtn.addEventListener('click', () => {
        if (!selectedFile) return;

        // disable button to prevent double click
        actionBtn.disabled = true;
        actionBtn.textContent = 'Compressing...';

        // simulate async processing (e.g., network delay)
        setTimeout(() => {
            // hide the main tool box? we keep it but show result below.
            // show result section
            resultSection.style.display = 'block';

            // create a dummy download (blob) – in real scenario this would be the compressed file
            // For demo, we create a simple text file pretending to be a PDF.
            const dummyContent = 'This is a simulated compressed PDF file. In a real implementation, the server would return the actual compressed PDF.';
            const blob = new Blob([dummyContent], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            downloadBtn.href = url;
            downloadBtn.download = selectedFile ? `compressed_${selectedFile.name}` : 'compressed.pdf';

            // reset button state
            actionBtn.disabled = false;
            actionBtn.textContent = 'Compress PDF';
        }, 2000); // 2 second fake processing
    });

    // optional: reset when new file is selected after result shown
    // we can add a reset mechanism, but it's fine.
});
