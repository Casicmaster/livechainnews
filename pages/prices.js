import { useState, useMemo } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';
import LatestNews from '../components/LatestNews';
import FearGreedWidget from '../components/FearGreedWidget';
import TrendingWidget from '../components/TrendingWidget';
import TokenLogo from '../components/TokenLogo';
import { fmtPrice, fmtPct, fmtLargeNum } from '../lib/utils';
import styles from './prices.module.css';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Prices() {
  const { data: coins } = useSWR('/api/markets', fetcher, { refreshInterval: 60000 });
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('rank');
  const [sortDir, setSortDir] = useState('asc');

  const list = Array.isArray(coins) ? coins : [];

  const filtered = useMemo(() => {
    let result = list;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (av == null) av = -Infinity;
      if (bv == null) bv = -Infinity;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return result;
  }, [list, search, sortKey, sortDir]);

  function sort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'rank' || key === 'name' ? 'asc' : 'desc');
    }
  }

  const arrow = (key) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <>
      <Head>
        <title>Crypto Prices — Live Market Data | LiveChainNews</title>
        <meta name="description" content="Live prices, market cap, volume and 7-day charts for the top 100 cryptocurrencies." />
        <link rel="canonical" href="https://livechainnews.com/prices" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main style={{ paddingTop: 28, paddingBottom: 60, maxWidth: 1600, margin: '0 auto', padding: '28px 24px 60px' }}>
        <div className="pricesLayout">
        <aside className="pricesSidebarLeft">
          <LatestNews limit={5} />
        </aside>
        <div className="pricesMain">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Cryptocurrency Prices</h1>
            <p className={styles.subtitle}>Live market data for the top 100 coins by market cap</p>
          </div>
          <input
            type="text"
            className={styles.search}
            placeholder="Search coin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thRank} onClick={() => sort('rank')}># {arrow('rank')}</th>
                <th className={styles.thName} onClick={() => sort('name')}>Coin{arrow('name')}</th>
                <th onClick={() => sort('price')}>Price{arrow('price')}</th>
                <th className={styles.hideSm} onClick={() => sort('change1h')}>1h{arrow('change1h')}</th>
                <th onClick={() => sort('change24h')}>24h{arrow('change24h')}</th>
                <th className={styles.hideSm} onClick={() => sort('change7d')}>7d{arrow('change7d')}</th>
                <th className={styles.hideMd} onClick={() => sort('marketCap')}>Market Cap{arrow('marketCap')}</th>
                <th className={styles.hideMd} onClick={() => sort('volume')}>Volume (24h){arrow('volume')}</th>
              </tr>
            </thead>
            <tbody>
              {!coins && Array(15).fill(null).map((_, i) => (
                <tr key={i}><td colSpan={9}><div className={`skeleton ${styles.rowSk}`} /></td></tr>
              ))}
              {filtered.map((c) => {
                const ch1 = fmtPct(c.change1h);
                const ch24 = fmtPct(c.change24h);
                const ch7 = fmtPct(c.change7d);
                return (
                  <tr key={c.id}>
                    <td className={styles.rank}>{c.rank}</td>
                    <td>
                      <div className={styles.coinCell}>
                        <TokenLogo symbol={c.symbol} image={c.image} size={28} />
                        <div className={styles.coinName}>
                          <span className={styles.coinMain}>{c.name}</span>
                          <span className={styles.coinSym}>{c.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.price}>{fmtPrice(c.price)}</td>
                    <td className={`${styles.hideSm} ${ch1.cls === 'pos' ? styles.pos : styles.neg}`}>{ch1.text}</td>
                    <td className={ch24.cls === 'pos' ? styles.pos : styles.neg}>{ch24.text}</td>
                    <td className={`${styles.hideSm} ${ch7.cls === 'pos' ? styles.pos : styles.neg}`}>{ch7.text}</td>
                    <td className={styles.hideMd}>{fmtLargeNum(c.marketCap)}</td>
                    <td className={styles.hideMd}>{fmtLargeNum(c.volume)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {coins && filtered.length === 0 && (
            <div className={styles.empty}>No coins found for "{search}"</div>
          )}
        </div>
        <p className={styles.disclaimer}>Data provided by CoinGecko. Prices update every minute. Not financial advice.</p>
        </div>
        <aside className="pricesSidebarRight">
          <FearGreedWidget />
          <div style={{ marginTop: 16 }}><TrendingWidget /></div>
        </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
