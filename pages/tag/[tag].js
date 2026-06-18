import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import Navbar from '../../components/Navbar';
import PriceTicker from '../../components/PriceTicker';
import Footer from '../../components/Footer';
import { timeAgo, readingTime } from '../../lib/utils';
import { useRouter } from 'next/router';
import styles from '../news/news.module.css';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function TagPage() {
  const router = useRouter();
  const { tag } = router.query;
  const { data: articles } = useSWR(tag ? `/api/articles?tag=${tag}&limit=50` : null, fetcher);
  const list = Array.isArray(articles) ? articles : [];

  return (
    <>
      <Head>
        <title>#{tag} – LiveChainNews</title>
        <meta name="description" content={`Latest crypto news and articles tagged with #${tag} on LiveChainNews.`} />
        <link rel="canonical" href={`https://livechainnews.com/tag/${tag}`} />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1 className={styles.pageTitle}>#{tag}</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 15 }}>
          {list.length} article{list.length !== 1 ? 's' : ''} tagged with #{tag}
        </p>
        {list.length === 0 ? (
          <p className={styles.empty}>No articles with this tag yet.</p>
        ) : (
          <div className={styles.grid}>
            {list.map((a) => (
              <Link key={a.id} href={`/news/${a.slug}`} className={styles.card}>
                <div className={styles.cardImg}>
                  {a.image_url
                    ? <img src={a.image_url} alt={a.title} />
                    : <div className={styles.cardImgPlaceholder}>🏷️</div>}
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