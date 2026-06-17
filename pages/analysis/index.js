import Head from 'next/head';
import { useEffect } from 'react';
import useSWR from 'swr';
import Navbar from '../../components/Navbar';
import PriceTicker from '../../components/PriceTicker';
import Footer from '../../components/Footer';
import styles from '../news/news.module.css';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Analysis() {
  const { data: tweets } = useSWR('/api/tweets', fetcher);
  const list = Array.isArray(tweets) ? tweets : [];

  useEffect(() => {
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, [list]);

  return (
    <>
      <Head>
        <title>Crypto Analysis – LiveChainNews</title>
        <meta name="description" content="Top crypto trader insights and market analysis curated from X (Twitter)." />
        <link rel="canonical" href="https://livechainnews.com/analysis" />
        <script async src="https://platform.twitter.com/widgets.js" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1 className={styles.pageTitle}>Market Analysis</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 16 }}>
          Curated insights from top crypto traders and analysts on X.
        </p>

        {list.length === 0 ? (
          <p className={styles.empty}>No analysis posts yet. Check back soon!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {list.map((t) => (
              <div key={t.id} style={{
                background: '#111',
                border: '1px solid #222',
                borderRadius: 12,
                padding: 16,
                overflow: 'hidden'
              }}>
                {t.note && (
                  <p style={{ color: '#00e676', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>
                    {t.note}
                  </p>
                )}
                <blockquote
                  className="twitter-tweet"
                  data-theme="dark"
                  data-dnt="true"
                >
                  <a href={t.url}></a>
                </blockquote>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}