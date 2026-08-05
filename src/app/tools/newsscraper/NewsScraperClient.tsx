"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./newsscraper.css";

interface NewsItem {
  title: string;
  link: string;
  source: string;
  time: string;
  category: string;
}

export default function NewsScraperClient() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/data/news.json?t=' + new Date().getTime())
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="newsscraper-wrapper">
      <div className="dashboard-container">
          
          <aside className="sidebar">
              <Link href="/" className="back-link">← Main Terminal</Link>
              
              <div className="status-panel">
                  <h3>SPIDER STATUS</h3>
                  <div className="status-indicator">
                      <span className="dot pulse"></span>
                      <span className="text">OPERATIONAL</span>
                  </div>
              </div>

              <div className="terminal-logs">
                  <p>&gt; Initializing Spider v2.0...</p>
                  <p>&gt; Target: The Hacker News</p>
                  <p>&gt; Bypass Protocol: Active</p>
                  <p>&gt; Fetching latest packets...</p>
                  <p className="blink">_</p>
              </div>

              <div className="actions">
                  <p className="label">SOURCE CODE</p>
                  <a href="/downloads/spider.py" download="spider.py" className="btn-download">
                      Download .py Script ⬇
                  </a>
              </div>
          </aside>

          <main className="feed">
              <header>
                  <h1>CyberNews <span className="accent">Spider</span></h1>
                  <p>Automated Threat Intelligence Feed.</p>
              </header>

              <div className="news-grid" id="newsGrid">
                  {loading && <p style={{color:'#666'}}>Loading data stream...</p>}
                  {error && <p style={{color:'red'}}>&gt;&gt; Error fetching data.</p>}
                  {!loading && !error && news.map((item, index) => (
                      <div className="card" key={index} onClick={() => window.open(item.link || '#', '_blank')}>
                          <span className="tag">{item.category || 'General'}</span>
                          <h3>{item.title}</h3>
                          <div className="meta">
                              <span>{item.source}</span>
                              <span>{item.time}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </main>

                    <div style={{ marginTop: '20px' }}>
                <textarea className="input-area" placeholder="Enter data here..."></textarea>
                <button className="copy-btn" onClick={(e) => { const t = e.currentTarget.previousElementSibling as HTMLTextAreaElement; if(t && t.value) { navigator.clipboard.writeText(t.value); } }}>Copy to Clipboard</button>
              </div>
          </div>
    </div>
  );
}


