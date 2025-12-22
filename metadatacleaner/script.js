// Syntax & Soz - StealthImg Logic (Fixed for Raw Data)

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const resultArea = document.getElementById('resultArea');
const previewImg = document.getElementById('previewImg');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const exifList = document.getElementById('exifList');

// --- EVENT LISTENERS ---

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

resetBtn.addEventListener('click', () => {
    resultArea.style.display = 'none';
    dropZone.style.display = 'flex';
    setStatus('idle', 'WAITING FOR INPUT');
    exifList.innerHTML = ''; // Clear list
    fileInput.value = ''; // Reset input to allow same file selection
});

// --- CORE FUNCTIONS ---

function handleFile(file) {
    if (!file) return;

    // Check File Type
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        if (file.type === 'image/png') {
             alert('Info: PNG files usually do not store GPS/Camera metadata. Processing anyway.');
        } else {
             alert('Please upload a JPG/JPEG file for EXIF scanning.');
        }
    }

    setStatus('processing', 'SCANNING RAW DATA...');

    // 1. EXTRACT REAL EXIF DATA (Directly from File Object)
    // Ye line ab direct file ko parhegi, image tag ko nahi.
    getRealExifData(file);

    // 2. SHOW PREVIEW & CLEAN
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            cleanImage(img, file.type, file.name);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function getRealExifData(file) {
    exifList.innerHTML = ""; // Clear old data
    let foundData = false;

    // FIX: Passing 'file' directly instead of 'img' element
    // This reads the raw binary data ensuring nothing is lost.
    EXIF.getData(file, function() {
        const allMetaData = EXIF.getAllTags(this);
        console.log("Detected Metadata:", allMetaData); // Debugging ke liye console check karein

        if (Object.keys(allMetaData).length > 0) {
            
            // Device Info
            if (allMetaData.Make || allMetaData.Model) {
                const device = `${allMetaData.Make || ''} ${allMetaData.Model || ''}`;
                addItem(`Device: ${device}`);
                foundData = true;
            }
            
            // Date Time
            if (allMetaData.DateTimeOriginal || allMetaData.DateTime) {
                addItem(`Date: ${allMetaData.DateTimeOriginal || allMetaData.DateTime}`);
                foundData = true;
            }
            
            // Software
            if (allMetaData.Software) {
                addItem(`Software: ${allMetaData.Software}`);
                foundData = true;
            }

            // GPS Check
            if (allMetaData.GPSLatitude || allMetaData.GPSLongitude) {
                addItem(`GPS Data: DETECTED & LOGGED`);
                foundData = true;
            }

            // Exposure/ISO (Extra info)
            if (allMetaData.ISOSpeedRatings) {
                addItem(`ISO Speed: ${allMetaData.ISOSpeedRatings}`);
                foundData = true;
            }

            if (!foundData) {
                addItem("No sensitive EXIF data found (Safe Image).");
            }

        } else {
            addItem("No EXIF metadata detected.");
        }
    });
}

function addItem(text) {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fas fa-bug"></i> ${text}`;
    exifList.appendChild(li);
}

function cleanImage(img, mimeType, fileName) {
    // Create a canvas to re-render the pixels
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Metadata is stripped here
    const cleanDataUrl = canvas.toDataURL(mimeType, 0.95);

    setTimeout(() => {
        dropZone.style.display = 'none';
        resultArea.style.display = 'block';
        previewImg.src = cleanDataUrl;
        
        setStatus('done', 'METADATA WIPED');
        
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'cleaned_' + fileName;
            link.href = cleanDataUrl;
            link.click();
        };
    }, 800); 
}

function setStatus(state, text) {
    statusIndicator.className = 'indicator ' + state;
    statusText.innerText = text;
}