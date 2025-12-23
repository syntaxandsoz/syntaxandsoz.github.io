// --- SYMPHONY OF SYNTAX (CORE ENGINE) ---
// Features: 9:16 Video, Clean UI, Professional Timestamping

let audioCtx;
let isPlaying = false;
let timeoutIds = [];
let mediaRecorder;
let audioChunks = [];
let videoRecorder;
let videoChunks = [];
let dest; // Audio Destination
let canvasStream;

const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');

// --- HELPER: GENERATE PROFESSIONAL TIMESTAMP ---
function getTimestampFilename(extension) {
    const now = new Date();
    
    // Format Date: 23-Dec-2025
    const datePart = now.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    }).replace(/ /g, '-'); // Replace spaces with dashes

    // Format Time: 12-14-55 (Safe for Windows filenames)
    const timePart = now.toLocaleTimeString('en-GB', { 
        hour12: false 
    }).replace(/:/g, '-'); 

    return `Symphony_Sequence_${datePart}_${timePart}.${extension}`;
}

// --- SETUP CANVAS FOR 9:16 HIGH RES ---
function resizeCanvas() {
    canvas.width = 720;  // High Quality Width
    canvas.height = 1280; // High Quality Height (9:16)
}
resizeCanvas();

async function playMusic() {
    const code = document.getElementById('codeInput').value;
    const status = document.getElementById('statusText');
    const dlAudio = document.getElementById('downloadAudioBtn');
    const dlVideo = document.getElementById('downloadVideoBtn');
    const saveSource = document.getElementById('saveSourceBtn');

    // Reset UI
    dlAudio.classList.add('hidden');
    dlVideo.classList.add('hidden');
    saveSource.classList.add('hidden');
    
    if (!code) {
        status.innerText = "Error: Input empty.";
        return;
    }

    if (isPlaying) stopMusic();

    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }

    // --- SETUP RECORDING ---
    dest = audioCtx.createMediaStreamDestination();
    audioChunks = [];
    videoChunks = [];

    // 1. Audio Recorder
    const audioOptions = { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 128000 };
    mediaRecorder = new MediaRecorder(dest.stream, audioOptions);
    
    mediaRecorder.ondataavailable = (e) => { if(e.data.size > 0) audioChunks.push(e.data); };
    mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        dlAudio.href = url;
        
        // SETTING DYNAMIC NAME (AUDIO)
        dlAudio.download = getTimestampFilename("wav");
        
        dlAudio.classList.remove('hidden');
        saveSource.classList.remove('hidden');
    };

    // 2. Video Recorder
    canvasStream = canvas.captureStream(30); 
    const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
    ]);

    let videoMime = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(videoMime)) videoMime = 'video/webm';

    videoRecorder = new MediaRecorder(combinedStream, {
        mimeType: videoMime,
        videoBitsPerSecond: 2500000 
    });

    videoRecorder.ondataavailable = (e) => { if(e.data.size > 0) videoChunks.push(e.data); };
    videoRecorder.onstop = () => {
        const blob = new Blob(videoChunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        dlVideo.href = url;
        
        // SETTING DYNAMIC NAME (VIDEO)
        dlVideo.download = getTimestampFilename("mp4");
        
        dlVideo.classList.remove('hidden');
        status.innerText = "Processing Complete. Ready to Export.";
        status.style.color = "#bd00ff";
    };

    mediaRecorder.start();
    videoRecorder.start();

    isPlaying = true;
    status.innerText = "Synthesizing Rhythm Sequence...";
    status.style.color = "#00ff41";

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128; 
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    drawVisualizer(analyser, dataArray);

    let timeOffset = 0;
    const baseBeat = 0.18; 

    for (let i = 0; i < code.length; i++) {
        if (!isPlaying) break;

        const char = code[i];
        const charCode = code.charCodeAt(i);

        if (charCode < 33) {
            timeOffset += baseBeat / 1.5;
            continue;
        }

        let type = 'duff'; 
        if (char.match(/[!@#$%^&*(),.?":{}|<>]/)) {
            type = 'snap';
        }

        scheduleSound(type, timeOffset, analyser);

        if (char === ';' || char === '}') {
            timeOffset += baseBeat * 2.5;
        } else {
            timeOffset += baseBeat;
        }
    }

    const endTimer = setTimeout(() => {
        if(isPlaying) {
            stopMusic(true);
        }
    }, timeOffset * 1000 + 1000);
    timeoutIds.push(endTimer);
}

function scheduleSound(type, time, analyser) {
    const t = setTimeout(() => {
        if (!isPlaying) return;
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(analyser);
        gainNode.connect(audioCtx.destination);
        gainNode.connect(dest);

        const now = audioCtx.currentTime;

        if (type === 'duff') {
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.4);
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(1.0, now + 0.02); 
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

            osc.start(now);
            osc.stop(now + 0.4);
        } else {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.6, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            osc.start(now);
            osc.stop(now + 0.1);
        }
    }, time * 1000);

    timeoutIds.push(t);
}

function stopMusic(finishedNaturally = false) {
    isPlaying = false;
    timeoutIds.forEach(id => clearTimeout(id));
    timeoutIds = [];
    
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    if (videoRecorder && videoRecorder.state !== 'inactive') videoRecorder.stop();

    if (!finishedNaturally) {
        document.getElementById('statusText').innerText = "Sequence Aborted.";
        document.getElementById('statusText').style.color = "#bd00ff";
    }
}

function drawVisualizer(analyser, dataArray) {
    if (!isPlaying) return;
    requestAnimationFrame(() => drawVisualizer(analyser, dataArray));
    try { analyser.getByteFrequencyData(dataArray); } catch(e) { return; }

    canvasCtx.fillStyle = '#050505';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const barWidth = (canvas.width / dataArray.length) * 2;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
        barHeight = dataArray[i] * 2.5; 
        const r = 0;
        const g = barHeight > 200 ? 255 : barHeight + 50;
        const b = barHeight > 100 ? 255 : 65;
        canvasCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        canvasCtx.fillRect(x, centerY - (barHeight/2), barWidth, barHeight);
        x += barWidth + 4; 
    }
    
    canvasCtx.fillStyle = '#222';
    canvasCtx.font = 'bold 30px "Fira Code"';
    canvasCtx.textAlign = 'center';
    canvasCtx.fillText("SYMPHONY OF SYNTAX", canvas.width / 2, canvas.height - 100);
}

// --- FILE HANDLING ---
function downloadSource() {
    const code = document.getElementById('codeInput').value;
    if(!code) return;
    const blob = new Blob([code], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    
    // SETTING DYNAMIC NAME (SOURCE FILE)
    anchor.download = getTimestampFilename("txt");
    
    anchor.click();
}

function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('codeInput').value = e.target.result;
        document.getElementById('statusText').innerText = "Source Key Loaded.";
        document.getElementById('statusText').style.color = "#fff";
    };
    reader.readAsText(file);
}