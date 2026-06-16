import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import PriceTicker from '../../components/PriceTicker';
import Footer from '../../components/Footer';
import InlinePrice from '../../components/InlinePrice';
import ShareButtons from '../../components/ShareButtons';
import { supabase } from '../../lib/supabase';
import { timeAgo } from '../../lib/utils';
import styles from './article.module.css';

export default function Article({ article, related }) {
  useEffect(() => {
    if (article?.slug) {
      fetch('/api/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: article.slug }),
      }).catch(() => {});
    }
  }, [article?.slug]);

  if (!article) {
    return (
      <>
        <PriceTicker />
        <Navbar />
        <main className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h1>Article not found</h1>
          <Link href="/news" className={styles.backLink}>← Back to news</Link>
        </main>
        <Footer />
      </>
    );
  }

  const url = `https://livechainnews.com/news/${article.slug}`;

  return (
    <>
      <Head>
        <title>{`${article.title} — LiveChainNews`}</title>
        <meta name="description" content={article.excerpt || article.title} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || ''} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsArticle',
              headline: article.title,
              description: article.excerpt || '',
              image: article.image_url ? [article.image_url] : undefined,
              datePublished: article.created_at,
              dateModified: article.created_at,
              author: { '@type': 'Organization', name: article.author || 'LiveChainNews' },
              publisher: {
                '@type': 'Organization',
                name: 'LiveChainNews',
                url: 'https://livechainnews.com',
              },
              mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            }),
          }}
        />
      </Head>

      <PriceTicker />
      <Navbar />

      <main className={styles.wrap}>
        <article className={styles.article}>
          <Link href="/news" className={styles.backLink}>← All news</Link>

          <span className={styles.cat}>{article.category}</span>
          <h1 className={styles.title}>{article.title}</h1>

          <div className={styles.meta}>
            <span>{article.author}</span>
            <span className={styles.dot}>·</span>
            <span>{timeAgo(article.created_at)}</span>
          </div>

          {article.image_url && (
            <div className={styles.hero}>
              <img src={article.image_url} alt={article.title} />
            </div>
          )}

          {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}

          <div className={styles.body}>
            {(article.body || '').split('\n').map((para, i) => {
              const trimmed = para.trim();
              if (!trimmed) return <br key={i} />;
              const priceMatch = trimmed.match(/^\[PRICE:([A-Za-z0-9]+)\]$/);
              if (priceMatch) {
                return <InlinePrice key={i} symbol={priceMatch[1]} />;
              }
              return <p key={i}>{para}</p>;
            })}
          </div>

          <ShareButtons title={article.title} slug={article.slug} />
        </article>

        {related && related.length > 0 && (
          <aside className={styles.related}>
            <h3 className={styles.relatedTitle}>More news</h3>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <Link key={r.id} href={`/news/${r.slug}`} className={styles.relatedCard}>
                  <span className={styles.relatedCat}>{r.category}</span>
                  <div className={styles.relatedCardTitle}>{r.title}</div>
                  <div className={styles.relatedMeta}>{timeAgo(r.created_at)}</div>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </main>

      <Footer />
    </>
  );
}

// Server-side render for SEO — Google sees the full article
export async function getServerSideProps({ params }) {
  try {
    const { data: article } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', params.slug)
      .eq('published', true)
      .single();

    if (!article) return { props: { article: null, related: [] } };

    const { data: related } = await supabase
      .from('articles')
      .select('id, title, slug, category, created_at')
      .eq('published', true)
      .neq('id', article.id)
      .order('created_at', { ascending: false })
      .limit(4);

    return { props: { article, related: related || [] } };
  } catch (e) {
    return { props: { article: null, related: [] } };
  }
}
