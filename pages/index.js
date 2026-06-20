import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';
import useSWR from 'swr';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import TrendingWidget from '../components/TrendingWidget';
import FearGreedWidget from '../components/FearGreedWidget';
import { NewsFeatured, NewsCard } from '../components/NewsCard';
import TokenLogo from '../components/TokenLogo';
import MostRead from '../components/MostRead';
import AnalysisWidget from '../components/AnalysisWidget';
import GainersLosers from '../components/GainersLosers';
import Newsletter from '../components/Newsletter';
import MarketOverview from '../components/MarketOverview';
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

export default function Home({ initialArticles = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  // Prices (for hero movers)
  const { data: prices } = useSWR('/api/prices', fetcher, { refreshInterval: 60000 });
  // SWR only when filter changes, seed with ISR data for 'all'
  const { data: news } = useSWR(
    activeFilter !== 'all' ? `/api/articles?filter=${activeFilter}` : null,
    fetcher,
    { refreshInterval: 60000 }
  );
  const rawArticles = activeFilter === 'all' ? initialArticles : (news || []);
  const newsItems = rawArticles.length > 0
    ? rawArticles.map((a) => ({
        id: a.id,
        title: a.title,
        url: `/news/${a.slug}`,
        image: a.image_url || null,
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
        <link rel="canonical" href="https://livechainnews.com" />
        <meta name="google-site-verification" content="gfO16MPYLJx2hmsuiAig1yhUqh5Ih9cZjhaYYoIAWkw" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://livechainnews.com" />
        <meta property="og:title" content="LiveChainNews — Crypto News & Market Insights" />
        <meta property="og:description" content="Real-time crypto news, trending tokens, and market analysis." />
        <meta property="og:image" content="https://livechainnews.com/og-image.png" />
        <meta property="og:site_name" content="LiveChainNews" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LiveChainNews" />
        <meta name="twitter:description" content="Real-time crypto news, trending tokens, and market analysis." />
        <meta name="twitter:image" content="https://livechainnews.com/og-image.png" />
      </Head>

      <PriceTicker />
      <Navbar />

      <main>
        <div style={{ paddingTop: 28, maxWidth: 1600, margin: '0 auto', padding: '28px 24px 0' }}>
          {/* â”€â”€ CATEGORY FILTER â”€â”€ */}
          {false && (
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
          )}

          {/* â”€â”€ MAIN GRID â”€â”€ */}
          <div className={styles.mainGrid}>
            {/* ANALYSIS SIDEBAR (left) */}
            <aside className={styles.analysisSidebar}>
              <AnalysisWidget limit={5} />
              <div style={{ marginTop: 18 }}><GainersLosers /></div>
            </aside>

            {/* NEWS */}
            <div className={styles.newsSection}>
              <div className="section-header">
                <div className="section-title">
                  <div className="section-title-dot" />
                  Latest Crypto News
                  </div>
                <a href="/news" className="section-link">View all →</a>
              </div>

              {newsItems.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#888' }}>
                  No articles in this category yet.
                </div>
              ) : (
                <>
                  <NewsFeatured article={newsItems[0]} index={0} />
                  <div className={styles.newsGrid}>
                    {newsItems.slice(1, 9).map((article, i) => (
                      <NewsCard key={article?.id || i} article={article} index={i} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className={styles.sidebar}>
              <div className={styles.mobileMarket}><MarketOverview /></div>
              <TrendingWidget />
              <MostRead />
              <FearGreedWidget />

              {/* Newsletter */}
              <Newsletter />

              {/* Promote */}
              {false && (
              <div className={styles.promoteBanner}>
                <h3>Launch your <span>project</span> here</h3>
                <p>Reach thousands of crypto investors and traders on LiveChainNews.</p>
                <a href="/advertise" className={styles.btnList}>Get Listed</a>
                <div className={styles.promoteStats}>
                  <div className={styles.promoteStat}><strong>50K+</strong>readers/mo</div>
                  <div className={styles.promoteStat}><strong>12+</strong>countries</div>
                  <div className={styles.promoteStat}><strong>24h</strong>turnaround</div>
                </div>
              </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
export async function getStaticProps() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .ilike('category', 'News')
    .order('created_at', { ascending: false })
    .limit(30);

  return {
    props: { initialArticles: data || [] },
    revalidate: 60,
  };
}





