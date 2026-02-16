// main.js – enhanced for multiple files & varied accept types

document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const actionBtn = document.getElementById('actionBtn');
    const resultSection = document.getElementById('resultSection');
    const downloadBtn = document.getElementById('downloadBtn');

    if (!dropArea || !fileInput || !actionBtn) return; // not a tool page

    let selectedFiles = []; // array for multiple files

    // --- determine accepted types from input attribute ---
    const acceptAttr = fileInput.accept || '.pdf,.jpg,.jpeg,.png';
    const acceptTypes = acceptAttr.split(',').map(s => s.trim());

    // --- click on drop area ---
    dropArea.addEventListener('click', () => fileInput.click());

    // --- drag & drop prevention ---
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eName => {
        dropArea.addEventListener(eName, e => e.preventDefault());
        dropArea.addEventListener(eName, e => e.stopPropagation());
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

    // --- handle dropped files ---
    dropArea.addEventListener('drop', (e) => {
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });

    // --- handle file input change ---
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    });

    function handleFiles(files) {
        // filter by accept type (simple check)
        const validFiles = files.filter(file => {
            return acceptTypes.some(type => {
                if (type.startsWith('.')) {
                    return file.name.toLowerCase().endsWith(type);
                } else {
                    return file.type.match(type);
                }
            });
        });

        if (validFiles.length === 0) {
            alert('Please drop valid file types: ' + acceptAttr);
            return;
        }

        selectedFiles = validFiles;

        // update UI
        if (validFiles.length === 1) {
            dropArea.innerHTML = `<i class="fas fa-file"></i><h3>${validFiles[0].name}</h3><p>${(validFiles[0].size / 1024).toFixed(1)} KB · ready</p>`;
        } else {
            dropArea.innerHTML = `<i class="fas fa-files"></i><h3>${validFiles.length} files selected</h3><p>Click "Process" to continue</p>`;
        }

        actionBtn.disabled = false;
    }

    // --- action button click ---
    actionBtn.addEventListener('click', () => {
        if (selectedFiles.length === 0) return;

        actionBtn.disabled = true;
        actionBtn.textContent = 'Processing...';

        setTimeout(() => {
            // show result section
            resultSection.style.display = 'block';

            // create dummy download (simulate result)
            let fileName = 'result';
            if (selectedFiles.length === 1) {
                fileName = `processed_${selectedFiles[0].name}`;
            } else {
                fileName = 'processed_files.zip'; // dummy
            }

            const dummyContent = 'Simulated output file. In production, this would be your converted PDF.';
            const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            downloadBtn.href = url;
            downloadBtn.download = fileName;

            // update preview text
            document.querySelector('.file-preview').innerHTML = `<i class="fas fa-file"></i> ${fileName} (simulated)`;

            actionBtn.disabled = false;
            actionBtn.textContent = actionBtn.getAttribute('data-original-text') || 'Process';
        }, 2000);
    });

    // store original button text
    actionBtn.setAttribute('data-original-text', actionBtn.textContent);
});
