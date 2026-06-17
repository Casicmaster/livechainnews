import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import Navbar from '../../components/Navbar';
import PriceTicker from '../../components/PriceTicker';
import Footer from '../../components/Footer';
import { timeAgo } from '../../lib/utils';
import styles from '../news/news.module.css';

const fetcher = (url) => fetch(url).then((r) => r.json());

const CATEGORIES = ['all', 'Opinion', 'Markets', 'Industry', 'Technology', 'Regulation'];

export default function BlogList() {
  const [filter, setFilter] = useState('all');
  const { data: articles } = useSWR(
    `/api/articles?filter=${filter === 'all' ? 'Blog' : filter}&limit=50`,
    fetcher
  );
  const list = Array.isArray(articles) ? articles : [];

  return (
    <>
      <Head>
        <title>Blog – LiveChainNews</title>
        <meta name="description" content="Opinions, insights and editorial content on crypto markets, blockchain technology and the future of finance." />
        <link rel="canonical" href="https://livechainnews.com/blog" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1 className={styles.pageTitle}>Blog</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 16 }}>
          Opinions, insights and editorial takes on the crypto world.
        </p>
        <div className={styles.cats}>
          {CATEGORIES.map((c) => (
            <button key={c}
              className={`${styles.catBtn} ${filter === c ? styles.catActive : ''}`}
              onClick={() => setFilter(c)}>
              {c === 'all' ? 'All Posts' : c}
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <p className={styles.empty}>No posts yet. Check back soon!</p>
        ) : (
          <div className={styles.grid}>
            {list.map((a) => (
              <Link key={a.id} href={`/news/${a.slug}`} className={styles.card}>
                <div className={styles.cardImg}>
                  {a.image_url
                    ? <img src={a.image_url} alt={a.title} />
                    : <div className={styles.cardImgPlaceholder}>✍️</div>}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardCat}>{a.category}</span>
                  <h2 className={styles.cardTitle}>{a.title}</h2>
                  {a.excerpt && <p className={styles.cardExcerpt}>{a.excerpt}</p>}
                  <div className={styles.cardMeta}>
                    <span>{a.author}</span>
                    <span>·</span>
                    <span>{timeAgo(a.created_at)}</span>
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