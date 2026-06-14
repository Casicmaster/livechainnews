import { useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import TrendingWidget from '../components/TrendingWidget';
import FearGreedWidget from '../components/FearGreedWidget';
import { NewsFeatured, NewsCard } from '../components/NewsCard';
import Footer from '../components/Footer';
import { fmtPrice, fmtPct, getTokenMeta, FALLBACK_NEWS } from '../lib/utils';
import styles from './index.module.css';

const fetcher = (url) => fetch(url).then((r) => r.json());

const CATEGORIES = [
  { key: 'all',        label: 'All' },
  { key: 'bitcoin',    label: 'Bitcoin' },
  { key: 'ethereum',   label: 'Ethereum' },
  { key: 'defi',       label: 'DeFi' },
  { key: 'nft',        label: 'NFT' },
  { key: 'regulation', label: 'Regulation' },
  { key: 'altcoin',    label: 'Altcoins' },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Prices (for hero movers)
  const { data: prices } = useSWR('/api/prices', fetcher, { refreshInterval: 60000 });

  // News — now from YOUR Supabase articles instead of RSS
  const { data: news } = useSWR(
    `/api/articles?filter=${activeFilter === 'all' ? 'all' : activeFilter}`,
    fetcher,
    { refreshInterval: 60000 }
  );

  // Map Supabase articles to the shape NewsCard expects
  const newsItems = Array.isArray(news) && news.length > 0
    ? news.map((a) => ({
        id: a.id,
        title: a.title,
        url: `/news/${a.slug}`,
        source: a.author,
        published_at: a.created_at,
        currencies: [],
        category: a.category,
      }))
    : FALLBACK_NEWS;

  // Top movers: sort by abs(change24h), take top 4
  const topMovers = prices && Array.isArray(prices)
    ? [...prices].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)).slice(0, 4)
    : null;

  return (
    <>
      <Head>
        <title>LiveChainNews — Crypto News, Trending Tokens & Market Insights</title>
        <meta name="description" content="Real-time crypto news, trending tokens, and market analysis. Stay ahead with LiveChainNews." />
        <meta property="og:title" content="LiveChainNews" />
        <meta property="og:description" content="Real-time crypto intelligence for traders, investors, and builders." />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <PriceTicker />
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <div className={styles.heroText}>
                <div className={styles.heroEyebrow}>
                  <span className={styles.eyebrowDot} />
                  Live crypto intelligence
                </div>
                <h1 className={styles.heroH1}>
                  The <em className={styles.heroEm}>signal</em> in<br />the crypto noise
                </h1>
                <p className={styles.heroSub}>
                  Real-time news, trending tokens, and market insights — curated
                  for traders, investors, and builders worldwide.
                </p>
                <div className={styles.heroStats}>
                  <div className={styles.heroStat}>
                    <div className={styles.heroStatVal}>1,200+</div>
                    <div className={styles.heroStatLabel}>News articles</div>
                  </div>
                  <div className={styles.heroStat}>
                    <div className={styles.heroStatVal}>300+</div>
                    <div className={styles.heroStatLabel}>Tokens tracked</div>
                  </div>
                  <div className={styles.heroStat}>
                    <div className={styles.heroStatVal}>
                      <span className="live-badge">
                        <span className="live-dot" />Live
                      </span>
                    </div>
                    <div className={styles.heroStatLabel}>Market data</div>
                  </div>
                </div>
              </div>

              {/* Top Movers card */}
              <div className={styles.moversCard}>
                <div className={styles.moversTitle}>🔥 Top movers · 24h</div>
                {topMovers ? topMovers.map((coin) => {
                  const meta = getTokenMeta(coin.symbol);
                  const { text, cls } = fmtPct(coin.change24h);
                  return (
                    <div key={coin.id} className={styles.moverRow}>
                      <div className={styles.moverIcon} style={{ background: meta.bg, color: meta.color }}>
                        {meta.icon}
                      </div>
                      <div>
                        <div className={styles.moverName}>{coin.symbol}</div>
                        <div className={styles.moverPrice}>{fmtPrice(coin.price)}</div>
                      </div>
                      <div className={`${styles.moverChg} ${cls === 'pos' ? styles.pos : styles.neg}`}>
                        {text}
                      </div>
                    </div>
                  );
                }) : Array(4).fill(null).map((_, i) => (
                  <div key={i} className={styles.moverRow}>
                    <div className={`skeleton ${styles.moverIconSk}`} />
                    <div style={{ flex: 1 }}>
                      <div className={`skeleton ${styles.skName}`} />
                      <div className={`skeleton ${styles.skPrice}`} />
                    </div>
                    <div className={`skeleton ${styles.skChg}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          {/* ── CATEGORY FILTER ── */}
          <div className={styles.categories}>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveFilter(c.key)}
                className={`${styles.catBtn} ${activeFilter === c.key ? styles.catActive : ''}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* ── MAIN GRID ── */}
          <div className={styles.mainGrid}>
            {/* NEWS */}
            <div className={styles.newsSection}>
              <div className="section-header">
                <div className="section-title">
                  <div className="section-title-dot" />
                  Latest News
                  <span className="live-badge" style={{ marginLeft: 8 }}>
                    <span className="live-dot" />Live
                  </span>
                </div>
                <a href="/news" className="section-link">View all →</a>
              </div>

              <NewsFeatured article={newsItems[0]} index={0} />

              <div>
                {newsItems.slice(1, 9).map((article, i) => (
                  <NewsCard key={article?.id || i} article={article} index={i} />
                ))}
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className={styles.sidebar}>
              <TrendingWidget />
              <FearGreedWidget />

              {/* Newsletter */}
              <div className="widget">
                <div className="widget-header">
                  <div className="widget-title"><span>📧</span> Daily Digest</div>
                </div>
                <div className={styles.newsletter}>
                  <h3>Stay ahead of the market</h3>
                  <p>Get the top 5 crypto stories every morning — no noise, just signal.</p>
                  <input type="email" placeholder="your@email.com" className={styles.newsletterInput} />
                  <button className={styles.btnSubscribe}>Subscribe free →</button>
                  <div className={styles.newsletterNote}>No spam. Unsubscribe anytime.</div>
                </div>
              </div>

              {/* Promote */}
              <div className={styles.promoteBanner}>
                <h3>Launch your <span>project</span> here</h3>
                <p>Reach thousands of crypto investors and traders on LiveChainNews.</p>
                <a href="/advertise" className={styles.btnList}>🚀 Get Listed</a>
                <div className={styles.promoteStats}>
                  <div className={styles.promoteStat}><strong>50K+</strong>readers/mo</div>
                  <div className={styles.promoteStat}><strong>12+</strong>countries</div>
                  <div className={styles.promoteStat}><strong>24h</strong>turnaround</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
