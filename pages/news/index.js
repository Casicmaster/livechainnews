import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import Navbar from '../../components/Navbar';
import PriceTicker from '../../components/PriceTicker';
import Footer from '../../components/Footer';
import { timeAgo, readingTime } from '../../lib/utils';
import styles from './news.module.css';

const fetcher = (url) => fetch(url).then((r) => r.json());

const CATEGORIES = ['all', 'Bitcoin', 'Ethereum', 'DeFi', 'NFT', 'Regulation', 'Altcoin'];

export default function NewsList() {
  const [filter, setFilter] = useState('all');
  const { data: articles } = useSWR(`/api/articles?filter=${filter === 'all' ? 'News' : filter}`, fetcher);
  const list = Array.isArray(articles) ? articles : [];

  return (
    <>
      <Head>
        <title>Latest Crypto News — Bitcoin, Ethereum, DeFi & Altcoins | LiveChainNews</title>
        <meta name="description" content="Breaking cryptocurrency news and analysis. Stay updated on Bitcoin, Ethereum, DeFi, NFTs, regulation and the latest developments in the crypto market." />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1 className={styles.pageTitle}>Latest News</h1>

        <div className={styles.cats}>
          {CATEGORIES.map((c) => (
            <button key={c}
              className={`${styles.catBtn} ${filter === c ? styles.catActive : ''}`}
              onClick={() => setFilter(c)}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className={styles.empty}>No articles yet. Check back soon!</p>
        ) : (
          <div className={styles.grid}>
            {list.map((a) => (
              <Link key={a.id} href={`/news/${a.slug}`} className={styles.card}>
                <div className={styles.cardImg} style={{ position: 'relative' }}>
                  {a.image_url
                    ? <Image src={a.image_url} alt={a.image_alt || a.title} fill sizes="(max-width: 768px) 100vw, 400px" style={{ objectFit: 'cover' }} />
                    : <div className={styles.cardImgPlaceholder}>📰</div>}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardCat}>{a.category}</span>
                  <h2 className={styles.cardTitle}>{a.title}</h2>
                  {a.excerpt && <p className={styles.cardExcerpt}>{a.excerpt}</p>}
                  {a.tags && a.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      {a.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{
                          padding: '2px 8px',
                          background: 'rgba(0,230,118,0.08)',
                          border: '1px solid rgba(0,230,118,0.15)',
                          borderRadius: 20,
                          fontSize: 11,
                          color: '#00e676',
                          fontFamily: 'var(--font-mono)',
                        }}>#{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className={styles.cardMeta}>
                    <span>{a.author}</span>
                    <span>·</span>
                    <span>{timeAgo(a.created_at)}</span>
                    <span>·</span>
                    <span>{readingTime(a.body)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
