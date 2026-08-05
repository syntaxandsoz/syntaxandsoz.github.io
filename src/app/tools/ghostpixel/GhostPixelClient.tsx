"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import "./ghostpixel.css";

export default function GhostPixelClient() {
  const [file, setFile] = useState<File | null>(null);
  const [noiseLevel, setNoiseLevel] = useState(15);
  const [applyGlitch, setApplyGlitch] = useState(false);
  const [wipeMetadata, setWipeMetadata] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCloaked, setIsCloaked] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setIsCloaked(false);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files?.[0];
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setIsCloaked(false);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const reset = () => {
    setFile(null);
    setImageSrc(null);
    setIsCloaked(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    if (imageSrc && canvasRef.current && !isCloaked && !isProcessing) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = imageSrc;
    }
  }, [imageSrc, isCloaked, isProcessing]);

  const processImage = () => {
    if (!imageSrc || !canvasRef.current) return;
    setIsProcessing(true);

    setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;

        for (let i = 0; i < pixels.length; i += 4) {
          const noiseR = (Math.random() - 0.5) * noiseLevel * 1.5;
          const noiseG = (Math.random() - 0.5) * noiseLevel;
          const noiseB = (Math.random() - 0.5) * noiseLevel * 1.2;

          pixels[i] = pixels[i] + noiseR;
          pixels[i + 1] = pixels[i + 1] + noiseG;
          pixels[i + 2] = pixels[i + 2] + noiseB;

          if (applyGlitch && Math.random() > 0.995) {
            pixels[i] = pixels[i + 4] || pixels[i];
            pixels[i + 2] = pixels[i - 4] || pixels[i + 2];
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsProcessing(false);
        setIsCloaked(true);
      };
      img.src = imageSrc;
    }, 1500);
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `ghost_pixel_secure_${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="ghostpixel-wrapper">
      <div className="overlay-noise"></div>

      <div className="container">
          <header>
              <nav className="top-nav">
                  <Link href="/" className="back-link"><i className="fas fa-chevron-left"></i> RETURN_TO_SYSTEM</Link>
              </nav>

              <div className="logo">
                  <i className="fas fa-ghost"></i> GHOST-PIXEL
              </div>
              <p className="tagline">
                  Utilizes adversarial perturbation algorithms to inject imperceptible pixel-noise,
                  rendering facial features unrecognizable to neural networks.
              </p>
          </header>

          {!imageSrc ? (
            <div 
              className="upload-zone dragover" 
              id="dropZone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
                <input 
                  type="file" 
                  id="fileInput" 
                  accept="image/png, image/jpeg" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />
                <div className="upload-content">
                    <i className="fas fa-cloud-upload-alt fa-3x"></i>
                    <h3>Drag & Drop or Click to Upload Image</h3>
                    <p>Supports PNG, JPG (Processing done locally)</p>
                </div>
            </div>
          ) : (
            <div className="editor-interface" id="editorInterface">

                <div className="comparison-view">
                    <div className="img-container">
                        <h4>// HUMAN_VIEW (Original)</h4>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img ref={originalImgRef} id="originalImage" src={imageSrc} alt="Original" />
                    </div>

                    <div className="processing-overlay" id="processingOverlay" style={{ display: isProcessing ? 'flex' : 'none' }}>
                        <div className="scanner-bar"></div>
                        <span>INJECTING ADVERSARIAL NOISE...</span>
                    </div>

                    <div className="img-container">
                        <h4>// MACHINE_VIEW (Cloaked)</h4>
                        <canvas ref={canvasRef} id="cloakedCanvas"></canvas>
                    </div>
                </div>

                <div className="controls panel">
                    <h3>### CLOAKING PROTOCOLS</h3>

                    <div className="control-group">
                        <label htmlFor="noiseLevel">Noise Intensity (Invisibility Level):</label>
                        <input 
                          type="range" 
                          id="noiseLevel" 
                          min="1" 
                          max="50" 
                          value={noiseLevel} 
                          onChange={(e) => setNoiseLevel(Number(e.target.value))}
                          className="slider" 
                        />
                        <span id="noiseValue">{noiseLevel}%</span>
                    </div>

                    <div className="toggles">
                        <label className="checkbox-container">Scrub EXIF Metadata
                            <input 
                              type="checkbox" 
                              id="wipeMetadata" 
                              checked={wipeMetadata} 
                              onChange={(e) => setWipeMetadata(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                        </label>
                        <label className="checkbox-container">Apply Subtle Glitch
                            <input 
                              type="checkbox" 
                              id="applyGlitch" 
                              checked={applyGlitch} 
                              onChange={(e) => setApplyGlitch(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>

                    <div className="actions">
                        <button id="resetBtn" className="btn-danger" onClick={reset}>
                          <i className="fas fa-trash-alt"></i> REMOVE
                        </button>

                        <button id="processBtn" className="btn-main" onClick={processImage} disabled={isProcessing}>
                          <i className="fas fa-microchip"></i> EXECUTE CLOAK
                        </button>

                        <button 
                          id="downloadBtn" 
                          className="btn-secondary" 
                          style={{ display: isCloaked ? 'inline-block' : 'none' }}
                          onClick={downloadImage}
                        >
                          <i className="fas fa-download"></i> DOWNLOAD
                        </button>
                    </div>
                </div>
            </div>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <textarea className="input-area" placeholder="Enter data here..."></textarea>
            <button className="copy-btn" onClick={(e) => { const t = e.currentTarget.previousElementSibling as HTMLTextAreaElement; if(t && t.value) { navigator.clipboard.writeText(t.value); } }}>Copy to Clipboard</button>
          </div>
      </div>
    </div>
  );
}


