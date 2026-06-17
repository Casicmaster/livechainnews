import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect x="2"  y="10" width="12" height="7" rx="3.5" stroke="#00e676" strokeWidth="2"/>
                <rect x="18" y="15" width="12" height="7" rx="3.5" stroke="#00e676" strokeWidth="2" opacity="0.6"/>
                <line x1="14" y1="13.5" x2="18" y2="18.5" stroke="#00e676" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="26" cy="8" r="3" fill="#00e676" opacity="0.3"/>
                <circle cx="26" cy="8" r="1.5" fill="#00e676"/>
              </svg>
              <span className={styles.logoText}>
                <span className={styles.live}>Live</span>
                <span className={styles.chain}>Chain</span>
                <span className={styles.news}>News</span>
              </span>
            </div>
            <p>Your real-time source for crypto news, trending tokens, and market intelligence. Built for the global crypto community.</p>
          </div>

          <div className={styles.col}>
            <h4>Content</h4>
            <ul>
              {[['News','/news'],['Analysis','/analysis'],['Blog','/blog'],['Learn','/learn']].map(([l,h]) => (
                <li key={l}><Link href={h}>{l}</Link></li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Markets</h4>
            <ul>
              {[['Prices','/prices'],['Top Exchanges','/trending']].map(([l,h]) => (
                <li key={l}><Link href={h}>{l}</Link></li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Company</h4>
            <ul>
              {[['About','/about'],['Contact','/contact'],['Advertise','/advertise'],['Privacy Policy','/privacy'],['Terms & Conditions','/terms'],['Disclaimer','/disclaimer']].map(([l,h]) => (
                <li key={l}><Link href={h}>{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} LiveChainNews.com — All rights reserved</span>
          <div className={styles.socials}>
            <a href="https://x.com/livechainnews" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="X (Twitter)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://t.me/livechainnews" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="Telegram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}