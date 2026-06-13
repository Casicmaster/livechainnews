import Link from 'next/link';
import { guessTag, timeAgo, sourceName, NEWS_EMOJIS } from '../lib/utils';
import styles from './NewsCard.module.css';

// ── FEATURED (big card at top) ──
export function NewsFeatured({ article, index = 0 }) {
  if (!article) return <FeaturedSkeleton />;
  const tag = guessTag(article.title, article.currencies);
  const emoji = NEWS_EMOJIS[index % NEWS_EMOJIS.length];

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.featured}
    >
      <div className={styles.featuredImg}>
        <span className={styles.featuredEmoji}>{emoji}</span>
      </div>
      <div className={styles.featuredBody}>
        <span className={`tag ${tag.cls}`}>{tag.label}</span>
        <h2 className={styles.featuredTitle}>{article.title}</h2>
        <div className={styles.meta}>
          <span>{sourceName(article.source)}</span>
          <span className={styles.metaDot}>·</span>
          <span>{timeAgo(article.published_at)}</span>
        </div>
      </div>
    </a>
  );
}

// ── LIST CARD ──
export function NewsCard({ article, index }) {
  if (!article) return <CardSkeleton num={index + 2} />;
  const tag = guessTag(article.title, article.currencies);
  const emoji = NEWS_EMOJIS[(index + 4) % NEWS_EMOJIS.length];
  const num = String(index + 2).padStart(2, '0');

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <div className={styles.cardNum}>{num}</div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>{article.title}</div>
        <div className={styles.cardMeta}>
          <span className={`tag ${tag.cls}`}>{tag.label}</span>
          <span>{sourceName(article.source)}</span>
          <span className={styles.metaDot}>·</span>
          <span>{timeAgo(article.published_at)}</span>
        </div>
      </div>
      <div className={styles.cardThumb}>{emoji}</div>
    </a>
  );
}

// ── SKELETONS ──
function FeaturedSkeleton() {
  return (
    <div className={styles.featured} style={{ pointerEvents: 'none' }}>
      <div className={`skeleton ${styles.featuredImg}`} style={{ display: 'block' }} />
      <div className={styles.featuredBody}>
        <div className={`skeleton ${styles.skTag}`} />
        <div className={`skeleton ${styles.skTitle}`} />
        <div className={`skeleton ${styles.skMeta}`} />
      </div>
    </div>
  );
}

function CardSkeleton({ num }) {
  return (
    <div className={styles.card} style={{ pointerEvents: 'none' }}>
      <div className={styles.cardNum} style={{ color: 'var(--text-muted)' }}>{String(num).padStart(2,'0')}</div>
      <div className={styles.cardBody}>
        <div className={`skeleton ${styles.skCardTitle}`} />
        <div className={`skeleton ${styles.skCardMeta}`} />
      </div>
      <div className={`skeleton ${styles.cardThumb}`} />
    </div>
  );
}
