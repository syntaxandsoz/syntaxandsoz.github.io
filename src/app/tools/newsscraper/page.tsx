import { Metadata } from "next";
import NewsScraperClient from "./NewsScraperClient";

export const metadata: Metadata = {
  title: "CyberNews Spider | Syntax & Soz",
  description: "Automated Threat Intelligence Feed.",
  openGraph: {
    title: "News Scraper | CLI Interface",
    description: "Bypass algorithmic feeds and fetch top headlines directly from HackerNews and TechCrunch.",
  },
  alternates: {
    canonical: "/tools/newsscraper",
  },
};

export default function NewsScraperPage() {
  return (
    <>
      <NewsScraperClient />
    
      <div className="seo-container" style={{ margin: '60px auto 40px', maxWidth: '850px', padding: '0 20px' }}>
        <article className="seo-content" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', borderLeft: '4px solid var(--accent, #58a6ff)', color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '15px', fontSize: '1.4rem' }}>{/* SEO */} Why I Built This</h2>
          <p style={{ marginBottom: '20px' }}>I needed a way to monitor the latest CVEs and zero-day vulnerabilities without visiting 50 different security blogs. This automated intelligence feed aggregates threats locally into a clean dashboard.</p>
          
          <h3 style={{ color: 'var(--text)', marginBottom: '10px', fontSize: '1.2rem' }}>Common Use Cases</h3>
          <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
            <li style={{ marginBottom: '8px' }}>Monitoring the latest CVEs and zero-day vulnerabilities in real-time.</li>
            <li style={{ marginBottom: '8px' }}>Gathering threat intelligence without leaving a footprint on targeted news sites.</li>
            <li style={{ marginBottom: '8px' }}>Aggregating security alerts into a single, distraction-free interface.</li>
          </ul>
        </article>

        <section className="faq-section" style={{ padding: '30px', background: 'var(--panel-bg, #111)', borderRadius: '8px', border: '1px solid var(--border, #333)', color: '#ccc', lineHeight: '1.6' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '1.4rem' }}>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>How do I track cybersecurity news and CVEs efficiently?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>The CyberNews Spider automatically pulls in RSS and API feeds from top security bulletins directly to your browser.</p>
            </details>
            
            <details style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', border: '1px solid var(--border, #333)' }}>
              <summary style={{ fontWeight: '600', color: 'var(--accent, #58a6ff)', cursor: 'pointer', outline: 'none' }}>Is this scraping completely anonymous?</summary>
              <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.5' }}>The requests originate from your local machine or a local proxy, meaning your browser acts as the direct client fetching the public data.</p>
            </details>
            
          </div>
        </section>
      </div>
    </>
  );
}
