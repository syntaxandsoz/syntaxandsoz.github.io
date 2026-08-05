import { Metadata } from "next";
import MetadataCleanerClient from "./MetadataCleanerClient";
import Script from "next/script";

export const metadata: Metadata = {
  title: "StealthImg | Metadata Wiper",
  description: "Real-Time Exif Scanner & Metadata Wiper.",
  openGraph: {
    title: "Metadata Cleaner | Syntax & Soz",
    description: "Strip EXIF, location, and device data from your files securely.",
  },
  alternates: {
    canonical: "/tools/metadatacleaner",
  },
};

export default function MetadataCleanerPage() {
  return (
    <>
      <Script src="https://kit.fontawesome.com/a076d05399.js" crossOrigin="anonymous" strategy="lazyOnload" />
      <MetadataCleanerClient />
    
      <div className="seo-container" style={{ margin: '60px auto 40px', maxWidth: '850px', padding: '0 20px' }}>
        <article className="seo-content" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', borderLeft: '4px solid var(--accent, #58a6ff)', color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '15px', fontSize: '1.4rem' }}>{/* SEO */} Why I Built This</h2>
          <p style={{ marginBottom: '20px' }}>Did you know your phone embeds your exact GPS coordinates into every photo you take? I wrote this lightweight utility to instantly strip all hidden EXIF metadata before you share images online.</p>
          
          <h3 style={{ color: 'var(--text)', marginBottom: '10px', fontSize: '1.2rem' }}>Common Use Cases</h3>
          <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
            <li style={{ marginBottom: '8px' }}>Sanitizing photos before posting them to social media or public forums.</li>
            <li style={{ marginBottom: '8px' }}>Removing identifiable GPS location data from sensitive images.</li>
            <li style={{ marginBottom: '8px' }}>Reducing image file size slightly by stripping unnecessary embedded thumbnails and headers.</li>
          </ul>
        </article>

        <section className="faq-section" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', border: '1px solid var(--border, #333)', color: '#ccc', lineHeight: '1.6' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '1.4rem' }}>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>How do I remove EXIF metadata from my photos?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>Simply drag and drop your image into the Exif Wiper. It strips the headers and returns a clean, sanitized image file instantly.</p>
            </details>
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>Does this affect the image resolution or quality?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>No, the visible pixel data remains completely untouched. Only the hidden text and metadata headers are wiped.</p>
            </details>
            
          </div>
        </section>
      </div>
    </>
  );
}
