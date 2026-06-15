import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fmtPrice, fmtPct } from '../lib/utils';
import TokenLogo from './TokenLogo';
import styles from './PriceTicker.module.css';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PriceTicker() {
  const { data: coins } = useSWR('/api/prices', fetcher, { refreshInterval: 60000 });
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (coins && Array.isArray(coins)) setItems(coins);
  }, [coins]);

  const content = items.length ? items : Array(8).fill(null);

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>⚡ LIVE</div>
      <div className={styles.trackWrap}>
        <div className={styles.track}>
          {/* Duplicate for seamless loop */}
          {[...content, ...content].map((coin, i) => {
            if (!coin) return (
              <div key={i} className={styles.item}>
                <span className={styles.coinSkeleton} />
              </div>
            );
            const { text, cls } = fmtPct(coin.change24h);
            return (
              <div key={i} className={styles.item}>
                <TokenLogo symbol={coin.symbol} image={coin.image} size={18} />
                <span className={styles.sym}>{coin.symbol}</span>
                <span className={styles.price}>{fmtPrice(coin.price)}</span>
                <span className={`${styles.chg} ${cls === 'pos' ? styles.pos : styles.neg}`}>
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
