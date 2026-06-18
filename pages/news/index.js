import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
        <title>Crypto News — LiveChainNews</title>
        <meta name="description" content="Latest crypto news and analysis from LiveChainNews." />
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
                <div className={styles.cardImg}>
                  {a.image_url
                    ? <img src={a.image_url} alt={a.title} />
                    : <div className={styles.cardImgPlaceholder}>📰</div>}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardCat}>{a.category}</span>
                  <h2 className={styles.cardTitle}>{a.title}</h2>
                  {a.excerpt && <p className={styles.cardExcerpt}>{a.excerpt}</p>}
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
