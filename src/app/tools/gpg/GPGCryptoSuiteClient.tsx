"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import * as openpgp from "openpgp";
import "./gpg.css";

export default function GPGCryptoSuiteClient() {
  const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt" | "keys">("encrypt");
  
  // Encrypt State
  const [encInputType, setEncInputType] = useState<"text" | "file">("text");
  const [encMethod, setEncMethod] = useState<"password" | "key">("password");
  const [encText, setEncText] = useState("");
  const [encFile, setEncFile] = useState<File | null>(null);
  const [encPass, setEncPass] = useState("");
  const [encPubKey, setEncPubKey] = useState("");
  const [encStatus, setEncStatus] = useState("Ready.");
  const [encOutput, setEncOutput] = useState("");
  const [encIsProcessing, setEncIsProcessing] = useState(false);
  const [encDownloadData, setEncDownloadData] = useState<{ blob: Blob, name: string } | null>(null);

  // Decrypt State
  const [decInputType, setDecInputType] = useState<"text" | "file">("text");
  const [decMethod, setDecMethod] = useState<"password" | "key">("password");
  const [decText, setDecText] = useState("");
  const [decFile, setDecFile] = useState<File | null>(null);
  const [decPass, setDecPass] = useState("");
  const [decPrivKey, setDecPrivKey] = useState("");
  const [decPrivKeyPass, setDecPrivKeyPass] = useState("");
  const [decStatus, setDecStatus] = useState("Waiting for encrypted data...");
  const [decOutput, setDecOutput] = useState("");
  const [decIsProcessing, setDecIsProcessing] = useState(false);
  const [decDownloadData, setDecDownloadData] = useState<{ blob: Blob, name: string } | null>(null);

  // Key Gen State
  const [genName, setGenName] = useState("");
  const [genEmail, setGenEmail] = useState("");
  const [genPass, setGenPass] = useState("");
  const [genStatus, setGenStatus] = useState("System ready.");
  const [genPubKey, setGenPubKey] = useState("");
  const [genPrivKey, setGenPrivKey] = useState("");
  const [genIsProcessing, setGenIsProcessing] = useState(false);

  // Copy States
  const [copyEncStatus, setCopyEncStatus] = useState("Copy to Clipboard");
  const [copyDecStatus, setCopyDecStatus] = useState("Copy to Clipboard");
  const [copyPubKeyStatus, setCopyPubKeyStatus] = useState("Copy Public Key");
  const [copyPrivKeyStatus, setCopyPrivKeyStatus] = useState("Copy Private Key");

  const copyToClipboard = async (text: string, setStatus: (val: string) => void, defaultText: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied!");
      setTimeout(() => setStatus(defaultText), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setStatus("Error");
    }
  };

  const handleEncFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setEncFile(e.target.files[0]);
  };
  const handleDecFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setDecFile(e.target.files[0]);
  };

  const processEncryption = async () => {
    setEncStatus("Encrypting...");
    setEncIsProcessing(true);
    setEncOutput("");
    setEncDownloadData(null);

    const statusEl = document.getElementById('encStatus');
    if (statusEl) statusEl.style.color = "#eac54f";

    try {
      let message;
      let filename = "message.txt";

      if (encInputType === "file") {
        if (!encFile) throw new Error("No file selected");
        filename = encFile.name;
        const buffer = await encFile.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        message = await openpgp.createMessage({ binary: uint8Array, filename });
      } else {
        if (!encText) throw new Error("No text entered");
        message = await openpgp.createMessage({ text: encText });
      }

      let encrypted;
      if (encMethod === "password") {
        if (!encPass) throw new Error("Password required");
        encrypted = await openpgp.encrypt({
          message,
          passwords: [encPass],
          format: "armored"
        });
      } else {
        if (!encPubKey) throw new Error("Public Key required");
        const publicKey = await openpgp.readKey({ armoredKey: encPubKey });
        encrypted = await openpgp.encrypt({
          message,
          encryptionKeys: publicKey,
          format: "armored"
        });
      }

      setEncStatus("Encryption Success!");
      if (statusEl) statusEl.style.color = "#00ff41";
      setEncOutput(encrypted as string);
      
      const blob = new Blob([encrypted as string], { type: "text/plain" });
      setEncDownloadData({ blob, name: filename + ".asc" });
    } catch (err: any) {
      console.error(err);
      setEncStatus(`Error: ${err.message}`);
      if (statusEl) statusEl.style.color = "#da3633";
    }
    setEncIsProcessing(false);
  };

  const processDecryption = async () => {
    setDecStatus("Processing Data...");
    setDecIsProcessing(true);
    setDecOutput("");
    setDecDownloadData(null);

    const statusEl = document.getElementById('decStatus');
    if (statusEl) statusEl.style.color = "#eac54f";

    try {
      let message;
      if (decInputType === "file") {
        if (!decFile) throw new Error("Please select a file.");
        const buffer = await decFile.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        try {
          message = await openpgp.readMessage({ binaryMessage: uint8Array });
        } catch (e) {
          const textDecoder = new TextDecoder();
          const textContent = textDecoder.decode(uint8Array);
          message = await openpgp.readMessage({ armoredMessage: textContent.trim() });
        }
      } else {
        const text = decText.trim();
        if (!text) throw new Error("No text provided.");
        message = await openpgp.readMessage({ armoredMessage: text });
      }

      const decryptOptions: any = { message, format: "binary" };

      if (decMethod === "password") {
        if (!decPass) throw new Error("Password required.");
        decryptOptions.passwords = [decPass];
      } else {
        const keyText = decPrivKey.trim();
        if (!keyText) throw new Error("Private Key required.");
        let privateKey = await openpgp.readPrivateKey({ armoredKey: keyText });
        if (!privateKey.isDecrypted()) {
          if (!decPrivKeyPass) throw new Error("Key Password required.");
          try {
            privateKey = await openpgp.decryptKey({ privateKey, passphrase: decPrivKeyPass });
          } catch (e) {
            throw new Error("Wrong Key Password.");
          }
        }
        decryptOptions.decryptionKeys = privateKey;
      }

      const result = await openpgp.decrypt(decryptOptions);
      const decryptedData = result.data as Uint8Array;
      const filename = result.filename || "decrypted_file";

      setDecStatus("Decryption Successful!");
      if (statusEl) statusEl.style.color = "#00ff41";
      
      const blob = new Blob([decryptedData as unknown as BlobPart], { type: "application/octet-stream" });
      setDecDownloadData({ blob, name: filename });

      let outputStr = `✅ Success! Binary data recovered.\n\nFilename: ${filename}\nSize: ${decryptedData.byteLength} bytes\n\nClick Download below to save.`;
      
      try {
        if (decryptedData.byteLength < 50000) {
          const textDec = new TextDecoder("utf-8", { fatal: true });
          const str = textDec.decode(decryptedData);
          outputStr = str;
        }
      } catch (e) {
        // Not valid text, keep the binary success message
      }

      setDecOutput(outputStr);
    } catch (err: any) {
      console.error(err);
      setDecStatus(`Error: ${err.message}`);
      if (statusEl) statusEl.style.color = "#da3633";
    }
    setDecIsProcessing(false);
  };

  const generateKeys = async () => {
    setGenStatus("Generating ECC Keys...");
    setGenIsProcessing(true);
    setGenPubKey("");
    setGenPrivKey("");
    
    const statusEl = document.getElementById('genStatus');
    
    try {
      const { privateKey, publicKey } = await openpgp.generateKey({
        type: "ecc",
        curve: "curve25519" as any,
        userIDs: [{ name: genName || "User", email: genEmail || "test@test.com" }],
        passphrase: genPass || undefined
      });
      setGenPubKey(publicKey);
      setGenPrivKey(privateKey);
      setGenStatus("Done!");
      if (statusEl) statusEl.style.color = "#00ff41";
    } catch (err: any) {
      setGenStatus(`Error: ${err.message}`);
      if (statusEl) statusEl.style.color = "#da3633";
    }
    setGenIsProcessing(false);
  };

  return (
    <div className="gpg-wrapper">
      <div className="suite-container">
          <nav className="top-nav">
              <Link href="/" className="back-link">← Back to Terminal</Link>
          </nav>
          
          <h1>GPG CRYPTO SUITE</h1>

          <div className="tabs">
              <button 
                className={`tab-btn ${activeTab === 'encrypt' ? 'active' : ''}`} 
                onClick={() => setActiveTab('encrypt')}
              >
                🔒 ENCRYPT
              </button>
              <button 
                className={`tab-btn ${activeTab === 'decrypt' ? 'active' : ''}`} 
                onClick={() => setActiveTab('decrypt')}
              >
                🔓 DECRYPT
              </button>
              <button 
                className={`tab-btn ${activeTab === 'keys' ? 'active' : ''}`} 
                onClick={() => setActiveTab('keys')}
              >
                🔑 KEYS
              </button>
          </div>

          <div id="encryptTab" className={`section ${activeTab === 'encrypt' ? 'active' : ''}`}>
              <div className="form-group">
                  <label>1. INPUT TYPE</label>
                  <div className="toggle-group">
                      <label className="radio-label">
                        <input type="radio" name="inputType" value="text" checked={encInputType === 'text'} onChange={() => setEncInputType('text')} /> Text Message
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="inputType" value="file" checked={encInputType === 'file'} onChange={() => setEncInputType('file')} /> File (Any Format)
                      </label>
                  </div>
                  
                  {encInputType === 'text' ? (
                    <div id="textInputArea">
                        <textarea 
                          id="msgInput" 
                          placeholder="Enter secret text here..."
                          value={encText}
                          onChange={(e) => setEncText(e.target.value)}
                        ></textarea>
                    </div>
                  ) : (
                    <div id="fileInputArea">
                        <div className="file-drop">
                            <span id="fileName">{encFile ? `✅ ${encFile.name}` : "📂 Drag & Drop File or Click to Upload"}</span>
                            <input type="file" id="fileInput" onChange={handleEncFileUpload} />
                        </div>
                    </div>
                  )}
              </div>

              <div className="form-group">
                  <label>2. ENCRYPTION METHOD</label>
                  <div className="toggle-group">
                      <label className="radio-label">
                        <input type="radio" name="method" value="password" checked={encMethod === 'password'} onChange={() => setEncMethod('password')} /> Password (Symmetric)
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="method" value="key" checked={encMethod === 'key'} onChange={() => setEncMethod('key')} /> Public Key (Asymmetric)
                      </label>
                  </div>
                  
                  {encMethod === 'password' ? (
                    <div id="passArea">
                        <input 
                          type="password" 
                          id="encPassword" 
                          placeholder="Set a strong password..." 
                          value={encPass}
                          onChange={(e) => setEncPass(e.target.value)}
                        />
                    </div>
                  ) : (
                    <div id="keyArea">
                        <textarea 
                          id="pubKeyInput" 
                          placeholder="Paste Recipient's Public Key Block here..."
                          value={encPubKey}
                          onChange={(e) => setEncPubKey(e.target.value)}
                        ></textarea>
                    </div>
                  )}
              </div>

              <button className="btn-action" onClick={processEncryption} disabled={encIsProcessing}>
                START ENCRYPTION
              </button>
              <p id="encStatus" className="status-log">{encStatus}</p>

              {encOutput && (
                <div className="form-group" id="outputWrapper" style={{ marginTop: '20px' }}>
                    <label>3. OUTPUT</label>
                    <textarea id="finalOutput" className="terminal-textarea" readOnly placeholder="Result will appear here..." value={encOutput}></textarea>
                    
                    <button 
                      onClick={() => copyToClipboard(encOutput, setCopyEncStatus, "Copy to Clipboard")}
                      style={{ marginTop: '5px', background: '#333', border: '1px solid #555', padding: '10px', color: 'white', borderRadius: '4px', cursor: 'pointer', width: '100%', fontFamily: "'Fira Code', monospace", marginBottom: '5px' }}
                    >
                      📋 {copyEncStatus}
                    </button>

                    {encDownloadData && (
                      <button 
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = URL.createObjectURL(encDownloadData.blob);
                          a.download = encDownloadData.name;
                          a.click();
                        }} 
                        id="dlBtn" 
                        style={{ marginTop: '5px', background: '#1f6feb', border: 'none', padding: '10px', color: 'white', borderRadius: '4px', cursor: 'pointer', width: '100%', fontFamily: "'Fira Code', monospace" }}
                      >
                        ⬇ Download Encrypted File
                      </button>
                    )}
                </div>
              )}
          </div>

          <div id="decryptTab" className={`section ${activeTab === 'decrypt' ? 'active' : ''}`}>
              <div className="form-group">
                  <label>1. ENCRYPTED SOURCE</label>
                  <div className="toggle-group">
                      <label className="radio-label">
                        <input type="radio" name="decInputType" value="text" checked={decInputType === 'text'} onChange={() => setDecInputType('text')} /> PGP Text Block
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="decInputType" value="file" checked={decInputType === 'file'} onChange={() => setDecInputType('file')} /> Encrypted File (.gpg)
                      </label>
                  </div>
                  
                  {decInputType === 'text' ? (
                    <div id="decTextArea">
                        <textarea 
                          id="decMsgInput" 
                          placeholder="Paste -----BEGIN PGP MESSAGE----- here..."
                          value={decText}
                          onChange={(e) => setDecText(e.target.value)}
                        ></textarea>
                    </div>
                  ) : (
                    <div id="decFileArea">
                        <div className="file-drop">
                            <span id="decFileName">{decFile ? `✅ ${decFile.name}` : "📂 Upload Encrypted .gpg File"}</span>
                            <input type="file" id="decFileInput" onChange={handleDecFileUpload} />
                        </div>
                    </div>
                  )}
              </div>

              <div className="form-group">
                  <label>2. UNLOCK METHOD</label>
                  <div className="toggle-group">
                      <label className="radio-label">
                        <input type="radio" name="decMethod" value="password" checked={decMethod === 'password'} onChange={() => setDecMethod('password')} /> Password
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="decMethod" value="key" checked={decMethod === 'key'} onChange={() => setDecMethod('key')} /> Private Key
                      </label>
                  </div>
                  
                  {decMethod === 'password' ? (
                    <div id="decPassArea">
                        <input 
                          type="password" 
                          id="decPassword" 
                          placeholder="Enter the password used to encrypt..." 
                          value={decPass}
                          onChange={(e) => setDecPass(e.target.value)}
                        />
                    </div>
                  ) : (
                    <div id="decKeyArea">
                        <textarea 
                          id="privKeyInput" 
                          placeholder="Paste Your Private Key Block here..."
                          value={decPrivKey}
                          onChange={(e) => setDecPrivKey(e.target.value)}
                        ></textarea>
                        <input 
                          type="password" 
                          id="privKeyPass" 
                          placeholder="Key Password (if key is locked)" 
                          style={{ marginTop: '10px' }} 
                          value={decPrivKeyPass}
                          onChange={(e) => setDecPrivKeyPass(e.target.value)}
                        />
                    </div>
                  )}
              </div>

              <button className="btn-action btn-red" onClick={processDecryption} disabled={decIsProcessing}>
                UNLOCK & DECRYPT
              </button>
              <p id="decStatus" className="status-log">{decStatus}</p>

              {decOutput && (
                <div className="form-group" id="decOutputWrapper" style={{ marginTop: '20px' }}>
                    <label>3. DECRYPTED DATA</label>
                    <textarea id="decFinalOutput" className="terminal-textarea" readOnly placeholder="Original message will appear here..." value={decOutput}></textarea>
                    
                    <button 
                      onClick={() => copyToClipboard(decOutput, setCopyDecStatus, "Copy to Clipboard")}
                      style={{ marginTop: '5px', background: '#333', border: '1px solid #555', padding: '10px', color: 'white', borderRadius: '4px', cursor: 'pointer', width: '100%', fontFamily: "'Fira Code', monospace", marginBottom: '5px' }}
                    >
                      📋 {copyDecStatus}
                    </button>

                    {decDownloadData && (
                      <button 
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = URL.createObjectURL(decDownloadData.blob);
                          a.download = decDownloadData.name;
                          a.click();
                        }}
                        id="decDlBtn" 
                        style={{ marginTop: '5px', background: '#1f6feb', border: 'none', padding: '10px', color: 'white', borderRadius: '4px', cursor: 'pointer', width: '100%', fontFamily: "'Fira Code', monospace" }}
                      >
                        ⬇ Download Decrypted File
                      </button>
                    )}
                </div>
              )}
          </div>

          <div id="keygenTab" className={`section ${activeTab === 'keys' ? 'active' : ''}`}>
              <div className="form-group">
                  <label>USER IDENTITY</label>
                  <input 
                    type="text" 
                    id="genName" 
                    placeholder="Name" 
                    style={{ marginBottom: '10px' }} 
                    value={genName}
                    onChange={(e) => setGenName(e.target.value)}
                  />
                  <input 
                    type="email" 
                    id="genEmail" 
                    placeholder="Email" 
                    value={genEmail}
                    onChange={(e) => setGenEmail(e.target.value)}
                  />
              </div>
              <div className="form-group">
                  <label>PASSPHRASE (Optional)</label>
                  <input 
                    type="password" 
                    id="genPass" 
                    placeholder="Protect Private Key with Password" 
                    value={genPass}
                    onChange={(e) => setGenPass(e.target.value)}
                  />
              </div>
              
              <button id="genBtn" className="btn-action" onClick={generateKeys} disabled={genIsProcessing}>
                GENERATE KEY PAIR (ECC)
              </button>
              <p id="genStatus" className="status-log">{genStatus}</p>
              
              {genPubKey && (
                <>
                  <div className="form-group" style={{ marginTop: '20px' }}>
                      <label>PUBLIC KEY</label>
                      <textarea id="outPub" className="terminal-textarea" readOnly value={genPubKey}></textarea>
                      <button 
                        onClick={() => copyToClipboard(genPubKey, setCopyPubKeyStatus, "Copy Public Key")}
                        style={{ marginTop: '5px', background: '#333', border: '1px solid #555', padding: '5px', color: 'white', borderRadius: '4px', cursor: 'pointer', width: '100%', fontFamily: "'Fira Code', monospace" }}
                      >
                        📋 {copyPubKeyStatus}
                      </button>
                  </div>
                  <div className="form-group">
                      <label style={{ color: '#da3633' }}>PRIVATE KEY</label>
                      <textarea id="outPriv" className="terminal-textarea" readOnly style={{ borderColor: '#da3633', color: '#ff7b72' }} value={genPrivKey}></textarea>
                      <button 
                        onClick={() => copyToClipboard(genPrivKey, setCopyPrivKeyStatus, "Copy Private Key")}
                        style={{ marginTop: '5px', background: '#333', border: '1px solid #da3633', padding: '5px', color: '#ff7b72', borderRadius: '4px', cursor: 'pointer', width: '100%', fontFamily: "'Fira Code', monospace" }}
                      >
                        📋 {copyPrivKeyStatus}
                      </button>
                  </div>
                </>
              )}
          </div>

                    <div style={{ marginTop: '20px' }}>
                <textarea className="input-area" placeholder="Enter data here..."></textarea>
                <button className="copy-btn" onClick={(e) => { const t = e.currentTarget.previousElementSibling as HTMLTextAreaElement; if(t && t.value) { navigator.clipboard.writeText(t.value); } }}>Copy to Clipboard</button>
              </div>
          </div>
    </div>
  );
}


