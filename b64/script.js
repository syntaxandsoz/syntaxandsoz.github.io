/* Syntax & Soz - Stealth Converter (Smart Paste Fix) */

let globalDecodeData = ""; // Stores pasted data in RAM

function switchTab(tab) {
    document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tab + '-panel').style.display = 'block';
    event.currentTarget.classList.add('active');
}

// --- 1. File Selection & Warning ---
document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    const uploadText = document.getElementById('uploadText');
    const uploadBox = document.querySelector('.upload-box');

    if (file) {
        let size = file.size / 1024;
        let sizeText = size < 1024 ? size.toFixed(2) + " KB" : (size / 1024).toFixed(2) + " MB";
        
        let color = (file.size > 10 * 1024 * 1024) ? "#ffbd2e" : "#00ff41"; 

        uploadText.innerHTML = `
            <span style="color: #888;">>> Target Locked:</span><br>
            <span style="color: ${color}; font-weight: bold; font-size: 1.1rem;">${file.name}</span>
            <br><span style="color: #58a6ff; font-size: 0.8rem;">[Size: ${sizeText}]</span>
        `;
        uploadBox.style.borderColor = color; 
        uploadBox.style.background = "rgba(0, 255, 65, 0.05)";
    }
});

// --- 2. Encode Logic ---
function encodeFile() {
    const fileInput = document.getElementById('fileInput');
    const outputArea = document.getElementById('encodeOutput');
    const textarea = document.getElementById('base64Output');
    const status = document.getElementById('statusMsg');
    
    const progressContainer = document.getElementById('progress-container');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');

    if (fileInput.files.length === 0) {
        alert(">> ERROR: No file selected.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    outputArea.style.display = "none";
    progressContainer.style.display = "block";
    progressBarFill.style.width = "0%";
    progressText.innerText = ">> Initializing... 0%";
    status.innerText = "";
    textarea.value = ""; 

    reader.onprogress = function(e) {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            progressBarFill.style.width = percent + "%";
            progressText.innerText = `>> Encrypting... ${percent}%`;
        }
    };

    reader.onload = function(e) {
        progressBarFill.style.width = "100%";
        progressText.innerText = ">> Rendering Code...";
        
        setTimeout(() => {
            textarea.value = e.target.result; // Show Full Code
            progressContainer.style.display = "none";
            outputArea.style.display = "block";
            status.innerText = ">> Encryption Successful.";
            status.style.color = "#00ff41";
        }, 100);
    };

    reader.readAsDataURL(file);
}

function copyText() {
    const copyText = document.getElementById("base64Output");
    const status = document.getElementById('statusMsg');
    status.innerText = ">> Copying...";
    
    setTimeout(() => {
        copyText.select();
        document.execCommand("copy");
        status.innerText = ">> COPIED TO CLIPBOARD!";
        status.style.color = "#58a6ff";
    }, 50);
}

// --- 3. SMART PASTE HANDLER (The Fix) ---
document.getElementById('base64Input').addEventListener('paste', function(e) {
    // 1. Browser ka default paste rokein (taake freeze na ho)
    e.preventDefault();
    
    // 2. Clipboard se data uthayen
    const pastedData = (e.clipboardData || window.clipboardData).getData('text');
    
    if (!pastedData) return;

    // 3. Data ko RAM mein save karein (Decode function yahan se uthayega)
    globalDecodeData = pastedData;

    // 4. Textarea mein "Preview" dikhayen agar data bara hai
    if (pastedData.length > 50000) {
        this.value = pastedData.substring(0, 2000) + 
                     "\n\n... [HUGE DATA DETECTED: Content Hidden to Prevent Lag] ...\n\n" + 
                     pastedData.slice(-500);
        
        // Success Message
        alert(`>> SUCCESS: ${pastedData.length} characters received!\nIt is stored in memory. You can click 'Decrypt' now.`);
    } else {
        // Agar data chota hai to poora dikhayen
        this.value = pastedData;
    }
});

// --- 4. Decode Logic (Updated to use Smart Paste) ---
function decodeFile() {
    // Pehle Smart Paste variable check karein, agar khali hai to Textarea check karein
    let base64String = globalDecodeData || document.getElementById('base64Input').value.trim();
    let fileName = document.getElementById('fileName').value || "recovered_file";
    
    if (!base64String) { alert(">> ERROR: Input is empty."); return; }

    // Check header
    if (!base64String.startsWith("data:")) {
        // Koshish karein ke agar user ne ghalat paste kiya hai to clean karein
        if (base64String.includes("HUGE DATA DETECTED")) {
            alert(">> ERROR: Please Paste again. Data corrupted.");
            return;
        }
        alert(">> CRITICAL ERROR: Code must start with 'data:'."); 
        return;
    }

    // Auto-detect extension
    if (!fileName.includes('.')) {
        if (base64String.includes('image/png')) fileName += ".png";
        else if (base64String.includes('image/jpeg')) fileName += ".jpg";
        else if (base64String.includes('application/pdf')) fileName += ".pdf";
        else if (base64String.includes('text/plain')) fileName += ".txt";
        else if (base64String.includes('video/mp4')) fileName += ".mp4";
        else fileName += ".bin"; 
    }

    try {
        const link = document.createElement('a');
        link.href = base64String;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Reset memory after download
        globalDecodeData = "";
        
    } catch (e) { 
        alert(">> FATAL ERROR: Browser refused download."); 
    }
}