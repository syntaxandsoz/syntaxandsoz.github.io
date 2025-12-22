// Syntax & Soz - StegoVault Logic

const encInput = document.getElementById('encInput');
const decInput = document.getElementById('decInput');
const encDrop = document.getElementById('encDropZone');
const decDrop = document.getElementById('decDropZone');
const canvas = document.getElementById('stegoCanvas');
const ctx = canvas.getContext('2d');

let loadedImage = null;

// --- TABS LOGIC ---
function switchTab(mode) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    if (mode === 'encrypt') {
        document.getElementById('encryptSection').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        updateStatus('encrypt', 'ENCRYPTION ACTIVE');
    } else {
        document.getElementById('decryptSection').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        updateStatus('decrypt', 'DECRYPTION ACTIVE');
    }
}

function updateStatus(cls, text) {
    document.getElementById('modeIndicator').className = 'indicator ' + cls;
    document.getElementById('modeText').innerText = text;
}

// --- FILE HANDLING ---
encInput.addEventListener('change', (e) => handleImageUpload(e.target.files[0], 'enc'));
decInput.addEventListener('change', (e) => handleImageUpload(e.target.files[0], 'dec'));

// Click to upload
encDrop.addEventListener('click', () => encInput.click());
decDrop.addEventListener('click', () => decInput.click());

function handleImageUpload(file, type) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            loadedImage = img;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Visual Feedback
            const dropZone = type === 'enc' ? encDrop : decDrop;
            dropZone.classList.add('uploaded');
            dropZone.querySelector('p').innerText = "Image Loaded: " + file.name;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// --- ENCRYPTION LOGIC ---
function encodeImage() {
    if (!loadedImage) { alert("Please upload an image first!"); return; }
    
    const text = document.getElementById('secretMsg').value;
    if (!text) { alert("Please enter a secret message."); return; }

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Convert text to binary string
    let binaryText = "";
    for (let i = 0; i < text.length; i++) {
        let binaryChar = text.charCodeAt(i).toString(2).padStart(8, '0');
        binaryText += binaryChar;
    }
    // Add NULL terminator (00000000) to signal end of message
    binaryText += "00000000";

    // Check if image is big enough
    if (binaryText.length > data.length / 4) {
        alert("Text is too long for this image!");
        return;
    }

    // Embed binary into LSB of Red channel
    let dataIndex = 0;
    for (let i = 0; i < binaryText.length; i++) {
        // Pixel structure: R, G, B, A (we use R, G, B channels sequentially)
        // Here we modify the bit of the data array directly
        // Make index even (clear LSB) then add bit
        
        // Skip Alpha (every 4th byte)
        if ((dataIndex + 1) % 4 === 0) dataIndex++; 

        let bit = parseInt(binaryText[i]);
        data[dataIndex] = (data[dataIndex] & 0xFE) | bit; // Modify LSB
        dataIndex++;
    }

    // Put new data back
    ctx.putImageData(imgData, 0, 0);

    // Download
    const link = document.createElement('a');
    link.download = 'secret_image.png'; // Must be PNG to be lossless
    link.href = canvas.toDataURL();
    link.click();
    
    alert("Message Hidden! Downloading image...");
}

// --- DECRYPTION LOGIC ---
function decodeImage() {
    if (!loadedImage) { alert("Please upload an encoded image first!"); return; }

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    let binaryText = "";
    let decodedString = "";

    // Read LSBs
    let dataIndex = 0;
    while (true) {
        if ((dataIndex + 1) % 4 === 0) dataIndex++; // Skip Alpha

        let bit = data[dataIndex] & 1; // Get LSB
        binaryText += bit;

        // Every 8 bits, convert to char
        if (binaryText.length === 8) {
            let charCode = parseInt(binaryText, 2);
            if (charCode === 0) break; // End of message found
            
            decodedString += String.fromCharCode(charCode);
            binaryText = "";
            
            // Safety break for very large images/noise
            if (decodedString.length > 10000) break; 
        }
        dataIndex++;
        
        // Safety break
        if (dataIndex >= data.length) break;
    }

    const output = document.getElementById('decodedText');
    if (decodedString.length > 0 && /^[ -~]+$/.test(decodedString)) {
        // Regex checks for printable ASCII (basic check)
        output.innerText = decodedString;
        output.className = 'revealed';
    } else {
        output.innerText = "No hidden message found or file is corrupted/compressed.";
        output.className = 'placeholder';
    }
}