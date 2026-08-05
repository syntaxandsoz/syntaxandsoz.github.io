import { Metadata } from "next";
import GPGCryptoSuiteClient from "./GPGCryptoSuiteClient";

export const metadata: Metadata = {
  title: "GPG Crypto Suite | Syntax & Soz",
  description: "Encrypt, decrypt, and generate OpenPGP keys directly in your browser. 100% client-side privacy.",
  openGraph: {
    title: "GPG Crypto Suite",
    description: "Generate ECC keys, encrypt files/text, and decrypt data entirely in the browser.",
  },
  alternates: {
    canonical: "/tools/gpg",
  },
};

export default function GPGCryptoSuitePage() {
  return (
    <>
      <GPGCryptoSuiteClient />
    
      <div className="seo-container" style={{ margin: '60px auto 40px', maxWidth: '850px', padding: '0 20px' }}>
        <article className="seo-content" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', borderLeft: '4px solid var(--accent, #58a6ff)', color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '15px', fontSize: '1.4rem' }}>{/* SEO */} Why I Built This</h2>
          <p style={{ marginBottom: '20px' }}>A browser-based PGP encryption suite for when you don't have GnuPG installed but need to encrypt something securely right now. It generates keys and encrypts messages entirely on the client side.</p>
          
          <h3 style={{ color: 'var(--text)', marginBottom: '10px', fontSize: '1.2rem' }}>Common Use Cases</h3>
          <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
            <li style={{ marginBottom: '8px' }}>Generating secure ECC/RSA key pairs for anonymous communication.</li>
            <li style={{ marginBottom: '8px' }}>Encrypting sensitive text messages before sending them over untrusted channels like Discord or email.</li>
            <li style={{ marginBottom: '8px' }}>Decrypting PGP files locally without installing heavy command-line tools.</li>
          </ul>
        </article>

        <section className="faq-section" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', border: '1px solid var(--border, #333)', color: '#ccc', lineHeight: '1.6' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '1.4rem' }}>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>How do I encrypt PGP messages online safely?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>Paste the recipient's public key and your message into the suite. The encryption happens locally, ensuring the plaintext never touches the network.</p>
            </details>
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>Is it actually safe to paste my private key?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>While local processing is guaranteed (it's 100% JS), best practices dictate you only use in-browser tools for temporary or low-risk keys. Your keys are never transmitted to my server.</p>
            </details>
            
          </div>
        </section>
      </div>
    </>
  );
}
