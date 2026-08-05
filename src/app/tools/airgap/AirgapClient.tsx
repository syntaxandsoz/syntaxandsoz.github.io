"use client";

import { useState } from "react";
import Link from "next/link";
import "./airgap.css";

export default function AirgapClient() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`airgap-wrapper ${!sidebarOpen ? 'menu-closed' : ''}`}>
      <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
      </button>

      <div className="doc-layout">
          <nav className="sidebar" id="sidebar">
              <div className="brand">
                  <Link href="/">← Syntax & Soz</Link>
              </div>
              <ul>
                  <li><a href="#intro" className="active">1. Introduction</a></li>
                  <li><a href="#workflow">2. How it Works</a></li>
                  <li><a href="#install">3. Installation</a></li>
                  <li><a href="#usage">4. Usage Guide</a></li>
                  <li><a href="#source">5. Source Code</a></li>
                  <li><a href="#download" className="highlight">Download .py</a></li>
              </ul>
          </nav>

          <main className="content" id="content">
              
              <header>
                  <span className="badge">v1.0.2-stable</span>
                  <span className="badge green">MIT License</span>
                  <h1>Air-Gap Data Encoder</h1>
                  <p className="lead">A forensic Python utility designed to exfiltrate data from isolated (air-gapped) systems by converting raw binary/text into a visual QR code stream.</p>
              </header>

              <hr />

              <section id="intro">
                  <h2>1. Introduction</h2>
                  <p>
                      In high-security environments, systems are often "air-gapped" (physically isolated from the internet and USB ports). Moving data out of these systems is challenging.
                  </p>
                  <p>
                      The <strong>Air-Gap Encoder</strong> solves this by utilizing the system's display. It takes a payload (JSON, Text, or Files), chunks it into small packets, and renders them as a high-speed video of QR codes.
                  </p>
              </section>

              <section id="workflow">
                  <h2>2. Technical Workflow</h2>
                  <div className="workflow-box">
                      <p>INPUT DATA (JSON/Text)</p>
                      <div className="arrow">↓</div>
                      <p>CHUNKING ALGORITHM (200 bytes/frame)</p>
                      <div className="arrow">↓</div>
                      <p>QR GENERATION (Error Correction Level: L)</p>
                      <div className="arrow">↓</div>
                      <p>OPENCV RENDERING (Frame Sequencing)</p>
                      <div className="arrow">↓</div>
                      <p>OUTPUT: .AVI Video Stream</p>
                  </div>
              </section>

              <section id="install">
                  <h2>3. System Requirements</h2>
                  <p>You need Python 3.7+ installed. The script relies on <code>opencv-python</code> for video rendering and <code>qrcode</code> for matrix generation.</p>
                  <div className="code-block shell">
                      <span className="cmd">$ pip install opencv-python qrcode numpy</span>
                  </div>
              </section>

              <section id="usage">
                  <h2>4. Usage Guide</h2>
                  <p>Run the script directly from the terminal. You can modify the <code>sample_data</code> variable inside the script to change the payload.</p>
                  <div className="code-block shell">
                      <span className="cmd">$ python encoder.py</span>
                      <br />
                      <span className="output">&gt;&gt; Initializing Encoder...</span><br />
                      <span className="output">&gt;&gt; Total Chunks: 50</span><br />
                      <span className="output">[+] Encoding Frame 1/50</span><br />
                      <span className="output">[+] Encoding Frame 2/50</span><br />
                      <span className="output">...</span><br />
                      <span className="output">&gt;&gt; Video Sequence Complete. Saved as output.avi</span>
                  </div>
              </section>

              <section id="source">
                  <h2>5. Source Code</h2>
                  <p>The core logic is open-source. You can review the implementation below before downloading.</p>
                  
                  <div className="code-window">
                      <div className="window-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
                            <span className="filename">encoder.py</span>
                          </div>
                          <button 
                            onClick={async () => {
                              try {
                                const codeToCopy = `import cv2\nimport qrcode\nimport numpy as np\n\n# Configuration\nCHUNK_SIZE = 200\nOUTPUT_FILE = "evidence.avi"\n\ndef text_to_qr_video(data):\n    print(f"> Processing {len(data)} bytes...")\n    \n    # Initialize Video Writer (XVID Codec)\n    fourcc = cv2.VideoWriter_fourcc(*'XVID')\n    out = cv2.VideoWriter(OUTPUT_FILE, fourcc, 2.0, (500, 500))\n    \n    # Split Data\n    chunks = [data[i:i+CHUNK_SIZE] for i in range(0, len(data), CHUNK_SIZE)]\n\n    for i, chunk in enumerate(chunks):\n        # Create QR Matrix\n        qr = qrcode.QRCode(box_size=10, border=4)\n        qr.add_data(chunk)\n        qr.make(fit=True)\n        \n        # Convert to Image Frame\n        img = qr.make_image(fill='black', back_color='white')\n        frame = np.array(img.convert('RGB'))\n        frame = cv2.resize(frame, (500, 500))\n        \n        out.write(frame)\n        \n    out.release()\n    print(">> Done.")`;
                                await navigator.clipboard.writeText(codeToCopy);
                                alert("Copied Source Code!");
                              } catch(e) {
                                alert("Copy failed");
                              }
                            }}
                            style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontFamily: "'Fira Code', monospace" }}
                          >📋 Copy</button>
                      </div>
                      <pre><code className="python" dangerouslySetInnerHTML={{__html: `
<span class="kwd">import</span> cv2
<span class="kwd">import</span> qrcode
<span class="kwd">import</span> numpy <span class="kwd">as</span> np

<span class="comment"># Configuration</span>
CHUNK_SIZE = <span class="num">200</span>
OUTPUT_FILE = <span class="str">"evidence.avi"</span>

<span class="kwd">def</span> <span class="func">text_to_qr_video</span>(data):
    <span class="kwd">print</span>(<span class="str">f"&gt; Processing {len(data)} bytes..."</span>)
    
    <span class="comment"># Initialize Video Writer (XVID Codec)</span>
    fourcc = cv2.VideoWriter_fourcc(*<span class="str">'XVID'</span>)
    out = cv2.VideoWriter(OUTPUT_FILE, fourcc, <span class="num">2.0</span>, (<span class="num">500</span>, <span class="num">500</span>))
    
    <span class="comment"># Split Data</span>
    chunks = [data[i:i+CHUNK_SIZE] <span class="kwd">for</span> i <span class="kwd">in</span> <span class="func">range</span>(<span class="num">0</span>, <span class="func">len</span>(data), CHUNK_SIZE)]

    <span class="kwd">for</span> i, chunk <span class="kwd">in</span> <span class="func">enumerate</span>(chunks):
        <span class="comment"># Create QR Matrix</span>
        qr = qrcode.QRCode(box_size=<span class="num">10</span>, border=<span class="num">4</span>)
        qr.add_data(chunk)
        qr.make(fit=<span class="kwd">True</span>)
        
        <span class="comment"># Convert to Image Frame</span>
        img = qr.make_image(fill=<span class="str">'black'</span>, back_color=<span class="str">'white'</span>)
        frame = np.array(img.convert(<span class="str">'RGB'</span>))
        frame = cv2.resize(frame, (<span class="num">500</span>, <span class="num">500</span>))
        
        out.write(frame)
        
    out.release()
    <span class="kwd">print</span>(<span class="str">"&gt;&gt; Done."</span>)
                      `}}>
                      </code></pre>
                  </div>
              </section>

              <section id="download" className="center-box">
                  <h3>Ready to deploy?</h3>
                  <p>Download the standalone Python script.</p>
                  <a href="/downloads/encoder.py" download="encoder.py" className="btn-primary">
                      <span className="icon">⬇</span> Download Source (.py)
                  </a>
              </section>

              <footer>
                  <p>Designed by Syntax & Soz | &copy; 2025-2026 | For Educational Use Only</p>
              </footer>

          </main>
                    <div style={{ marginTop: '20px' }}>
                <textarea className="input-area" placeholder="Enter data here..."></textarea>
                <button className="copy-btn" onClick={(e) => { const t = e.currentTarget.previousElementSibling as HTMLTextAreaElement; if(t && t.value) { navigator.clipboard.writeText(t.value); } }}>Copy to Clipboard</button>
              </div>
          </div>
    </div>
  );
}



