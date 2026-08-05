"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";

export default function Home() {
  const [quickText, setQuickText] = useState("");
  
  useEffect(() => {
    // Scroll animations
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll(".hidden");
    hiddenElements.forEach((el) => observer.observe(el));

    // Security Alert Console Log
    setTimeout(() => {
      console.clear();
      console.log(
        "%c⚠️ SECURITY ALERT ⚠️",
        "color: red; font-size: 40px; font-weight: bold; text-shadow: 2px 2px black;"
      );
      console.log(
        "%cYou are poking around where you shouldn't be...",
        "color: white; font-size: 16px;"
      );
      console.log(
        "%cIf you want to hire me, decode this: c3ludGF4YW5kc296QG91dGxvb2suY29t",
        "color: #00ff41; font-family: monospace; font-size: 14px; border: 1px solid #00ff41; padding: 5px;"
      );
      console.log("%c(Hint: It's Base64)", "color: gray; font-size: 10px;");
    }, 2000);
  }, []);

  return (
    <div id="home-layout">
      {/* FontAwesome for icons */}
      <Script
        src="https://kit.fontawesome.com/a076d05399.js"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />

      <nav>
        <div className="logo">&#123; Syntax & Soz &#125;</div>
        <div className="links">
          <a href="#about">_about</a>
          <a href="#projects">_projects</a>
          <a href="#contact">_contact</a>
        </div>
      </nav>

      <header className="hero">
        <div className="container">
          <div className="hero-content hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://2cm.es/soz" alt="Logo" className="profile-img" />
            <h1>
              Syntax <span className="accent">&amp;</span> Soz
            </h1>
            <p className="tagline">Writer of Code & Logic.</p>

            <div className="terminal-box">
              <p>&gt; print(&quot;Welcome to my digital void.&quot;)</p>
              <p>&gt; System status: <span className="green">Online</span></p>
              <p className="typing">
                &gt; Initializing portfolio...<span className="cursor">_</span>
              </p>
            </div>
            <div style={{ marginTop: "30px" }}>
              <Link
                href="/tools/panopticon"
                className="btn-main"
                style={{ marginRight: "15px" }}
              >
                <i className="fas fa-eye"></i> Scan Device
              </Link>
              <a href="#projects" className="btn-small" style={{ color: "#888" }}>
                View Source Code_
              </a>
            </div>
          </div>
        </div>
      </header>

      <article className="seo-intro" style={{ padding: '30px 20px', maxWidth: '900px', margin: '20px auto 40px', background: 'var(--panel-bg, #111)', borderRadius: '8px', borderLeft: '4px solid var(--accent, #58a6ff)', color: '#ccc', lineHeight: '1.6' }}>
        <h2 style={{ color: 'var(--text)', marginBottom: '15px', fontSize: '1.5rem' }}>Welcome to Syntax & Soz</h2>
        <p style={{ marginBottom: '15px' }}>
          Hey there. You've landed on a hand-crafted suite of blazing-fast, lightweight developer utilities. I built these tools out of sheer necessity—because I was tired of bloated websites tracking my every move just to decode a Base64 string or strip EXIF data.
        </p>
        <p>
          Everything here runs 100% locally in your browser. Whether you're analyzing advanced WebRTC leaks, encrypting payloads with PGP, or just trying to wipe image metadata cleanly, your data never leaves your device. No servers. No tracking. Just raw, unadulterated speed.
        </p>
      </article>

      <section id="about" className="section hidden">
        <div className="container">
          <h2 className="section-title">01. About Me</h2>
          <div className="content-text">
            <p>
              I am a developer who believes that{" "}
              <strong>code is the closest thing to magic</strong>. If a task is
              boring and repetitive, I will write a script to do it for me.
            </p>
            <p>
              My journey started with curiosity, and it turned into an obsession
              with <strong>Automation</strong> and <strong>Digital Privacy</strong>.
              I don&apos;t just write lines of code; I build tools that save time and
              protect data. I prefer to stay behind the screen, operating
              anonymously to solve puzzles that others find impossible.
            </p>
            <div className="skills">
              <span>Python</span>
              <span>Web Scraping</span>
              <span>Automation</span>
              <span>Privacy Tools</span>
              <span>Linux</span>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="container">
          <h2 className="section-title hidden">02. Selected Works</h2>
          <div className="project-grid">
            <div className="project-card hidden" style={{ transitionDelay: "50ms" }}>
              <h3>Symphony of Syntax</h3>
              <p>
                An algorithmic rhythm engine that converts code logic into audio
                beats. Features visualizers and 9:16 video export.
              </p>
              <div className="tech-stack">
                <span>Web Audio API</span>
                <span>Canvas</span>
                <span>Generative</span>
              </div>
              <Link href="/tools/symphony-of-syntax" className="btn-small">
                Generate Rhythm -&gt;
              </Link>
            </div>

            <div className="project-card hidden" style={{ transitionDelay: "100ms" }}>
              <h3>GPG Crypto Suite</h3>
              <p>
                A complete PGP encryption suite. Generate ECC keys, encrypt
                files/text, and decrypt data entirely in the browser.
              </p>
              <div className="tech-stack">
                <span>OpenPGP.js</span>
                <span>Web Crypto</span>
                <span>Privacy</span>
              </div>
              <Link href="/tools/gpg" className="btn-small">
                Open Secure Terminal -&gt;
              </Link>
            </div>

            <div className="project-card hidden" style={{ transitionDelay: "150ms" }}>
              <h3>Base64 Stealth Tool</h3>
              <p>
                A secure web tool that converts any file into Base64 raw text and
                rebuilds it. Client-side Only.
              </p>
              <div className="tech-stack">
                <span>HTML/JS</span>
                <span>Cryptography</span>
              </div>
              <Link href="/tools/b64" className="btn-small">
                Launch Tool -&gt;
              </Link>
            </div>

            <div className="project-card hidden" style={{ transitionDelay: "200ms" }}>
              <h3>QR Video Encoder</h3>
              <p>
                A Python script that converts JSON data into a video of QR codes
                for air-gapped data transfer.
              </p>
              <div className="tech-stack">
                <span>Python</span>
                <span>OpenCV</span>
              </div>
              <Link href="/tools/airgap" className="btn-small">
                View Documentation -&gt;
              </Link>
            </div>

            <div className="project-card hidden" style={{ transitionDelay: "250ms" }}>
              <h3>WhatsApp Privacy Ext.</h3>
              <p>
                A browser extension focused on privacy features. Blur messages and
                hide status instantly.
              </p>
              <div className="tech-stack">
                <span>JavaScript</span>
                <span>Manifest V3</span>
              </div>
              <Link href="/tools/privacy" className="btn-small">
                Try Live Demo -&gt;
              </Link>
            </div>

            <div className="project-card hidden" style={{ transitionDelay: "300ms" }}>
              <h3>CyberNews Spider</h3>
              <p>
                An automated web scraper that fetches latest cybersecurity threats
                and visualizes them in a dashboard.
              </p>
              <div className="tech-stack">
                <span>Python</span>
                <span>BeautifulSoup</span>
                <span>JSON</span>
              </div>
              <Link href="/tools/newsscraper" className="btn-small">
                Live Feed -&gt;
              </Link>
            </div>

            <div className="project-card hidden" style={{ transitionDelay: "350ms" }}>
              <h3>StealthImg Exif Wiper</h3>
              <p>
                A web utility that strips hidden metadata (GPS, Device Info) from
                images before sharing.
              </p>
              <div className="tech-stack">
                <span>JavaScript</span>
                <span>Canvas API</span>
                <span>Privacy</span>
              </div>
              <Link href="/tools/metadatacleaner" className="btn-small">
                Sanitize Image -&gt;
              </Link>
            </div>

            <div className="project-card hidden" style={{ transitionDelay: "400ms" }}>
              <h3>StegoVault Image Encryptor</h3>
              <p>
                A digital spy tool that hides secret text messages inside image
                pixels using steganography.
              </p>
              <div className="tech-stack">
                <span>JavaScript</span>
                <span>Binary</span>
                <span>Cybersec</span>
              </div>
              <Link href="/tools/stegovault" className="btn-small">
                Hide Secrets -&gt;
              </Link>
            </div>

            <div className="project-card hidden" style={{ transitionDelay: "450ms" }}>
              <h3>The Panopticon</h3>
              <p>
                An advanced device fingerprinting tool that exposes hardware
                sensors, WebRTC leaks, and unique browser hashes.
              </p>
              <div className="tech-stack">
                <span>Canvas API</span>
                <span>WebRTC</span>
                <span>Forensics</span>
              </div>
              <Link href="/tools/panopticon" className="btn-small">
                Start Scan -&gt;
              </Link>
            </div>

            <div className="project-card hidden" style={{ transitionDelay: "500ms" }}>
              <h3>Ghost-Pixel Image Cloak</h3>
              <p>
                Utilizes adversarial perturbation algorithms to inject imperceptible
                pixel-noise, rendering facial features unrecognizable to neural
                networks.
              </p>
              <div className="tech-stack">
                <span>Canvas API</span>
                <span>Steganography</span>
                <span>Privacy</span>
              </div>
              <Link href="/tools/ghostpixel" className="btn-small">
                Secure Image -&gt;
              </Link>
            </div>
            
            <div className="project-card hidden" style={{ transitionDelay: "550ms" }}>
              <div className="quick-tool">
                <h3>Quick Notepad / Base64</h3>
                <textarea 
                  className="input-area" 
                  placeholder="Enter text to process..." 
                  style={{ width: '100%', minHeight: '80px', maxHeight: '300px', resize: 'vertical', marginTop: '10px', padding: '10px', background: '#0a0a0a', color: '#00ff41', border: '1px solid #333', borderRadius: '4px' }}
                  value={quickText}
                  onChange={(e) => setQuickText(e.target.value)}
                ></textarea>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button 
                    className="copy-btn btn-main" 
                    style={{ padding: '8px 15px', width: '100%', marginTop: '0' }} 
                    onClick={() => {
                      navigator.clipboard.writeText(quickText);
                      alert("Copied Plaintext!");
                    }}
                  >
                    Copy Text
                  </button>
                  <button 
                    className="copy-btn btn-main" 
                    style={{ padding: '8px 15px', width: '100%', marginTop: '0' }} 
                    onClick={() => {
                      try {
                        const b64 = btoa(quickText);
                        navigator.clipboard.writeText(b64);
                        alert("Copied as Base64!");
                      } catch (e) {
                        alert("Failed to encode (invalid characters)");
                      }
                    }}
                  >
                    Copy Base64
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section hidden">
        <div className="container center">
          <h2 className="section-title">03. Contact</h2>
          <p>
            Have a boring task you want to automate? Or a website you need data
            from?
          </p>
          <a href="mailto:syntaxandsoz@outlook.com" className="btn-main">
            Initiate Protocol (Email Me)
          </a>
        </div>
      </section>

      <footer>
        <p>
          Designed by{" "}
          <a target="_blank" href="https://github.com/syntaxandsoz" rel="noreferrer">
            Syntax & Soz
          </a>{" "}
          | &copy; 2025-2026
        </p>
      </footer>
    </div>
  );
}

