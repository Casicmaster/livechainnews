import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function LatestNews({ limit = 5 }) {
  const { data } = useSWR(`/api/articles?filter=News&limit=${limit}`, fetcher, { refreshInterval: 120000 });
  const list = Array.isArray(data) ? data.slice(0, limit) : [];

  if (list.length === 0) return null;

  return (
    <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Latest News
        </h3>
        <Link href="/news" style={{ fontSize: 11, color: '#00e676', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
          View all →
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {list.map((a, i) => (
          <Link key={a.id} href={`/news/${a.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ display: 'flex', gap: 10, paddingBottom: 14, borderBottom: i < list.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
              {a.image_url && (
                <img src={a.image_url} alt={a.image_alt || a.title} width={56} height={56} loading="lazy"
                  style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0, background: '#1a1a1a' }} />
              )}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#eee', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {a.title}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}