"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import "./symphony.css";

export default function SymphonyClient() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("System Ready.");
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState("");
  const [videoName, setVideoName] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Audio state refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const destRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const timeoutIdsRef = useRef<NodeJS.Timeout[]>([]);
  const isPlayingRef = useRef(false); // Ref for accurate state in callbacks

  // Update ref when state changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const getTimestampFilename = (extension: string) => {
    const now = new Date();
    const datePart = now.toLocaleDateString("en-GB", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric" 
    }).replace(/ /g, "-");
    const timePart = now.toLocaleTimeString("en-GB", { 
      hour12: false 
    }).replace(/:/g, "-"); 
    return `Symphony_Sequence_${datePart}_${timePart}.${extension}`;
  };

  const drawVisualizer = (analyser: AnalyserNode, dataArray: Uint8Array) => {
    if (!isPlayingRef.current) return;
    requestAnimationFrame(() => drawVisualizer(analyser, dataArray));
    
    try { 
      analyser.getByteFrequencyData(dataArray as any); 
    } catch(e) { 
      return; 
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    canvasCtx.fillStyle = "#050505";
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
    
    canvasCtx.fillStyle = "#222";
    canvasCtx.font = 'bold 30px "Fira Code"';
    canvasCtx.textAlign = "center";
    canvasCtx.fillText("SYMPHONY OF SYNTAX", canvas.width / 2, canvas.height - 100);
  };

  const scheduleSound = (type: string, time: number, analyser: AnalyserNode) => {
    const t = setTimeout(() => {
      if (!isPlayingRef.current || !audioCtxRef.current || !destRef.current) return;
      
      const audioCtx = audioCtxRef.current;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(analyser);
      gainNode.connect(audioCtx.destination);
      gainNode.connect(destRef.current);

      const now = audioCtx.currentTime;

      if (type === "duff") {
        osc.type = "sine"; 
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(1.0, now + 0.02); 
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600, now);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.6, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
      }
    }, time * 1000);

    timeoutIdsRef.current.push(t);
  };

  const stopMusic = (finishedNaturally = false) => {
    setIsPlaying(false);
    isPlayingRef.current = false; // Update ref synchronously
    
    timeoutIdsRef.current.forEach(id => clearTimeout(id));
    timeoutIdsRef.current = [];
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (videoRecorderRef.current && videoRecorderRef.current.state !== "inactive") {
      videoRecorderRef.current.stop();
    }

    if (!finishedNaturally) {
      setStatus("Sequence Aborted.");
    }
  };

  const playMusic = async () => {
    setAudioUrl(null);
    setVideoUrl(null);
    
    if (!code.trim()) {
      setStatus("Error: Input empty.");
      return;
    }

    if (isPlayingRef.current) stopMusic();

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set fixed high res for recording
    canvas.width = 720;
    canvas.height = 1280;

    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    
    if (audioCtxRef.current.state === "suspended") {
      await audioCtxRef.current.resume();
    }

    const audioCtx = audioCtxRef.current;
    destRef.current = audioCtx.createMediaStreamDestination();
    
    let audioChunks: Blob[] = [];
    let videoChunks: Blob[] = [];

    // 1. Audio Recorder
    try {
      const audioOptions = { mimeType: "audio/webm;codecs=opus", audioBitsPerSecond: 128000 };
      mediaRecorderRef.current = new MediaRecorder(destRef.current.stream, audioOptions);
    } catch(e) {
      // Fallback
      mediaRecorderRef.current = new MediaRecorder(destRef.current.stream);
    }
    
    mediaRecorderRef.current.ondataavailable = (e) => { if(e.data.size > 0) audioChunks.push(e.data); };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunks, { type: "audio/wav" });
      setAudioUrl(URL.createObjectURL(blob));
      setAudioName(getTimestampFilename("wav"));
    };

    // 2. Video Recorder
    const canvasStream = (canvas as any).captureStream(30); 
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...destRef.current.stream.getAudioTracks()
    ]);

    let videoMime = "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(videoMime)) videoMime = "video/webm";

    videoRecorderRef.current = new MediaRecorder(combinedStream, {
      mimeType: videoMime,
      videoBitsPerSecond: 2500000 
    });

    videoRecorderRef.current.ondataavailable = (e) => { if(e.data.size > 0) videoChunks.push(e.data); };
    videoRecorderRef.current.onstop = () => {
      const blob = new Blob(videoChunks, { type: "video/mp4" });
      setVideoUrl(URL.createObjectURL(blob));
      setVideoName(getTimestampFilename("mp4"));
      
      setStatus("Processing Complete. Ready to Export.");
    };

    mediaRecorderRef.current.start();
    videoRecorderRef.current.start();

    setIsPlaying(true);
    isPlayingRef.current = true; // Update ref synchronously
    setStatus("Synthesizing Rhythm Sequence...");

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128; 
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    drawVisualizer(analyser, dataArray);

    let timeOffset = 0;
    const baseBeat = 0.18; 

    for (let i = 0; i < code.length; i++) {
      if (!isPlayingRef.current) break; // Use ref for accurate state checking inside loop

      const char = code[i];
      const charCode = code.charCodeAt(i);

      if (charCode < 33) {
        timeOffset += baseBeat / 1.5;
        continue;
      }

      let type = "duff"; 
      if (char.match(/[!@#$%^&*(),.?":{}|<>]/)) {
        type = "snap";
      }

      scheduleSound(type, timeOffset, analyser);

      if (char === ";" || char === "}") {
        timeOffset += baseBeat * 2.5;
      } else {
        timeOffset += baseBeat;
      }
    }

    const endTimer = setTimeout(() => {
      if (isPlayingRef.current) {
        stopMusic(true);
      }
    }, timeOffset * 1000 + 1000);
    timeoutIdsRef.current.push(endTimer);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      setCode(evt.target?.result as string);
      setStatus("Source Key Loaded.");
    };
    reader.readAsText(file);
  };

  const downloadSource = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = getTimestampFilename("txt");
    anchor.click();
  };

  return (
    <div className="symphony-wrapper">
      <div className="container">
          <div className="brand">
              <span className="bracket">{"{"}</span>
              <div className="heartbeat"></div>
              <span className="bracket">{"}"}</span>
              <h1>Symphony of <span className="soz">Syntax</span></h1>
          </div>

          <div className="canvas-wrapper">
              <canvas id="visualizer" ref={canvasRef}></canvas>
          </div>

          <div className="input-section">
              <textarea 
                id="codeInput" 
                className="terminal-textarea"
                placeholder="// Paste Code Here...&#10;// Audio will be generated based on syntax."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              ></textarea>
              <button 
                onClick={async () => {
                  if (!code) return;
                  try {
                    await navigator.clipboard.writeText(code);
                    setStatus("Copied Code to Clipboard!");
                  } catch (e) {
                    setStatus("Copy failed");
                  }
                }}
                style={{ marginTop: '5px', background: '#333', color: 'white', padding: '5px 10px', border: '1px solid #555', cursor: 'pointer', fontFamily: "'Fira Code', monospace", width: '100%' }}
              >
                📋 Copy Input Code
              </button>
          </div>

          <div className="controls">
              <button id="playBtn" onClick={playMusic}>▶ Generate</button>
              <button id="stopBtn" onClick={() => stopMusic()}>⏹ Stop</button>
          </div>

          <div className="actions-area" id="downloadArea">
              <a 
                id="downloadAudioBtn" 
                className="download-link"
                style={{ display: audioUrl ? 'inline-block' : 'none' }}
                href={audioUrl || undefined}
                download={audioName}
              >🎵 Download Audio (.wav)</a>
              
              <a 
                id="downloadVideoBtn" 
                className="download-link"
                style={{ display: videoUrl ? 'inline-block' : 'none' }}
                href={videoUrl || undefined}
                download={videoName}
              >📱 Download Video (9:16)</a>
              
              <button 
                id="saveSourceBtn" 
                className="secondary-btn" 
                style={{ display: (audioUrl || videoUrl) ? 'inline-block' : 'none' }}
                onClick={downloadSource}
              >💾 Save Source File (Key)</button>
              
              <input type="file" id="fileUpload" accept=".txt,.js,.html,.css,.json" onChange={handleFileUpload} hidden ref={fileInputRef} />
              <button className="secondary-btn" onClick={() => fileInputRef.current?.click()}>📂 Upload Source to Restore</button>
          </div>

          <div className="status" id="statusText" style={{ color: status.includes("Aborted") ? "var(--soz)" : (status.includes("Error") ? "red" : (status.includes("Synthesizing") ? "var(--accent)" : "")) }}>
            {status}
          </div>
                    <div style={{ marginTop: '20px' }}>
                <textarea className="input-area" placeholder="Enter data here..."></textarea>
                <button className="copy-btn" onClick={(e) => { const t = e.currentTarget.previousElementSibling as HTMLTextAreaElement; if(t && t.value) { navigator.clipboard.writeText(t.value); } }}>Copy to Clipboard</button>
              </div>
          </div>
    </div>
  );
}


