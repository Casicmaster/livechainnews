import useSWR from "swr";
import { fmtPrice, fmtPct } from "../lib/utils";
import TokenLogo from "./TokenLogo";
import styles from "./TrendingWidget.module.css";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function TrendingWidget() {
  const { data: coins, mutate } = useSWR("/api/trending", fetcher, {
    refreshInterval: 120000,
  });

  const isLoading = !coins || !Array.isArray(coins);

  return (
    <div className="widget">
      <div className="widget-header">
        <div className="widget-title">
          <span>Trending Tokens</span>
        </div>
        <button className={styles.refresh} onClick={() => mutate()}>
          refresh
        </button>
      </div>

      <div className={styles.list}>
        {isLoading
          ? Array(6).fill(null).map((_, i) => <SkeletonRow key={i} />)
          : coins.map((coin, i) => {
              const { text: chgText, cls } = fmtPct(coin.change24h);
              return (
                <a
                  key={coin.id}
                  href={"https://www.coingecko.com/en/coins/" + coin.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.item}
                >
                  <span className={styles.rank + " " + (i < 3 ? styles.rankTop : "")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <TokenLogo symbol={coin.symbol} image={coin.thumb} size={34} />
                  <div className={styles.name}>
                    <div className={styles.nameMain}>{coin.name}</div>
                    <div className={styles.nameSym}>{coin.symbol}</div>
                  </div>
                  <div className={styles.right}>
                    <div className={styles.price}>{fmtPrice(coin.price)}</div>
                    {coin.change24h !== null && (
                      <span className={styles.chg + " " + (cls === "pos" ? styles.pos : styles.neg)}>
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
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Auto-refresh</span>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className={styles.item} style={{ pointerEvents: "none" }}>
      <span className={"skeleton " + styles.skRank} />
      <span className={"skeleton " + styles.skIcon} />
      <div style={{ flex: 1 }}>
        <div className={"skeleton " + styles.skName} />
        <div className={"skeleton " + styles.skSym} />
      </div>
      <div>
        <div className={"skeleton " + styles.skPrice} />
        <div className={"skeleton " + styles.skChg} />
      </div>
    </div>
  );
}

