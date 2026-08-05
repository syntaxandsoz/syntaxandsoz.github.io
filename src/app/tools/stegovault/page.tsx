import { Metadata } from "next";
import StegoVaultClient from "./StegoVaultClient";

export const metadata: Metadata = {
  title: "StegoVault | Image Steganography | Syntax & Soz",
  description: "Hide secret text messages inside the pixels of an image using LSB (Least Significant Bit) manipulation. Fully client-side for maximum privacy.",
  openGraph: {
    title: "StegoVault | Image Steganography",
    description: "Hide data in plain sight. Securely encode text into images inside your browser.",
  },
  alternates: {
    canonical: "/tools/stegovault",
  },
};

export default function StegoVaultPage() {
  return (
    <>
      <StegoVaultClient />
    
      <div className="seo-container" style={{ margin: '60px auto 40px', maxWidth: '850px', padding: '0 20px' }}>
        <article className="seo-content" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', borderLeft: '4px solid var(--accent, #58a6ff)', color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '15px', fontSize: '1.4rem' }}>{/* SEO */} Why I Built This</h2>
          <p style={{ marginBottom: '20px' }}>Sometimes encryption isn't enough; you need to hide the fact that you're communicating at all. StegoVault embeds your encrypted text securely within the least significant bits of an image's pixel data.</p>
          
          <h3 style={{ color: 'var(--text)', marginBottom: '10px', fontSize: '1.2rem' }}>Common Use Cases</h3>
          <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
            <li style={{ marginBottom: '8px' }}>Sending hidden communications over heavily monitored or restricted networks.</li>
            <li style={{ marginBottom: '8px' }}>Storing encrypted passwords or keys inside innocent-looking family photos.</li>
            <li style={{ marginBottom: '8px' }}>Learning about LSB (Least Significant Bit) manipulation and digital steganography.</li>
          </ul>
        </article>

        <section className="faq-section" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', border: '1px solid var(--border, #333)', color: '#ccc', lineHeight: '1.6' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '1.4rem' }}>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>How do I hide text in an image securely?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>Upload a carrier image, type your secret text, and provide a password. The tool will subtly alter the image pixels to encode the data.</p>
            </details>
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>Will the modified image look different?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>To the human eye, the image will appear completely unchanged. The data is mathematically hidden in the noise of the color channels.</p>
            </details>
            
          </div>
        </section>
      </div>
    </>
  );
}
