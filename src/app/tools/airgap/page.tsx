import { Metadata } from "next";
import AirgapClient from "./AirgapClient";

export const metadata: Metadata = {
  title: "Air-Gap Data Encoder | Syntax & Soz",
  description: "A forensic Python utility designed to exfiltrate data from isolated (air-gapped) systems by converting raw binary/text into a visual QR code stream.",
  openGraph: {
    title: "Air-Gap Encoder | Data Exfiltration",
    description: "Convert payloads into high-speed video QR streams to bypass physical network isolation.",
  },
  alternates: {
    canonical: "/tools/airgap",
  },
};

export default function AirGapPage() {
  return (
    <>
      <AirgapClient />
    
      <div className="seo-container" style={{ margin: '60px auto 40px', maxWidth: '850px', padding: '0 20px' }}>
        <article className="seo-content" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', borderLeft: '4px solid var(--accent, #58a6ff)', color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '15px', fontSize: '1.4rem' }}>{/* SEO */} Why I Built This</h2>
          <p style={{ marginBottom: '20px' }}>I built this tool to solve a very specific paranoid problem: getting data out of a completely offline, air-gapped machine without plugging in a USB drive. It encodes your payloads into a high-speed sequence of QR codes. You just scan the screen with your phone.</p>
          
          <h3 style={{ color: 'var(--text)', marginBottom: '10px', fontSize: '1.2rem' }}>Common Use Cases</h3>
          <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
            <li style={{ marginBottom: '8px' }}>Extracting logs or small config files from an air-gapped server securely.</li>
            <li style={{ marginBottom: '8px' }}>Transferring cryptographic keys (like PGP or SSH) without touching the network.</li>
            <li style={{ marginBottom: '8px' }}>Auditing and demonstrating optical data exfiltration methods in secure environments.</li>
          </ul>
        </article>

        <section className="faq-section" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', border: '1px solid var(--border, #333)', color: '#ccc', lineHeight: '1.6' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '1.4rem' }}>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>How exactly do I format data for this air-gapped transfer?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>Just drop your raw text or JSON into the encoder. It splits the data and generates a video of QR codes. Then, you use a secondary offline device to scan the visual feed.</p>
            </details>
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>Is the QR generation truly running offline?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>100%. All processing is done using JavaScript directly in your browser. No data ever hits a server or leaves your local machine.</p>
            </details>
            
          </div>
        </section>
      </div>
    </>
  );
}
