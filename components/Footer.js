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
              {['News','Analysis','Blog','Learn','Events'].map(l => (
                <li key={l}><Link href={`/${l.toLowerCase()}`}>{l}</Link></li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Markets</h4>
            <ul>
              {[['Prices','/prices'],['Trending','/trending'],['New Listings','/listings'],['DeFi','/defi'],['NFT','/nft']].map(([l,h]) => (
                <li key={l}><Link href={h}>{l}</Link></li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Company</h4>
            <ul>
              {[['Advertise','/advertise'],['List Project','/list-project'],['About','/about'],['Contact','/contact'],['Privacy Policy','/privacy']].map(([l,h]) => (
                <li key={l}><Link href={h}>{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} LiveChainNews.com — All rights reserved</span>
          <div className={styles.socials}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="Twitter/X">𝕏</a>
            <a href="https://t.me"        target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="Telegram">✈</a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="Discord">⬡</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
