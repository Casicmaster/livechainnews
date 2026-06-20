import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <Link href="/" className={styles.logo}>
        <svg className={styles.logoIcon} viewBox="0 0 32 32" fill="none">
          <rect x="2"  y="10" width="12" height="7" rx="3.5" stroke="#00e676" strokeWidth="2"/>
          <rect x="18" y="15" width="12" height="7" rx="3.5" stroke="#00e676" strokeWidth="2" opacity="0.6"/>
          <line x1="14" y1="13.5" x2="18" y2="18.5" stroke="#00e676" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="26" cy="8" r="3" fill="#00e676" opacity="0.3"/>
          <circle cx="26" cy="8" r="1.5" fill="#00e676"/>
        </svg>
        <div className={styles.logoText}>
          <span className={styles.live}>Live</span>
          <span className={styles.chain}>Chain</span>
          <span className={styles.news}>News</span>
        </div>
      </Link>

      {/* Desktop nav */}
      <ul className={styles.navLinks}>
        {[
          { href: '/news',      label: 'News' },
          { href: '/analysis',  label: 'Analysis' },
          { href: '/prices',    label: 'Prices' },
          { href: '/trending',  label: 'Top Exchanges' },
          { href: '/learn',     label: 'Learn' },
          { href: '/blog',      label: 'Blog' },
        ].map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={styles.navLink}>{l.label}</Link>
          </li>
        ))}
      </ul>

      {/* Right side */}
      <div className={styles.navRight}>
        <div className={styles.searchWrap}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search news, tokens..."
            className={styles.searchInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(e.target.value.trim())}`;
              }
            }}
          />
        </div>
        {false && (
        <Link href="/advertise" className={styles.btnPromote}>
          🚀 List Project
        </Link>
        )}

        {/* Hamburger (mobile) */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {[
            { href: '/news',     label: 'News' },
            { href: '/analysis', label: 'Analysis' },
            { href: '/prices',   label: 'Prices' },
            { href: '/trending',  label: 'Top Exchanges' },
            { href: '/learn',    label: 'Learn' },
            { href: '/blog',     label: 'Blog' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
