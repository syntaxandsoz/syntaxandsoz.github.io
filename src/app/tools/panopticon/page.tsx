import { Metadata } from "next";

import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";
import SEOContent from "@/components/SEOContent";

import PanopticonClient from "./PanopticonClient";

export const metadata: Metadata = {
  title: "The Panopticon | Device Fingerprinting Analysis | Syntax & Soz",
  description: "Advanced browser fingerprinting and device tracking analysis tool. Discover what your browser leaks, from Canvas hashing and WebRTC local IPs to GPU renderers.",
  openGraph: {
    title: "The Panopticon | Device Fingerprinting",
    description: "Analyze your digital footprint. See your Canvas hash, WebRTC leaks, battery status, and hardware concurrency.",
  },
  alternates: {
    canonical: "/tools/panopticon",
  },
};

export default function PanopticonPage() {
  return (
    <>
      <PanopticonClient />
    
      <div className="seo-container" style={{ margin: '60px auto 40px', maxWidth: '850px', padding: '0 20px' }}>
        <article className="seo-content" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', borderLeft: '4px solid var(--accent, #58a6ff)', color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '15px', fontSize: '1.4rem' }}>{/* SEO */} Why I Built This</h2>
          <p style={{ marginBottom: '20px' }}>Websites track you in ways you don't even realize. I built the Panopticon to expose exactly what your browser is leaking—from hardware concurrency and WebRTC local IPs to Canvas and WebGL hashing.</p>
          
          <h3 style={{ color: 'var(--text)', marginBottom: '10px', fontSize: '1.2rem' }}>Common Use Cases</h3>
          <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
            <li style={{ marginBottom: '8px' }}>Auditing your own browser to see what identifiable metrics you are leaking to advertisers.</li>
            <li style={{ marginBottom: '8px' }}>Testing the effectiveness of anti-fingerprinting browser extensions or Tor.</li>
            <li style={{ marginBottom: '8px' }}>Understanding modern web tracking techniques like Canvas and Audio API hashing.</li>
          </ul>
        </article>

        <section className="faq-section" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', border: '1px solid var(--border, #333)', color: '#ccc', lineHeight: '1.6' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '1.4rem' }}>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>How do I check my browser fingerprint?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>Load the Panopticon tool and it will immediately execute an array of tests to reveal your unique device footprint.</p>
            </details>
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>What exactly is a Canvas Hash?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>It is a tracking technique that renders a hidden, invisible image in your browser and calculates a unique ID based on how your specific GPU and OS draw the pixels.</p>
            </details>
            
          </div>
        </section>
      </div>
    </>
  );
}
