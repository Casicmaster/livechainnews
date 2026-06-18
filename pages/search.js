import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';
import { timeAgo, readingTime } from '../lib/utils';
import styles from './news/news.module.css';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q || q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => { setResults(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [q]);

  return (
    <>
      <Head>
        <title>{q ? `Search: ${q}` : 'Search'} – LiveChainNews</title>
        <meta name="robots" content="noindex" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1 className={styles.pageTitle}>
          {q ? `Search results for "${q}"` : 'Search'}
        </h1>
        {loading && <p style={{ color: '#888' }}>Searching...</p>}
        {!loading && q && results.length === 0 && (
          <p className={styles.empty}>No results found for "{q}". Try a different keyword.</p>
        )}
        {!loading && results.length > 0 && (
          <>
            <p style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>{results.length} result{results.length !== 1 ? 's' : ''} found</p>
            <div className={styles.grid}>
              {results.map((a) => (
                <Link key={a.id} href={`/news/${a.slug}`} className={styles.card}>
                  <div className={styles.cardImg}>
                    {a.image_url
                      ? <img src={a.image_url} alt={a.title} />
                      : <div className={styles.cardImgPlaceholder}>🔍</div>}
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
          </>
        )}
      </main>
      <Footer />
    </>
  );
}