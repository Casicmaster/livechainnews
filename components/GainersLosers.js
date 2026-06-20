import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

function fmtPrice(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1000) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (n >= 1) return '$' + n.toFixed(2);
  if (n >= 0.01) return '$' + n.toFixed(4);
  return '$' + n.toFixed(6);
}

function Row({ coin }) {
  const up = (coin.change24h ?? 0) >= 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
      <img src={coin.image} alt={coin.name} width={24} height={24} loading="lazy" style={{ borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{coin.symbol}</div>
        <div style={{ fontSize: 11, color: '#666' }}>{fmtPrice(coin.price)}</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: up ? '#00e676' : '#ff5252', fontFamily: 'var(--font-mono)' }}>
        {up ? '+' : ''}{(coin.change24h ?? 0).toFixed(1)}%
      </div>
    </div>
  );
}

export default function GainersLosers() {
  const { data } = useSWR('/api/markets', fetcher, { refreshInterval: 120000 });
  const list = Array.isArray(data) ? data : [];

  if (list.length === 0) return null;

  const sorted = [...list].filter((c) => c.change24h != null);
  const gainers = [...sorted].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
  const losers = [...sorted].sort((a, b) => a.change24h - b.change24h).slice(0, 5);

  return (
    <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, padding: 18 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        Top Gainers
      </h3>
      <div>{gainers.map((c) => <Row key={c.id} coin={c} />)}</div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '18px 0 12px', paddingTop: 16, borderTop: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 7 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
        Top Losers
      </h3>
      <div>{losers.map((c) => <Row key={c.id} coin={c} />)}</div>
    </div>
  );
}