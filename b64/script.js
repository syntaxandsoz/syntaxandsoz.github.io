/* Syntax & Soz - Stealth Converter Logic */

// --- 1. Tab Switching Logic ---
function switchTab(tab) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tab + '-panel').classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- 2. File Selection Listener ---
document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    const uploadText = document.getElementById('uploadText');
    const uploadBox = document.querySelector('.upload-box');

    if (file) {
        let size = file.size / 1024;
        let sizeText = size < 1024 ? size.toFixed(2) + " KB" : (size / 1024).toFixed(2) + " MB";

        uploadText.innerHTML = `
            <span style="color: #888;">>> Target Locked:</span><br>
            <span style="color: #00ff41; font-weight: bold; font-size: 1.1rem;">${file.name}</span>
            <br><span style="color: #58a6ff; font-size: 0.8rem;">[Size: ${sizeText}]</span>
        `;
        uploadBox.style.borderColor = "#00ff41"; 
        uploadBox.style.background = "rgba(0, 255, 65, 0.05)";
    } else {
        uploadText.innerHTML = "Drag file here or Click to Upload";
        uploadBox.style.borderColor = "#333";
        uploadBox.style.background = "transparent";
    }
});

// --- 3. Encode Logic ---
function encodeFile() {
    const fileInput = document.getElementById('fileInput');
    const outputArea = document.getElementById('encodeOutput');
    const textarea = document.getElementById('base64Output');
    const status = document.getElementById('statusMsg');

    if (fileInput.files.length === 0) {
        alert(">> ERROR: No file selected.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    status.innerText = "Processing...";
    
    reader.onload = function(e) {
        textarea.value = e.target.result; 
        outputArea.style.display = "block";
        status.innerText = ">> Encryption Successful.";
        status.style.color = "#00ff41";
    };
    reader.readAsDataURL(file);
}

function copyText() {
    const copyText = document.getElementById("base64Output");
    copyText.select();
    document.execCommand("copy");
    document.getElementById('statusMsg').innerText = ">> Copied to Clipboard!";
}

// --- 4. Decode Logic (THE FIX) ---
function decodeFile() {
    const base64String = document.getElementById('base64Input').value.trim();
    let fileName = document.getElementById('fileName').value || "recovered_file";
    
    // ERROR CHECK: Empty
    if (!base64String) {
        alert(">> ERROR: Input field is empty.");
        return;
    }

    // ERROR CHECK: Must start with data:
    if (!base64String.startsWith("data:")) {
        alert(">> CRITICAL ERROR: Invalid Format.\n\nThe string must start with 'data:image/...' or 'data:application/...'. \nPlease use the 'Copy Code' button from the Encryption step.");
        return;
    }

    // Auto-detect extension
    if (!fileName.includes('.')) {
        if (base64String.includes('image/png')) fileName += ".png";
        else if (base64String.includes('image/jpeg')) fileName += ".jpg";
        else if (base64String.includes('application/pdf')) fileName += ".pdf";
        else if (base64String.includes('text/plain')) fileName += ".txt";
        else fileName += ".bin"; 
    }

    try {
        const link = document.createElement('a');
        link.href = base64String;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        alert(">> FATAL ERROR: Browser refused download.");
    }
}