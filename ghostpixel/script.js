// --- GHOST-PIXEL CORE LOGIC ---

const resetBtn = document.getElementById('resetBtn');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const editorInterface = document.getElementById('editorInterface');
const originalImage = document.getElementById('originalImage');
const cloakedCanvas = document.getElementById('cloakedCanvas');
const ctx = cloakedCanvas.getContext('2d', { willReadFrequently: true });

const noiseSlider = document.getElementById('noiseLevel');
const noiseValueDisplay = document.getElementById('noiseValue');
const processBtn = document.getElementById('processBtn');
const downloadBtn = document.getElementById('downloadBtn');
const processingOverlay = document.getElementById('processingOverlay');

let currentFile = null;

// --- EVENT LISTENERS ---

// --- RESET / REMOVE IMAGE LOGIC ---
resetBtn.addEventListener('click', () => {
    // 1. Clear variables
    currentFile = null;
    fileInput.value = ''; // Reset input so same file can be selected again

    // 2. Hide Interface & Show Upload Zone
    editorInterface.classList.add('hidden');
    dropZone.classList.remove('hidden');

    // 3. Reset Buttons
    downloadBtn.classList.add('hidden');

    // 4. Clear Canvas (Optional but good practice)
    ctx.clearRect(0, 0, cloakedCanvas.width, cloakedCanvas.height);
    originalImage.src = "";
});

// Drag & Drop Handling
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
});
['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });
});

dropZone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
});
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
});

// Slider Value Update
noiseSlider.addEventListener('input', () => {
    noiseValueDisplay.innerText = noiseSlider.value + "%";
});

// Process Button Click
processBtn.addEventListener('click', () => {
    if (!currentFile) return;
    startCloakingProcess();
});

// Download Button Click
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'ghost_pixel_secure_' + Date.now() + '.png';
    // Export canvas as PNG (metadata stripped by default)
    link.href = cloakedCanvas.toDataURL('image/png');
    link.click();
});


// --- FUNCTIONS ---

function handleFileUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Please upload a valid image file (PNG or JPG).');
        return;
    }
    currentFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        originalImage.onload = () => {
            // Setup canvas dimensions
            cloakedCanvas.width = originalImage.naturalWidth;
            cloakedCanvas.height = originalImage.naturalHeight;
            // Draw initial image
            ctx.drawImage(originalImage, 0, 0);

            // Show interface, hide upload zone
            dropZone.classList.add('hidden');
            editorInterface.classList.remove('hidden');
        }
    };
    reader.readAsDataURL(file);
}

function startCloakingProcess() {
    // 1. Text Dikhao (Scanning start)
    processingOverlay.classList.remove('hidden');
    downloadBtn.classList.add('hidden');

    // 2. 1.5 Second wait karo (Animation ke liye)
    setTimeout(() => {
        applyNoiseAndGlitch();

        // 3. Text Chupao (Scanning complete)
        processingOverlay.classList.add('hidden');
        downloadBtn.classList.remove('hidden');

    }, 1500);
}
function applyNoiseAndGlitch() {
    // 1. Reset Canvas
    ctx.drawImage(originalImage, 0, 0);

    const width = cloakedCanvas.width;
    const height = cloakedCanvas.height;

    // Get raw pixel data (RGBA array)
    let imgData = ctx.getImageData(0, 0, width, height);
    let pixels = imgData.data; // The massive array of pixel values

    const intensity = parseInt(noiseSlider.value);
    const applyGlitch = document.getElementById('applyGlitch').checked;

    // 2. THE CLOAKING LOOP (Iterate over every pixel)
    // Loop iterates by 4 because each pixel has 4 values (R, G, B, A)
    for (let i = 0; i < pixels.length; i += 4) {

        // ADVERSARIAL NOISE: Add random small values to RGB channels
        // This slightly shifts colors in a way humans ignore but AIs detect.
        // We use varying noise for each channel to make it harder to reverse.
        let noiseR = (Math.random() - 0.5) * intensity * 1.5;
        let noiseG = (Math.random() - 0.5) * intensity;
        let noiseB = (Math.random() - 0.5) * intensity * 1.2;

        pixels[i] = pixels[i] + noiseR;     // Red
        pixels[i + 1] = pixels[i + 1] + noiseG; // Green
        pixels[i + 2] = pixels[i + 2] + noiseB; // Blue
        // pixels[i+3] is Alpha, we leave it alone.

        // OPTIONAL: SUBTLE GLITCH EFFECT (Random row shifting)
        if (applyGlitch && Math.random() > 0.995) {
            // Occasionally shift pixel values drastically for visual glitch
            pixels[i] = pixels[i + 4] || pixels[i];
            pixels[i + 2] = pixels[i - 4] || pixels[i + 2];
        }
    }

    // 3. Put modified pixels back onto canvas
    ctx.putImageData(imgData, 0, 0);

    // Metadata is automatically wiped because we are exporting 
    // raw pixels from Canvas to a new PNG file.
}