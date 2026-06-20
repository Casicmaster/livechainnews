import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import PriceTicker from '../../components/PriceTicker';
import Footer from '../../components/Footer';
import InlinePrice from '../../components/InlinePrice';
import ShareButtons from '../../components/ShareButtons';
import ReadingProgress from '../../components/ReadingProgress';
import { supabase } from '../../lib/supabase';
import { timeAgo, readingTime } from '../../lib/utils';
import { INTERNAL_LINKS } from '../../lib/internalLinks';
import styles from './article.module.css';

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function linkifyParagraph(text, currentSlug, usedKeywords) {
  let html = escapeHtml(text);
  for (const { keyword, url } of INTERNAL_LINKS) {
    // Skip if already used in this article or if it links to the current article
    if (usedKeywords.has(keyword)) continue;
    if (url.endsWith(currentSlug)) continue;
    // Match whole word, case-insensitive, first occurrence only
    const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i');
    if (regex.test(html)) {
      html = html.replace(regex, `<a href="${url}" style="color:#00e676;text-decoration:underline;">$1</a>`);
      usedKeywords.add(keyword);
    }
  }
  return html;
}
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://livechainnews.com' },
                { '@type': 'ListItem', position: 2, name: 'News', item: 'https://livechainnews.com/news' },
                { '@type': 'ListItem', position: 3, name: article.title, item: url },
              ],
            }),
          }}
        />
        {article.faq && article.faq.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: article.faq.map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: { '@type': 'Answer', text: item.answer },
                })),
              }),
            }}
          />
        )}
      </Head>

      <ReadingProgress />
      <PriceTicker />
      <Navbar />

      <main className={styles.wrap}>
        <article className={styles.article}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#888', marginBottom: 16, fontFamily: 'var(--font-mono)', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
            <span style={{ opacity: 0.5 }}>›</span>
            <Link href="/news" style={{ color: '#888', textDecoration: 'none' }}>News</Link>
            <span style={{ opacity: 0.5 }}>›</span>
            <span style={{ color: '#00e676' }}>{article.category}</span>
          </nav>

          <span className={styles.cat}>{article.category}</span>
          <h1 className={styles.title}>{article.title}</h1>

          <div className={styles.meta}>
            <Link href={`/author/${encodeURIComponent(article.author)}`} style={{ color: '#00e676', textDecoration: 'none' }}>{article.author}</Link>
            <span className={styles.dot}>·</span>
            <span>{timeAgo(article.created_at)}</span>
            <span className={styles.dot}>·</span>
            <span>{readingTime(article.body)}</span>
          </div>

          {article.image_url && (
            <div className={styles.hero}>
              <Image
                src={article.image_url}
                alt={article.image_alt || article.title}
                width={760}
                height={420}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority
              />
            </div>
          )}

          {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}

          <div className={styles.body}>
            {(() => {
              const usedKeywords = new Set();
              return (article.body || '').split('\n').map((para, i) => {
                const trimmed = para.trim();
                if (!trimmed) return <br key={i} />;
                const priceMatch = trimmed.match(/^\[PRICE:([A-Za-z0-9]+)\]$/);
                if (priceMatch) {
                  return <InlinePrice key={i} symbol={priceMatch[1]} />;
                }
                return <p key={i} dangerouslySetInnerHTML={{ __html: linkifyParagraph(para, article.slug, usedKeywords) }} />;
              });
            })()}
          </div>

{article.tags && article.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '24px 0' }}>
              {article.tags.map((tag) => (
                <a key={tag} href={`/tag/${tag}`} style={{
                  padding: '4px 12px',
                  background: 'rgba(0,230,118,0.08)',
                  border: '1px solid rgba(0,230,118,0.2)',
                  borderRadius: 20,
                  fontSize: 12,
                  color: '#00e676',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  transition: 'background 0.2s',
                }}>#{tag}</a>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px', background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, margin: '32px 0' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #00e676, #00b0ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#000', flexShrink: 0 }}>
              {(article.author || 'L').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#888', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Written by</div>
              <Link href={`/author/${encodeURIComponent(article.author)}`} style={{ fontSize: 16, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>{article.author}</Link>
            </div>
            <Link href={`/author/${encodeURIComponent(article.author)}`} style={{ marginLeft: 'auto', fontSize: 13, color: '#00e676', textDecoration: 'none', fontWeight: 600 }}>View all articles →</Link>
          </div>
          {article.faq && article.faq.length > 0 && (
            <div style={{ margin: '40px 0' }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Frequently Asked Questions</h2>
              {article.faq.map((item, i) => (
                <div key={i} style={{ marginBottom: 16, padding: '16px 20px', background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{item.question}</div>
                  <div style={{ fontSize: 15, color: '#aaa', lineHeight: 1.7 }}>{item.answer}</div>
                </div>
              ))}
            </div>
          )}
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

    // Fetch a pool of recent articles to rank by relevance
    const { data: pool } = await supabase
      .from('articles')
      .select('id, title, slug, category, created_at, tags, image_url, image_alt')
      .eq('published', true)
      .neq('id', article.id)
      .order('created_at', { ascending: false })
      .limit(30);

    const articleTags = Array.isArray(article.tags) ? article.tags : [];

    // Score each article: +3 per shared tag, +1 if same category
    const scored = (pool || []).map((a) => {
      const aTags = Array.isArray(a.tags) ? a.tags : [];
      const sharedTags = aTags.filter((t) => articleTags.includes(t)).length;
      let score = sharedTags * 3;
      if (a.category === article.category) score += 1;
      return { ...a, score };
    });

    // Sort by score (highest first), then by date
    scored.sort((x, y) => {
      if (y.score !== x.score) return y.score - x.score;
      return new Date(y.created_at) - new Date(x.created_at);
    });

    const related = scored.slice(0, 4);

    return { props: { article, related } };
  } catch (e) {
    return { props: { article: null, related: [] } };
  }
}
