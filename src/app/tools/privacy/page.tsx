import { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Ghost Mode Whatsapp Ext | Syntax & Soz",
  description: "Advanced Privacy for WhatsApp Web. Blur chats, hide identity, and vanish media.",
  openGraph: {
    title: "Privacy Extension | Syntax & Soz",
    description: "Install the Syntax & Soz Privacy Extension to secure your browsing experience.",
  },
  alternates: {
    canonical: "/tools/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <script src="https://kit.fontawesome.com/a076d05399.js" crossOrigin="anonymous" async></script>
      </Head>
      <PrivacyClient />
    
      <div className="seo-container" style={{ margin: '60px auto 40px', maxWidth: '850px', padding: '0 20px' }}>
        <article className="seo-content" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', borderLeft: '4px solid var(--accent, #58a6ff)', color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '15px', fontSize: '1.4rem' }}>{/* SEO */} Why I Built This</h2>
          <p style={{ marginBottom: '20px' }}>A conceptual demonstration of how DOM manipulation can enforce privacy on complex web apps. It shows how you can inject CSS to blur messages or hide typing indicators locally.</p>
          
          <h3 style={{ color: 'var(--text)', marginBottom: '10px', fontSize: '1.2rem' }}>Common Use Cases</h3>
          <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
            <li style={{ marginBottom: '8px' }}>Understanding how browser extensions interact with and modify complex React web apps.</li>
            <li style={{ marginBottom: '8px' }}>Testing local CSS overrides to obscure sensitive on-screen text in public spaces.</li>
            <li style={{ marginBottom: '8px' }}>Developing experimental UI concepts for messaging privacy.</li>
          </ul>
        </article>

        <section className="faq-section" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', border: '1px solid var(--border, #333)', color: '#ccc', lineHeight: '1.6' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '1.4rem' }}>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>How do I blur WhatsApp web messages online?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>This tool demonstrates the exact CSS and JavaScript DOM overrides required to apply blur filters to message containers.</p>
            </details>
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>Does this actually modify the WhatsApp service?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>No, this is purely a local, cosmetic modification to the Document Object Model (DOM) rendered in your browser.</p>
            </details>
            
          </div>
        </section>
      </div>
    </>
  );
}
