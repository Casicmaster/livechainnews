import useSWR from 'swr';
import { fmtPrice, fmtPct, getTokenMeta } from '../lib/utils';
import styles from './TrendingWidget.module.css';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function TrendingWidget() {
  const { data: coins, mutate } = useSWR('/api/trending', fetcher, {
    refreshInterval: 120000,
  });

  const isLoading = !coins || !Array.isArray(coins);

  return (
    <div className="widget">
      <div className="widget-header">
        <div className="widget-title">
          <span>🔥</span> Trending Tokens
        </div>
        <button className={styles.refresh} onClick={() => mutate()}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
          refresh
        </button>
      </div>

      <div className={styles.list}>
        {isLoading
          ? Array(6).fill(null).map((_, i) => <SkeletonRow key={i} />)
          : coins.map((coin, i) => {
              const meta = getTokenMeta(coin.symbol);
              const { text: chgText, cls } = fmtPct(coin.change24h);
              return (
                <a
                  key={coin.id}
                  href={`https://www.coingecko.com/en/coins/${coin.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.item}
                >
                  <span className={`${styles.rank} ${i < 3 ? styles.rankTop : ''}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div
                    className={styles.icon}
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {meta.icon}
                  </div>
                  <div className={styles.name}>
                    <div className={styles.nameMain}>{coin.name}</div>
                    <div className={styles.nameSym}>{coin.symbol}</div>
                  </div>
                  <div className={styles.right}>
                    <div className={styles.price}>{fmtPrice(coin.price)}</div>
                    {coin.change24h !== null && (
                      <span className={`${styles.chg} ${cls === 'pos' ? styles.pos : styles.neg}`}>
                        {chgText}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
      </div>

      <div className={styles.footer}>
        <span>Data: CoinGecko</span>
        <span className="live-badge">
          <span className="live-dot" />
          Live
        </span>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className={styles.item} style={{ pointerEvents: 'none' }}>
      <span className={`skeleton ${styles.skRank}`} />
      <span className={`skeleton ${styles.skIcon}`} />
      <div style={{ flex: 1 }}>
        <div className={`skeleton ${styles.skName}`} />
        <div className={`skeleton ${styles.skSym}`} />
      </div>
      <div>
        <div className={`skeleton ${styles.skPrice}`} />
        <div className={`skeleton ${styles.skChg}`} />
      </div>
    </div>
  );
}
