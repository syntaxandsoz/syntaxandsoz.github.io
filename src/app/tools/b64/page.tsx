import { Metadata } from "next";
import B64Client from "./B64Client";

export const metadata: Metadata = {
  title: "Stealth Converter | Syntax & Soz",
  description: "Securely convert files to Base64 and back. Client-side only.",
  openGraph: {
    title: "Stealth Converter",
    description: "Securely convert files to Base64 and back.",
  },
  alternates: {
    canonical: "/tools/b64",
  },
};

export default function Base64ConverterPage() {
  return (
    <>
      <B64Client />
    
      <div className="seo-container" style={{ margin: '60px auto 40px', maxWidth: '850px', padding: '0 20px' }}>
        <article className="seo-content" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', borderLeft: '4px solid var(--accent, #58a6ff)', color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '15px', fontSize: '1.4rem' }}>{/* SEO */} Why I Built This</h2>
          <p style={{ marginBottom: '20px' }}>A raw, blazing-fast Base64 utility. I was tired of using random online converters that probably log everything I paste into them. This one doesn't. It's client-side, zero-retention, and built for immediate string or file manipulation.</p>
          
          <h3 style={{ color: 'var(--text)', marginBottom: '10px', fontSize: '1.2rem' }}>Common Use Cases</h3>
          <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
            <li style={{ marginBottom: '8px' }}>Encoding raw image or font assets into Base64 for inline CSS/HTML embedding.</li>
            <li style={{ marginBottom: '8px' }}>Decoding obscure payloads or hidden strings found during security audits.</li>
            <li style={{ marginBottom: '8px' }}>Formatting complex data structures for REST API transmission quickly.</li>
          </ul>
        </article>

        <section className="faq-section" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', border: '1px solid var(--border, #333)', color: '#ccc', lineHeight: '1.6' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '1.4rem' }}>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>How do I format my Base64 strings securely?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>Paste your raw text or data into the input field above. The tool instantly encodes or decodes it purely in your browser.</p>
            </details>
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>Are you logging my strings?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>Absolutely not. This utility enforces zero data retention by processing everything within your local DOM. I don't want your data.</p>
            </details>
            
          </div>
        </section>
      </div>
    </>
  );
}
