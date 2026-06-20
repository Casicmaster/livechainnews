import Link from 'next/link';
import useSWR from 'swr';
import { timeAgo } from '../lib/utils';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AnalysisWidget({ limit = 5 }) {
  const { data } = useSWR(`/api/articles?filter=Analysis&limit=${limit}`, fetcher, { refreshInterval: 120000 });
  const list = Array.isArray(data) ? data.slice(0, limit) : [];

  if (list.length === 0) return null;

  return (
    <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          📊 Analysis
        </h3>
        <Link href="/analysis" style={{ fontSize: 11, color: '#00e676', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
          View all →
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {list.map((a, i) => (
          <Link key={a.id} href={`/news/${a.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ paddingBottom: 14, borderBottom: i < list.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
              <div style={{ fontSize: 10, color: '#00e676', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e676', display: 'inline-block', boxShadow: '0 0 6px #00e676', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
                {timeAgo(a.created_at)}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {a.title}
              </div>
              {a.excerpt && (
                <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 6 }}>
                  {a.excerpt}
                </div>
              )}
              <span className="analysisArrow" style={{ color: '#00e676', fontSize: 13, fontWeight: 700 }}>Read more →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}