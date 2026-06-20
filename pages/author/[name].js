import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Navbar from '../../components/Navbar';
import PriceTicker from '../../components/PriceTicker';
import Footer from '../../components/Footer';
import { timeAgo, readingTime } from '../../lib/utils';
import styles from '../news/news.module.css';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AuthorPage() {
  const router = useRouter();
  const { name } = router.query;
  const decodedName = name ? decodeURIComponent(name) : '';
  const { data: articles } = useSWR(name ? `/api/articles?author=${encodeURIComponent(decodedName)}&limit=50` : null, fetcher);
  const list = Array.isArray(articles) ? articles : [];

  return (
    <>
      <Head>
        <title>{decodedName} – Author at LiveChainNews</title>
        <meta name="description" content={`Articles written by ${decodedName} on LiveChainNews — crypto news, analysis and guides.`} />
        <link rel="canonical" href={`https://livechainnews.com/author/${name}`} />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #00e676, #00b0ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#000', flexShrink: 0 }}>
            {decodedName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{decodedName}</h1>
            <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>
              {list.length} article{list.length !== 1 ? 's' : ''} published
            </p>
          </div>
        </div>

        <div style={{ borderBottom: '1px solid #222', margin: '24px 0 32px' }} />

        {list.length === 0 ? (
          <p className={styles.empty}>No articles by this author yet.</p>
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
                  <div className={styles.cardMeta}>
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