"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import "./b64.css";

export default function B64Client() {
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");

  // Encode State
  const [encFile, setEncFile] = useState<File | null>(null);
  const [encProgress, setEncProgress] = useState<number | null>(null);
  const [encOutput, setEncOutput] = useState("");
  const [encStatus, setEncStatus] = useState("");

  // Decode State
  const [decInput, setDecInput] = useState("");
  const [decFileName, setDecFileName] = useState("");
  
  // Smart paste reference
  const globalDecodeData = useRef("");
  const encInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setEncFile(e.target.files[0]);
      setEncOutput("");
      setEncStatus("");
      setEncProgress(null);
    }
  };

  const encodeFile = () => {
    if (!encFile) {
      alert(">> ERROR: No file selected.");
      return;
    }

    const reader = new FileReader();
    setEncProgress(0);
    setEncOutput("");
    setEncStatus("");

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setEncProgress(percent);
      }
    };

    reader.onload = (e) => {
      setEncProgress(100);
      setTimeout(() => {
        setEncOutput(e.target?.result as string);
        setEncStatus(">> Encryption Successful.");
        setEncProgress(null);
      }, 100);
    };

    reader.readAsDataURL(encFile);
  };

  const copyText = () => {
    setEncStatus(">> Copying...");
    navigator.clipboard.writeText(encOutput).then(() => {
      setEncStatus(">> COPIED TO CLIPBOARD!");
    }).catch(() => {
      setEncStatus(">> ERROR: Failed to copy");
    });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (!pastedData) return;

    globalDecodeData.current = pastedData;

    if (pastedData.length > 50000) {
      const preview = pastedData.substring(0, 2000) + 
                      "\n\n... [HUGE DATA DETECTED: Content Hidden to Prevent Lag] ...\n\n" + 
                      pastedData.slice(-500);
      setDecInput(preview);
      alert(`>> SUCCESS: ${pastedData.length} characters received!\nIt is stored in memory. You can click 'Decrypt' now.`);
    } else {
      setDecInput(pastedData);
    }
  };

  const decodeFile = () => {
    let base64String = globalDecodeData.current || decInput.trim();
    let fileName = decFileName.trim() || "recovered_file";
    
    if (!base64String) {
      alert(">> ERROR: Input is empty.");
      return;
    }

    if (!base64String.startsWith("data:")) {
      if (base64String.includes("HUGE DATA DETECTED")) {
        alert(">> ERROR: Please Paste again. Data corrupted.");
        return;
      }
      alert(">> CRITICAL ERROR: Code must start with 'data:'.");
      return;
    }

    if (!fileName.includes(".")) {
      if (base64String.includes("image/png")) fileName += ".png";
      else if (base64String.includes("image/jpeg")) fileName += ".jpg";
      else if (base64String.includes("application/pdf")) fileName += ".pdf";
      else if (base64String.includes("text/plain")) fileName += ".txt";
      else if (base64String.includes("video/mp4")) fileName += ".mp4";
      else fileName += ".bin"; 
    }

    try {
      const link = document.createElement("a");
      link.href = base64String;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      globalDecodeData.current = "";
      setDecInput("");
      setDecFileName("");
    } catch (e) {
      alert(">> FATAL ERROR: Browser refused download.");
    }
  };

  return (
    <div className="b64-wrapper">
      <div className="container">
          <header>
              <h1 className="glitch">Stealth Converter</h1>
              <p>Securely convert Files to Base64 & Back. <br /> <span className="green">[Client-Side Only]</span></p>
          </header>

          <div className="tabs">
              <button 
                className={`tab-btn ${activeTab === 'encode' ? 'active' : ''}`} 
                onClick={() => setActiveTab('encode')}
              >
                File to Text (Encode)
              </button>
              <button 
                className={`tab-btn ${activeTab === 'decode' ? 'active' : ''}`} 
                onClick={() => setActiveTab('decode')}
              >
                Text to File (Decode)
              </button>
          </div>

          <div id="encode-panel" className={`panel ${activeTab === 'encode' ? 'active' : ''}`}>
              <div 
                className="upload-box"
                onClick={() => encInputRef.current?.click()}
              >
                  <input 
                    type="file" 
                    id="fileInput" 
                    ref={encInputRef}
                    onChange={handleFileUpload}
                  />
                  <p id="uploadText">{encFile ? encFile.name : 'Drag file here or Click to Upload'}</p>
                  <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '10px', marginBottom: '0' }}>(Recommended: Under 10MB)</p>
              </div>
              <button onClick={encodeFile} className="action-btn">Encrypt to Base64</button>
              
              {encProgress !== null && (
                <div id="progress-container">
                    <div className="progress-bar-track">
                        <div id="progress-bar-fill" className="progress-bar-fill" style={{ width: `${encProgress}%` }}></div>
                    </div>
                    <p id="progress-text">Encrypting... {encProgress}%</p>
                </div>
              )}

              {encOutput && (
                <div className="output-area" id="encodeOutput">
                    <textarea id="base64Output" className="terminal-textarea" readOnly value={encOutput}></textarea>
                    <div className="controls">
                        <button onClick={copyText} className="btn-copy-themed">&gt;&gt; Copy Encrypted Code</button>
                        <span id="statusMsg">{encStatus}</span>
                    </div>
                </div>
              )}
          </div>

          <div id="decode-panel" className={`panel ${activeTab === 'decode' ? 'active' : ''}`}>
              <textarea className="input-area" placeholder="Enter data here..."></textarea>
              <button className="copy-btn" onClick={(e) => { const t = e.currentTarget.previousElementSibling as HTMLTextAreaElement; if(t && t.value) { navigator.clipboard.writeText(t.value); } }}>Copy to Clipboard</button>
              <div className="inputs-row">
                  <input 
                    type="text" 
                    id="fileName" 
                    placeholder="filename (e.g., image.png)"
                    value={decFileName}
                    onChange={(e) => setDecFileName(e.target.value)}
                  />
              </div>
              <button onClick={decodeFile} className="action-btn">Decrypt & Download</button>
          </div>

          <footer>
              <Link href="/">← Back to Terminal</Link>
          </footer>
      </div>
    </div>
  );
}


