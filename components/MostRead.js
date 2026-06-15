import useSWR from "swr";
import Link from "next/link";
import styles from "./MostRead.module.css";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function MostRead() {
  const { data: articles } = useSWR("/api/most-read", fetcher, { refreshInterval: 120000 });
  const list = Array.isArray(articles) ? articles.filter((a) => a.views > 0) : [];

  if (articles && list.length === 0) return null;

  return (
    <div className="widget">
      <div className="widget-header">
        <div className="widget-title"><span>🏆</span> Most Read</div>
      </div>
      <div className={styles.list}>
        {!articles
          ? Array(4).fill(null).map((_, i) => (
              <div key={i} className={styles.item} style={{ pointerEvents: "none" }}>
                <span className={styles.rank}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div className={"skeleton " + styles.sk} />
                  <div className={"skeleton " + styles.sk2} />
                </div>
              </div>
            ))
          : list.map((a, i) => (
              <Link key={a.id} href={"/news/" + a.slug} className={styles.item}>
                <span className={styles.rank + " " + (i < 3 ? styles.rankTop : "")}>
                  {i + 1}
                </span>
                <div className={styles.body}>
                  <div className={styles.title}>{a.title}</div>
                  <div className={styles.meta}>
                    <span className={styles.cat}>{a.category}</span>
                    <span className={styles.views}>{a.views.toLocaleString()} views</span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
