// --- THE PANOPTICON v2.1 (STABLE) ---

document.addEventListener("DOMContentLoaded", () => {
    // Run scanners safely
    try { initScanner(); } catch(e) { console.log("Scanner Error", e); }
    try { initAdvancedSensors(); } catch(e) { console.log("Sensor Error", e); }
});

function initScanner() {
    // 1. Basic Info
    document.getElementById('platform').innerText = navigator.platform.toUpperCase();
    document.getElementById('cpu').innerText = navigator.hardwareConcurrency + " CORES";
    
    // RAM Check
    if(navigator.deviceMemory) {
        document.getElementById('ram').innerText = navigator.deviceMemory + " GB";
    } else {
        document.getElementById('ram').innerText = "HIDDEN";
    }

    document.getElementById('userAgent').innerText = navigator.userAgent;
    document.getElementById('screen-res').innerText = window.screen.width + "x" + window.screen.height;
    
    // Do Not Track Status
    document.getElementById('dnt').innerText = navigator.doNotTrack === "1" ? "ENABLED (IGNORED)" : "DISABLED";

    // 2. Battery Status (Safe Check)
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            updateBattery(battery);
            battery.addEventListener('levelchange', () => updateBattery(battery));
            battery.addEventListener('chargingchange', () => updateBattery(battery));
        });
    } else {
        document.getElementById('battery').innerText = "PROTECTED";
        document.getElementById('charging').innerText = "N/A";
    }

    // 3. Network Info
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        document.getElementById('connection').innerText = connection.effectiveType.toUpperCase();
        document.getElementById('latency').innerText = connection.rtt + " ms";
    }

    // 4. GPU Renderer
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        document.getElementById('gpu').innerText = renderer.replace("ANGLE (", "").replace(")", "");
    } catch(e) {
        document.getElementById('gpu').innerText = "BLOCKED";
    }

    // 5. Public IP Fetch
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ip').innerText = data.ip;
            // VIBRATE PHONE (Haptic Feedback)
            if (navigator.vibrate) navigator.vibrate(200); 
        })
        .catch(() => {
            document.getElementById('ip').innerText = "ADBLOCKER";
        });

    generateFingerprint();
}

function initAdvancedSensors() {
    // 6. WebRTC Leak (Local IP)
    try {
        const rtc = new RTCPeerConnection({iceServers: []});
        rtc.createDataChannel('');
        rtc.createOffer().then(o => rtc.setLocalDescription(o));
        
        rtc.onicecandidate = (e) => {
            if (!e.candidate) return;
            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
            const match = e.candidate.candidate.match(ipRegex);
            if (match) {
                document.getElementById('local-ip').innerText = match[1];
            } else {
                document.getElementById('local-ip').innerText = "OBFUSCATED";
                document.getElementById('local-ip').style.color = "#00ff41";
            }
        };
    } catch(e) {
        document.getElementById('local-ip').innerText = "BLOCKED";
    }

    // 7. Gyroscope / Device Orientation (Mobile Only)
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            // Check if sensor is providing data
            if(event.alpha || event.beta) {
                document.getElementById('tilt-a').innerText = Math.round(event.alpha) + "°";
                document.getElementById('tilt-b').innerText = Math.round(event.beta) + "°";
                
                // 3D Radar Tilt Effect
                const radar = document.querySelector('.radar');
                if(radar) {
                    radar.style.transform = `perspective(500px) rotateX(${event.beta/2}deg) rotateY(${event.gamma/2}deg)`;
                }
            }
        });
    }
}

function updateBattery(battery) {
    const level = Math.round(battery.level * 100);
    const charging = battery.charging ? "CHARGING ⚡" : "DISCHARGING";
    document.getElementById('battery').innerText = level + "%";
    document.getElementById('charging').innerText = charging;
    
    if (level < 20) document.getElementById('battery').style.color = "#ff0055";
}

function generateFingerprint() {
    const text = "SyntaxAndSoz_Panopticon_v2";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = "#069";
    ctx.fillText(text, 2, 15);
    const dataURI = canvas.toDataURL();
    
    let hash = 0;
    for (let i = 0; i < dataURI.length; i++) {
        const char = dataURI.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const finalID = "UID-" + Math.abs(hash).toString(16).toUpperCase();
    document.getElementById('hash').innerText = finalID;
    document.getElementById('visitor-id').innerText = finalID;
}