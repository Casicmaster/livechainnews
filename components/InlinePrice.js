import useSWR from "swr";
import { fmtPrice, fmtPct } from "../lib/utils";
import TokenLogo from "./TokenLogo";
import styles from "./InlinePrice.module.css";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function InlinePrice({ symbol }) {
  const { data: coins } = useSWR("/api/prices", fetcher, { refreshInterval: 60000 });
  const sym = (symbol || "").toUpperCase();

  const coin = Array.isArray(coins)
    ? coins.find((c) => c.symbol === sym)
    : null;

  if (!coins) {
    return <div className={`${styles.card} skeleton`} style={{ height: 92 }} />;
  }

  if (!coin) {
    return null;
  }

  const { text, cls } = fmtPct(coin.change24h);

  return (
    <a
      href={`https://www.coingecko.com/en/coins/${coin.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <div className={styles.left}>
        <TokenLogo symbol={coin.symbol} image={coin.image} size={40} />
        <div>
          <div className={styles.name}>{coin.name}</div>
          <div className={styles.sym}>{coin.symbol} / USD</div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.price}>{fmtPrice(coin.price)}</div>
        <div className={styles.chg + " " + (cls === "pos" ? styles.pos : styles.neg)}>
          {text} <span className={styles.period}>24h</span>
        </div>
      </div>
      <div className={styles.liveTag}>
        <span className="live-dot" /> LIVE
      </div>
    </a>
  );
}
