"use client";

import { useState } from "react";
import Link from "next/link";
import "./privacy.css";

export default function PrivacyClient() {
  const [blurContent, setBlurContent] = useState(false);
  const [blurGroups, setBlurGroups] = useState(false);
  const [blurContacts, setBlurContacts] = useState(false);
  const [hideNames, setHideNames] = useState(false);
  const [hidePhotos, setHidePhotos] = useState(false);

  return (
    <div className="privacy-wrapper">
      <div className="container">
          <nav>
              <Link href="/" className="brand">← Back to Terminal</Link>
              <div className="nav-links">
                  <a href="#demo" className="active">Live Demo</a>
                  <a href="#" className="btn-nav">Download v2.0</a>
              </div>
          </nav>

          <header>
              <span className="badge">v2.1 Stable</span>
              <h1>Ghost Mode <span className="green">Suite</span></h1>
              <p>Advanced Privacy for WhatsApp Web. Blur chats, hide identity, and vanish media.</p>
          </header>

          <section id="demo" className="demo-box">
              
              <div className="demo-controls">
                  <h3><i className="fas fa-shield-alt"></i> Privacy Controls</h3>
                  
                  <div className="control-group">
                      <span className="label-head">MESSAGE PRIVACY</span>
                      <label className="switch-container">
                          <span>Blur Content</span>
                          <input type="checkbox" checked={blurContent} onChange={(e) => setBlurContent(e.target.checked)} />
                          <span className="slider"></span>
                      </label>
                  </div>

                  <div className="control-group">
                      <span className="label-head">SIDEBAR PRIVACY</span>
                      <label className="switch-container">
                          <span>Blur Groups Only</span>
                          <input type="checkbox" checked={blurGroups} onChange={(e) => setBlurGroups(e.target.checked)} />
                          <span className="slider"></span>
                      </label>
                      <label className="switch-container">
                          <span>Blur Contacts Only</span>
                          <input type="checkbox" checked={blurContacts} onChange={(e) => setBlurContacts(e.target.checked)} />
                          <span className="slider"></span>
                      </label>
                  </div>

                  <div className="control-group">
                      <span className="label-head">IDENTITY HIDE</span>
                      <label className="switch-container">
                          <span>Blur Names</span>
                          <input type="checkbox" checked={hideNames} onChange={(e) => setHideNames(e.target.checked)} />
                          <span className="slider"></span>
                      </label>
                      <label className="switch-container">
                          <span>Hide Photos</span>
                          <input type="checkbox" checked={hidePhotos} onChange={(e) => setHidePhotos(e.target.checked)} />
                          <span className="slider"></span>
                      </label>
                  </div>
              </div>

              <div className={`mock-app ${blurContent ? 'blur-content' : ''} ${blurGroups ? 'blur-groups' : ''} ${blurContacts ? 'blur-contacts' : ''} ${hideNames ? 'hide-names' : ''} ${hidePhotos ? 'hide-photos' : ''}`} id="mockApp">
                  
                  <div className="mock-sidebar">
                      <div className="sidebar-header">
                          <div className="my-dp"></div>
                          <div className="icons">•••</div>
                      </div>
                      
                      <div className="chat-list">
                          <div className="chat-item contact-item">
                              <div className="dp"></div>
                              <div className="info">
                                  <div className="name">John Doe (Client)</div>
                                  <div className="preview">Payment sent for the project.</div>
                              </div>
                          </div>

                          <div className="chat-item group-item">
                              <div className="dp group-dp"><i className="fas fa-users" style={{color:'#fff', fontSize:'12px'}}></i></div>
                              <div className="info">
                                  <div className="name">Dev Team Alpha</div>
                                  <div className="preview">Server logs updated.</div>
                              </div>
                          </div>

                          <div className="chat-item contact-item active">
                              <div className="dp"></div>
                              <div className="info">
                                  <div className="name">Syntax & Soz</div>
                                  <div className="preview">Files attached below.</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="mock-chat-window">
                      <div className="chat-header">
                          <div className="dp"></div>
                          <div className="header-info">
                              <span className="name">Syntax & Soz</span>
                              <span className="status">Online</span>
                          </div>
                      </div>

                      <div className="chat-body">
                          <div className="msg received">
                              <p>Where is the final delivery?</p>
                              <span className="time">10:42 AM</span>
                          </div>
                          
                          <div className="msg sent img-msg">
                              <img src="/codescr.png" alt="Code Screenshot" />
                              <span className="time">10:43 AM</span>
                          </div>

                          <div className="msg sent">
                              <p>Let me know if you need changes.</p>
                              <span className="time">10:44 AM</span>
                          </div>
                      </div>
                  </div>

              </div>
          </section>

                    <div style={{ marginTop: '20px' }}>
                <textarea className="input-area" placeholder="Enter data here..."></textarea>
                <button className="copy-btn" onClick={(e) => { const t = e.currentTarget.previousElementSibling as HTMLTextAreaElement; if(t && t.value) { navigator.clipboard.writeText(t.value); } }}>Copy to Clipboard</button>
              </div>
          </div>
    </div>
  );
}


