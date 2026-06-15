import useSWR from "swr";
import { fmtLargeNum, fmtPct } from "../lib/utils";
import styles from "./MarketOverview.module.css";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function MarketOverview() {
  const { data } = useSWR("/api/global", fetcher, { refreshInterval: 60000 });

  const capChange = data ? fmtPct(data.marketCapChange24h) : null;

  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <span>🌐 Market Overview</span>
        <span className="live-badge"><span className="live-dot" />Live</span>
      </div>

      <div className={styles.bigStat}>
        <div className={styles.bigLabel}>Total Market Cap</div>
        <div className={styles.bigValue}>
          {data ? fmtLargeNum(data.totalMarketCap) : <span className={`skeleton ${styles.skBig}`} />}
        </div>
        {capChange && (
          <div className={`${styles.bigChange} ${capChange.cls === "pos" ? styles.pos : styles.neg}`}>
            {capChange.text} <span className={styles.period}>24h</span>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>24h Volume</div>
          <div className={styles.statValue}>
            {data ? fmtLargeNum(data.totalVolume) : <span className={`skeleton ${styles.skSmall}`} />}
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>BTC Dominance</div>
          <div className={styles.statValue}>
            {data ? `${data.btcDominance?.toFixed(1)}%` : <span className={`skeleton ${styles.skSmall}`} />}
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>ETH Dominance</div>
          <div className={styles.statValue}>
            {data ? `${data.ethDominance?.toFixed(1)}%` : <span className={`skeleton ${styles.skSmall}`} />}
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Active Coins</div>
          <div className={styles.statValue}>
            {data ? data.activeCryptos?.toLocaleString() : <span className={`skeleton ${styles.skSmall}`} />}
          </div>
        </div>
      </div>

      {data && (
        <div className={styles.domBar}>
          <div className={styles.domFill} style={{ width: `${data.btcDominance}%` }} />
          <div className={styles.domLabel}>
            <span>BTC {data.btcDominance?.toFixed(0)}%</span>
            <span className={styles.domOther}>Alts {(100 - data.btcDominance)?.toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
