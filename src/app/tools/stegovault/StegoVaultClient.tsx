"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import "./stegovault.css";

export default function StegoVaultClient() {
  const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt">("encrypt");
  
  // Encryption state
  const [encFile, setEncFile] = useState<File | null>(null);
  const [encImageSrc, setEncImageSrc] = useState<string | null>(null);
  const [secretMsg, setSecretMsg] = useState("");
  
  // Decryption state
  const [decFile, setDecFile] = useState<File | null>(null);
  const [decImageSrc, setDecImageSrc] = useState<string | null>(null);
  const [decodedText, setDecodedText] = useState<string | null>(null);

  const encInputRef = useRef<HTMLInputElement>(null);
  const decInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenImgRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, mode: "enc" | "dec") => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        
        if (mode === "enc") {
          setEncFile(uploadedFile);
          setEncImageSrc(src);
        } else {
          setDecFile(uploadedFile);
          setDecImageSrc(src);
          setDecodedText(null);
        }

        // Draw to canvas immediately to avoid async download blockers later
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(img, 0, 0);
          }
        };
        img.src = src;
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, mode: "enc" | "dec") => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files?.[0];
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;

        if (mode === "enc") {
          setEncFile(uploadedFile);
          setEncImageSrc(src);
        } else {
          setDecFile(uploadedFile);
          setDecImageSrc(src);
          setDecodedText(null);
        }

        // Draw to canvas immediately
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(img, 0, 0);
          }
        };
        img.src = src;
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const encodeImage = () => {
    if (!encImageSrc || !canvasRef.current) {
      alert("Please upload an image first!");
      return;
    }
    if (!secretMsg) {
      alert("Please enter a secret message.");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0) {
      alert("Image not fully loaded yet, please try again.");
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let binaryText = "";
    for (let i = 0; i < secretMsg.length; i++) {
      let binaryChar = secretMsg.charCodeAt(i).toString(2).padStart(8, '0');
      binaryText += binaryChar;
    }
    binaryText += "00000000"; // NULL terminator

    if (binaryText.length > (data.length / 4) * 3) {
      alert("Text is too long for this image!");
      return;
    }

    let dataIndex = 0;
    for (let i = 0; i < binaryText.length; i++) {
      if ((dataIndex + 1) % 4 === 0) dataIndex++; // Skip Alpha channel
      const bit = parseInt(binaryText[i]);
      data[dataIndex] = (data[dataIndex] & 0xFE) | bit; // Modify LSB
      dataIndex++;
    }

    ctx.putImageData(imgData, 0, 0);

    const link = document.createElement('a');
    link.download = 'secret_image.png'; // Must be PNG for lossless LSB
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const decodeImage = () => {
    if (!decImageSrc || !canvasRef.current) {
      alert("Please upload an encoded image first!");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0) {
      alert("Image not fully loaded yet, please try again.");
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let binaryText = "";
    let decodedString = "";
    let dataIndex = 0;

    while (true) {
      if ((dataIndex + 1) % 4 === 0) dataIndex++; // Skip Alpha channel

      const bit = data[dataIndex] & 1; // Extract LSB
      binaryText += bit;

      if (binaryText.length === 8) {
        const charCode = parseInt(binaryText, 2);
        if (charCode === 0) break; // NULL terminator found

        decodedString += String.fromCharCode(charCode);
        binaryText = "";

        if (decodedString.length > 10000) break; // Safety break
      }
      dataIndex++;
      if (dataIndex >= data.length) break; // Safety break
    }

    if (decodedString.length > 0 && /^[\x20-\x7E\r\n\t]+$/.test(decodedString)) {
      setDecodedText(decodedString);
    } else {
      setDecodedText("ERROR: No hidden message found or file is corrupted/compressed.");
    }
  };

  return (
    <div className="stegovault-wrapper">
      <div className="container">
          
          <nav className="sidebar">
              <Link href="/" className="brand">← Back to Terminal</Link>
              <div className="info-box">
                  <h3><i className="fas fa-user-secret"></i> STEGANOGRAPHY</h3>
                  <p>Hide secret text messages inside the pixels of an image using LSB (Least Significant Bit) manipulation.</p>
                  <p><strong>Client-Side Only:</strong> Your secrets never leave this browser.</p>
              </div>
              <div className="status-box">
                  <p>MODE</p>
                  <div 
                    id="modeIndicator" 
                    className={`indicator ${activeTab === 'encrypt' ? 'encrypt' : 'decrypt'}`}
                  ></div> 
                  <span id="modeText">{activeTab === 'encrypt' ? 'ENCRYPTION ACTIVE' : 'DECRYPTION ACTIVE'}</span>
              </div>
          </nav>

          <main className="tool-area">
              <header>
                  <h1>Stego<span className="accent">Vault</span></h1>
                  <p>Hide data in plain sight.</p>
              </header>

              <div className="tabs">
                  <button 
                    className={`tab-btn ${activeTab === 'encrypt' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('encrypt')}
                  >
                    Hide Data (Encode)
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'decrypt' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('decrypt')}
                  >
                    Reveal Data (Decode)
                  </button>
              </div>

              <div id="encryptSection" className={`panel ${activeTab === 'encrypt' ? 'active' : ''}`}>
                  <div 
                    className={`upload-box ${encFile ? 'uploaded' : ''}`} 
                    id="encDropZone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, 'enc')}
                    onClick={() => encInputRef.current?.click()}
                  >
                      <input 
                        type="file" 
                        id="encInput" 
                        accept="image/*" 
                        style={{ display: "none" }}
                        ref={encInputRef} 
                        onChange={(e) => handleFileUpload(e, 'enc')} 
                      />
                      <p>{encFile ? encFile.name : '1. Upload Cover Image'}</p>
                  </div>
                  
                  <textarea 
                    id="secretMsg" 
                    className="terminal-textarea"
                    placeholder="Enter your secret message here..."
                    value={secretMsg}
                    onChange={(e) => setSecretMsg(e.target.value)}
                  ></textarea>
                  
                  <input type="password" id="encPass" placeholder="Optional Password (Not used in v1.0)" disabled style={{ cursor: "not-allowed", opacity: 0.5 }} />

                  <button className="btn-action" onClick={encodeImage}>
                      <i className="fas fa-lock"></i> Encrypt & Download
                  </button>
              </div>

              <div id="decryptSection" className={`panel ${activeTab === 'decrypt' ? 'active' : ''}`}>
                  <div 
                    className={`upload-box ${decFile ? 'uploaded' : ''}`} 
                    id="decDropZone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, 'dec')}
                    onClick={() => decInputRef.current?.click()}
                  >
                      <input 
                        type="file" 
                        id="decInput" 
                        accept="image/*" 
                        style={{ display: "none" }}
                        ref={decInputRef} 
                        onChange={(e) => handleFileUpload(e, 'dec')} 
                      />
                      <p>{decFile ? decFile.name : '1. Upload Encrypted Image'}</p>
                  </div>

                  <div className="output-box">
                      <h4>DECODED MESSAGE:</h4>
                      <textarea 
                        id="decodedText" 
                        className="terminal-textarea"
                        readOnly
                        placeholder="Waiting for image..."
                        value={decodedText || ""}
                      ></textarea>
                      {decodedText && !decodedText.startsWith("ERROR") && (
                        <button 
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(decodedText);
                              alert("Copied Secret Message!");
                            } catch (e) {
                              alert("Copy failed");
                            }
                          }}
                          style={{ marginTop: '10px', background: '#333', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', fontFamily: "'Fira Code', monospace" }}
                        >
                          📋 Copy Secret Message
                        </button>
                      )}
                  </div>

                  <button className="btn-action" onClick={decodeImage}>
                      <i className="fas fa-unlock"></i> Reveal Message
                  </button>
              </div>
              
              <canvas id="stegoCanvas" ref={canvasRef} style={{ display: "none" }}></canvas>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                ref={hiddenImgRef} 
                src={activeTab === 'encrypt' ? (encImageSrc || undefined) : (decImageSrc || undefined)} 
                alt="Hidden processing" 
                style={{ display: "none" }} 
              />
          </main>
                    <div style={{ marginTop: '20px' }}>
                <textarea className="input-area" placeholder="Enter data here..."></textarea>
                <button className="copy-btn" onClick={(e) => { const t = e.currentTarget.previousElementSibling as HTMLTextAreaElement; if(t && t.value) { navigator.clipboard.writeText(t.value); } }}>Copy to Clipboard</button>
              </div>
          </div>
    </div>
  );
}


