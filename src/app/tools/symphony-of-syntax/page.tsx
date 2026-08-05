import { Metadata } from "next";
import SymphonyClient from "./SymphonyClient";

export const metadata: Metadata = {
  title: "Symphony of Syntax | Syntax & Soz",
  description: "Convert your source code into generative music and 9:16 visualizers.",
  openGraph: {
    title: "Symphony of Syntax | Code to Audio",
    description: "Convert your code structure into unique audio soundscapes entirely in the browser.",
  },
  alternates: {
    canonical: "/tools/symphony-of-syntax",
  },
};

export default function SymphonyPage() {
  return (
    <>
      <SymphonyClient />
    
      <div className="seo-container" style={{ margin: '60px auto 40px', maxWidth: '850px', padding: '0 20px' }}>
        <article className="seo-content" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', borderLeft: '4px solid var(--accent, #58a6ff)', color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '15px', fontSize: '1.4rem' }}>{/* SEO */} Why I Built This</h2>
          <p style={{ marginBottom: '20px' }}>An experimental algorithmic rhythm engine. It translates code logic and plain text into unique, generative audio-visual beats using the Web Audio API.</p>
          
          <h3 style={{ color: 'var(--text)', marginBottom: '10px', fontSize: '1.2rem' }}>Common Use Cases</h3>
          <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
            <li style={{ marginBottom: '8px' }}>Generating unique, procedural soundscapes based on code structures.</li>
            <li style={{ marginBottom: '8px' }}>Creating audio-reactive visualizers for social media export.</li>
            <li style={{ marginBottom: '8px' }}>Exploring the intersection of generative art, the Web Audio API, and programming.</li>
          </ul>
        </article>

        <section className="faq-section" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', border: '1px solid var(--border, #333)', color: '#ccc', lineHeight: '1.6' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '1.4rem' }}>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>How do I generate music from code?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>Paste your syntax into the engine. It parses the characters and structures, mapping them to frequency synthesizers and beat generators.</p>
            </details>
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>Can I export the visualizer as a video?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>Yes, the tool allows you to record the Canvas output directly to a WebM or MP4 format for easy sharing.</p>
            </details>
            
          </div>
        </section>
      </div>
    </>
  );
}
