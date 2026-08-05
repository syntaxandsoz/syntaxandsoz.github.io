"use client";

import { useState, useRef, DragEvent } from "react";
import EXIF from "exif-js";
import Link from "next/link";
import "./metadatacleaner.css";

export default function MetadataCleanerClient() {
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [statusText, setStatusText] = useState("WAITING FOR INPUT");
  const [exifData, setExifData] = useState<string[]>([]);
  const [cleanImageSrc, setCleanImageSrc] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStatus("idle");
    setStatusText("WAITING FOR INPUT");
    setExifData([]);
    setCleanImageSrc(null);
    setOriginalFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFile = (file: File | undefined | null) => {
    if (!file) return;

    if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
      if (file.type === "image/png") {
        alert("Info: PNG files usually do not store GPS/Camera metadata. Processing anyway.");
      } else {
        alert("Please upload a JPG/JPEG file for EXIF scanning.");
        return;
      }
    }

    setOriginalFileName(file.name);
    setStatus("processing");
    setStatusText("SCANNING RAW DATA...");
    setExifData([]);

    // Extract EXIF data
    EXIF.getData(file as any, function(this: any) {
      const allMetaData = EXIF.getAllTags(this);
      const foundItems: string[] = [];
      let foundData = false;

      if (Object.keys(allMetaData).length > 0) {
        if (allMetaData.Make || allMetaData.Model) {
          foundItems.push(`Device: ${allMetaData.Make || ""} ${allMetaData.Model || ""}`);
          foundData = true;
        }
        if (allMetaData.DateTimeOriginal || allMetaData.DateTime) {
          foundItems.push(`Date: ${allMetaData.DateTimeOriginal || allMetaData.DateTime}`);
          foundData = true;
        }
        if (allMetaData.Software) {
          foundItems.push(`Software: ${allMetaData.Software}`);
          foundData = true;
        }
        if (allMetaData.GPSLatitude || allMetaData.GPSLongitude) {
          foundItems.push(`GPS Data: DETECTED & LOGGED`);
          foundData = true;
        }
        if (allMetaData.ISOSpeedRatings) {
          foundItems.push(`ISO Speed: ${allMetaData.ISOSpeedRatings}`);
          foundData = true;
        }

        if (!foundData) {
          foundItems.push("No sensitive EXIF data found (Safe Image).");
        }
      } else {
        foundItems.push("No EXIF metadata detected.");
      }

      setExifData(foundItems);
    });

    // Clean image
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const cleanDataUrl = canvas.toDataURL(file.type, 0.95);
          
          setTimeout(() => {
            setCleanImageSrc(cleanDataUrl);
            setStatus("done");
            setStatusText("METADATA WIPED");
          }, 800);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const downloadImage = () => {
    if (!cleanImageSrc) return;
    const link = document.createElement("a");
    link.download = "cleaned_" + originalFileName;
    link.href = cleanImageSrc;
    link.click();
  };

  return (
    <div className="metadatacleaner-wrapper">
      <div className="container">
          
          <nav className="sidebar">
              <Link href="/" className="brand">← Back to Terminal</Link>
              
              <div className="info-box">
                  <h3><i className="fas fa-shield-alt"></i> HOW IT WORKS</h3>
                  <p>Images contain hidden data (EXIF) like GPS location and device model.</p>
                  <p>This tool scans for <strong>Real Metadata</strong> and reconstructs the image to wipe it clean.</p>
              </div>

              <div className="status-box">
                  <p>PROCESS STATUS</p>
                  <div id="statusIndicator" className={`indicator ${status}`}></div> 
                  <span id="statusText">{statusText}</span>
              </div>
          </nav>

          <main className="tool-area">
              <header>
                  <h1>Stealth<span className="accent">Img</span></h1>
                  <p>Real-Time Exif Scanner & Metadata Wiper.</p>
              </header>

              {!cleanImageSrc ? (
                <div 
                  className={`upload-zone ${isDragOver ? 'dragover' : ''}`} 
                  id="dropZone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                    <input type="file" id="fileInput" accept="image/png, image/jpeg, image/jpg" hidden ref={fileInputRef} onChange={(e) => handleFile(e.target.files?.[0])} />
                    <div className="icon-box">
                        <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <h3>Drag & Drop or Click to Upload</h3>
                    <p>Supports JPG, JPEG (Extracts Real Data)</p>
                </div>
              ) : (
                <div className="result-area" id="resultArea">
                    
                    <div className="stats-grid">
                        <div className="stat-card danger">
                            <h4>HIDDEN DATA FOUND</h4>
                            <textarea 
                              className="terminal-textarea"
                              readOnly
                              value={exifData.join('\n')}
                              style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.2)', color: 'inherit', border: '1px solid rgba(255,255,255,0.1)', marginTop: '10px' }}
                            ></textarea>
                            <button 
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(exifData.join('\n'));
                                  alert("Copied Log!");
                                } catch(e) {
                                  alert("Copy failed");
                                }
                              }}
                              style={{ marginTop: '5px', background: 'transparent', border: '1px solid #da3633', color: '#ff7b72', padding: '5px 10px', cursor: 'pointer', fontFamily: "'Fira Code', monospace", fontSize: '0.8rem' }}
                            >
                              📋 Copy Log
                            </button>
                        </div>
                        <div className="arrow">➔</div>
                        <div className="stat-card success">
                            <h4>CLEANED FILE</h4>
                            <p>GPS Removed</p>
                            <p>Device Info Removed</p>
                            <p>Timestamp Removed</p>
                        </div>
                    </div>

                    <div className="preview-box">
                        <img id="previewImg" src={cleanImageSrc} alt="Cleaned Image" />
                    </div>

                    <button id="downloadBtn" className="btn-download" onClick={downloadImage}>
                        <i className="fas fa-download"></i> Download Clean Image
                    </button>
                    
                    <button id="resetBtn" className="btn-reset" onClick={reset}>Process Another</button>
                </div>
              )}

          </main>
                    <div style={{ marginTop: '20px' }}>
                <textarea className="input-area" placeholder="Enter data here..."></textarea>
                <button className="copy-btn" onClick={(e) => { const t = e.currentTarget.previousElementSibling as HTMLTextAreaElement; if(t && t.value) { navigator.clipboard.writeText(t.value); } }}>Copy to Clipboard</button>
              </div>
          </div>
    </div>
  );
}


