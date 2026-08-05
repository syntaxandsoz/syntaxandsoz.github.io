"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./panopticon.css";

export default function PanopticonClient() {
  const [data, setData] = useState({
    cpu: "Analyzing...",
    ram: "Analyzing...",
    platform: "Analyzing...",
    gpu: "Analyzing...",
    ip: "Fetching...",
    latency: "Calculating...",
    connection: "--",
    battery: "--",
    charging: "--",
    localIp: "Scanning...",
    tiltA: "0°",
    tiltB: "0°",
    screenRes: "--",
    dnt: "--",
    userAgent: "Retrieving...",
    hash: "CALCULATING...",
  });

  useEffect(() => {
    // Basic Info
    const platform = navigator.platform.toUpperCase();
    const cpu = navigator.hardwareConcurrency + " CORES";
    
    // RAM Check
    const ram = (navigator as any).deviceMemory ? (navigator as any).deviceMemory + " GB" : "HIDDEN";
    
    const userAgent = navigator.userAgent;
    const screenRes = window.screen.width + "x" + window.screen.height;
    const dnt = navigator.doNotTrack === "1" ? "ENABLED (IGNORED)" : "DISABLED";

    let gpu = "Analyzing...";
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          gpu = renderer.replace("ANGLE (", "").replace(")", "");
        } else {
          gpu = "BLOCKED";
        }
      } else {
        gpu = "UNSUPPORTED";
      }
    } catch (e) {
      gpu = "BLOCKED";
    }

    // Battery
    let batteryVal = "--";
    let chargingVal = "--";
    if ((navigator as any).getBattery) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setData(prev => ({
            ...prev,
            battery: Math.round(battery.level * 100) + "%",
            charging: battery.charging ? "CHARGING ⚡" : "DISCHARGING"
          }));
        };
        updateBattery();
        battery.addEventListener("levelchange", updateBattery);
        battery.addEventListener("chargingchange", updateBattery);
      });
    } else {
      batteryVal = "PROTECTED";
      chargingVal = "N/A";
    }

    // Network
    let connectionVal = "--";
    let latencyVal = "Calculating...";
    const connection: any = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connectionVal = connection.effectiveType ? connection.effectiveType.toUpperCase() : "--";
      latencyVal = connection.rtt ? connection.rtt + " ms" : "--";
    }

    // Public IP
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(json => {
        setData(prev => ({ ...prev, ip: json.ip }));
        if (navigator.vibrate) navigator.vibrate(200);
      })
      .catch(() => {
        setData(prev => ({ ...prev, ip: "ADBLOCKER" }));
      });

    // WebRTC Local IP
    let localIpVal = "Scanning...";
    try {
      const rtc = new RTCPeerConnection({ iceServers: [] });
      rtc.createDataChannel("");
      rtc.createOffer().then(o => rtc.setLocalDescription(o));
      rtc.onicecandidate = (e) => {
        if (!e.candidate) return;
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        const match = e.candidate.candidate.match(ipRegex);
        if (match) {
          setData(prev => ({ ...prev, localIp: match[1] }));
        } else {
          setData(prev => ({ ...prev, localIp: "OBFUSCATED" }));
        }
      };
    } catch (e) {
      localIpVal = "BLOCKED";
    }

    // Fingerprint
    let hashVal = "CALCULATING...";
    try {
      const text = "SyntaxAndSoz_Panopticon_v2";
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText(text, 2, 15);
        const dataURI = canvas.toDataURL();
        let hash = 0;
        for (let i = 0; i < dataURI.length; i++) {
          const char = dataURI.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        hashVal = "UID-" + Math.abs(hash).toString(16).toUpperCase();
      }
    } catch (e) {
      hashVal = "BLOCKED";
    }

    setData(prev => ({
      ...prev,
      platform,
      cpu,
      ram,
      userAgent,
      screenRes,
      dnt,
      gpu,
      battery: prev.battery === "--" ? batteryVal : prev.battery,
      charging: prev.charging === "--" ? chargingVal : prev.charging,
      connection: connectionVal,
      latency: latencyVal,
      localIp: prev.localIp === "Scanning..." ? localIpVal : prev.localIp,
      hash: hashVal
    }));

    // Gyroscope
    if (window.DeviceOrientationEvent) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha || event.beta) {
          setData(prev => ({
            ...prev,
            tiltA: Math.round(event.alpha || 0) + "°",
            tiltB: Math.round(event.beta || 0) + "°",
          }));
        }
      };
      window.addEventListener("deviceorientation", handleOrientation);
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, []);

  return (
    <div className="panopticon-wrapper">
      <div className="scan-overlay"></div>
      
      <div className="container">
          <nav className="top-nav">
              <Link href="/" className="back-link"><i className="fas fa-chevron-left"></i> RETURN_TO_SYSTEM</Link>
          </nav>
          <header>
              <h1>THE PANOPTICON</h1>
              <p>SUBJECT: <span id="visitor-id" className="blink">{data.hash}</span></p>
          </header>

          <div className="grid">
              
              <div className="panel">
                  <h3>// HARDWARE_INTEGRITY</h3>
                  <div className="data-row">
                      <span>CPU CORES:</span>
                      <span id="cpu" className="val">{data.cpu}</span>
                  </div>
                  <div className="data-row">
                      <span>RAM (Est):</span>
                      <span id="ram" className="val">{data.ram}</span>
                  </div>
                  <div className="data-row">
                      <span>PLATFORM:</span>
                      <span id="platform" className="val">{data.platform}</span>
                  </div>
                  <div className="data-row">
                      <span>GPU RENDERER:</span>
                      <span id="gpu" className="val">{data.gpu}</span>
                  </div>
              </div>

              <div className="center-stage">
                  <div className="radar">
                      <div className="sweep"></div>
                  </div>
                  <div className="status-msg">DIGITAL FOOTPRINT DETECTED</div>
              </div>

              <div className="panel">
                  <h3>// CONNECTION_NODE</h3>
                  <div className="data-row">
                      <span>PUBLIC IP:</span>
                      <span id="ip" className="val highlight">{data.ip}</span>
                  </div>
                  <div className="data-row">
                      <span>LATENCY:</span>
                      <span id="latency" className="val">{data.latency}</span>
                  </div>
                  <div className="data-row">
                      <span>CONNECTION:</span>
                      <span id="connection" className="val">{data.connection}</span>
                  </div>
                  <hr style={{ borderColor: "#333", margin: "10px 0" }} />
                  <div className="data-row">
                      <span>BATTERY:</span>
                      <span id="battery" className="val">{data.battery}</span>
                  </div>
                  <div className="data-row">
                      <span>POWER STATUS:</span>
                      <span id="charging" className="val">{data.charging}</span>
                  </div>
              </div>

              <div className="panel mobile-panel">
                  <h3>// SENSORS_&_LEAKS</h3>
                  <div className="data-row">
                      <span>LOCAL IP (RTC):</span>
                      <span id="local-ip" className="val" style={{ color: "#ff0055" }}>{data.localIp}</span>
                  </div>
                  <div className="data-row">
                      <span>DEVICE TILT (X):</span>
                      <span id="tilt-a" className="val">{data.tiltA}</span>
                  </div>
                  <div className="data-row">
                      <span>DEVICE TILT (Y):</span>
                      <span id="tilt-b" className="val">{data.tiltB}</span>
                  </div>
                  <div className="data-row">
                      <span>SCREEN RES:</span>
                      <span id="screen-res" className="val">{data.screenRes}</span>
                  </div>
                  <div className="data-row">
                      <span>DO NOT TRACK:</span>
                      <span id="dnt" className="val">{data.dnt}</span>
                  </div>
              </div>

          </div>

          <div className="terminal-log">
              <h3>&gt;&gt; RAW_USER_AGENT_STRING</h3>
              <textarea 
                id="userAgent" 
                className="terminal-textarea"
                readOnly 
                style={{ width: '100%', background: 'transparent', color: '#666', border: '1px solid #333', marginTop: '10px' }} 
                value={data.userAgent}
              ></textarea>
              <button 
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(data.userAgent);
                    alert("Copied User Agent!");
                  } catch (e) {
                    alert("Copy failed");
                  }
                }}
                style={{ marginTop: '10px', background: '#333', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', fontFamily: "'Fira Code', monospace" }}
              >
                📋 Copy UA
              </button>
          </div>
          
          <div className="fingerprint-box">
              <span>UNIQUE CANVAS HASH: </span>
              <span id="hash" style={{ color: "#ff0055", marginRight: '10px' }}>{data.hash}</span>
              <button 
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(data.hash);
                    alert("Copied Hash!");
                  } catch (e) {
                    alert("Copy failed");
                  }
                }}
                style={{ background: '#ff0055', color: 'white', padding: '2px 8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Fira Code', monospace" }}
              >
                📋 Copy
              </button>
          </div>
                    <div style={{ marginTop: '20px' }}>
                <textarea className="input-area" placeholder="Enter data here..."></textarea>
                <button className="copy-btn" onClick={(e) => { const t = e.currentTarget.previousElementSibling as HTMLTextAreaElement; if(t && t.value) { navigator.clipboard.writeText(t.value); } }}>Copy to Clipboard</button>
              </div>
          </div>
    </div>
  );
}


