import useSWR from 'swr';
import styles from './FearGreedWidget.module.css';

const fetcher = (url) => fetch(url).then((r) => r.json());

function fgColor(val) {
  if (val < 25) return '#ff4757';
  if (val < 45) return '#ff9f43';
  if (val < 55) return '#f1c40f';
  if (val < 75) return '#00c45a';
  return '#00e676';
}

export default function FearGreedWidget() {
  const { data } = useSWR('/api/feargreed', fetcher, { refreshInterval: 3600000 });

  const val = data?.value ?? null;
  const cls = data?.classification ?? 'Loading...';

  return (
    <div className="widget">
      <div className="widget-header">
        <div className="widget-title"><span>🧠</span> Fear &amp; Greed Index</div>
        <span className="live-badge"><span className="live-dot" />Live</span>
      </div>
      <div className={styles.body}>
        <div className={styles.meterLabel}>Market sentiment — 24h</div>
        <div className={styles.meter}>
          <div
            className={styles.needle}
            style={{ left: val !== null ? `${val}%` : '50%' }}
          />
        </div>
        <div className={styles.meterTicks}>
          <span>Extreme Fear</span>
          <span>Neutral</span>
          <span>Extreme Greed</span>
        </div>
        <div className={styles.valueWrap}>
          <div
            className={styles.value}
            style={{ color: val !== null ? fgColor(val) : 'var(--text-muted)' }}
          >
            {val !== null ? val : '—'}
          </div>
          <div className={styles.classification}>{cls}</div>
        </div>
      </div>
    </div>
  );
}
