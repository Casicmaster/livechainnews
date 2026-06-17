import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import Navbar from '../../components/Navbar';
import PriceTicker from '../../components/PriceTicker';
import Footer from '../../components/Footer';
import { timeAgo } from '../../lib/utils';
import styles from '../news/news.module.css';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Analysis() {
  const { data: articles } = useSWR('/api/articles?filter=Analysis&limit=50', fetcher);
  const list = Array.isArray(articles) ? articles : [];

  return (
    <>
      <Head>
        <title>Crypto Analysis – LiveChainNews</title>
        <meta name="description" content="In-depth crypto market analysis, chart breakdowns and expert insights on Bitcoin, Ethereum and altcoins." />
        <link rel="canonical" href="https://livechainnews.com/analysis" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1 className={styles.pageTitle}>Market Analysis</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 16 }}>
          In-depth breakdowns, chart analysis and expert insights on crypto markets.
        </p>
        {list.length === 0 ? (
          <p className={styles.empty}>No analysis yet. Check back soon!</p>
        ) : (
          <div className={styles.grid}>
            {list.map((a) => (
              <Link key={a.id} href={`/news/${a.slug}`} className={styles.card}>
                <div className={styles.cardImg}>
                  {a.image_url
                    ? <img src={a.image_url} alt={a.title} />
                    : <div className={styles.cardImgPlaceholder}>📊</div>}
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