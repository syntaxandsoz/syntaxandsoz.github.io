import { Metadata } from "next";
import GhostPixelClient from "./GhostPixelClient";

export const metadata: Metadata = {
  title: "Ghost-Pixel | Anti-AI Image Cloak | Syntax & Soz",
  description: "Protect your images from AI facial recognition and training models. Ghost-Pixel injects adversarial noise to cloak your photos securely in your browser.",
  openGraph: {
    title: "Ghost-Pixel | Image Cloak",
    description: "Secure your images from facial recognition and neural networks using adversarial pixel noise.",
  },
  alternates: {
    canonical: "/tools/ghostpixel",
  },
};

export default function GhostPixelPage() {
  return (
    <>
      <GhostPixelClient />
    
      <div className="seo-container" style={{ margin: '60px auto 40px', maxWidth: '850px', padding: '0 20px' }}>
        <article className="seo-content" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', borderLeft: '4px solid var(--accent, #58a6ff)', color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '15px', fontSize: '1.4rem' }}>{/* SEO */} Why I Built This</h2>
          <p style={{ marginBottom: '20px' }}>This is my answer to mass surveillance and automated facial recognition scraping. It uses adversarial perturbation to inject invisible noise into your photos. To a human, it looks normal. To an AI model, it looks like complete static.</p>
          
          <h3 style={{ color: 'var(--text)', marginBottom: '10px', fontSize: '1.2rem' }}>Common Use Cases</h3>
          <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
            <li style={{ marginBottom: '8px' }}>Protecting your personal photos from automated scraping and facial recognition databases.</li>
            <li style={{ marginBottom: '8px' }}>Testing the robustness of computer vision models against adversarial attacks.</li>
            <li style={{ marginBottom: '8px' }}>Sharing images securely while retaining visual fidelity for your friends.</li>
          </ul>
        </article>

        <section className="faq-section" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', border: '1px solid var(--border, #333)', color: '#ccc', lineHeight: '1.6' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '1.4rem' }}>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>How do I cloak an image from facial recognition algorithms?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>Upload your image to the Ghost-Pixel tool. It mathematically alters the pixel data to confuse AI models while keeping the image completely normal to the human eye.</p>
            </details>
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>Does this ruin the image quality?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>No. The perturbation is calculated to be virtually imperceptible to human vision while being mathematically destructive to AI feature extraction networks.</p>
            </details>
            
          </div>
        </section>
      </div>
    </>
  );
}
