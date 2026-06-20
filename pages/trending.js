import Head from 'next/head';
import useSWR from 'swr';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';
import LatestNews from '../components/LatestNews';
import FearGreedWidget from '../components/FearGreedWidget';
import TrendingWidget from '../components/TrendingWidget';
import styles from './prices.module.css';

const EXCHANGES = [
  {
    rank: 1,
    name: 'Binance',
    logo: 'https://bin.bnbstatic.com/static/images/common/favicon.ico',
    url: 'https://www.binance.com',
    volume24h: '$28.4B',
    coins: 350,
    year: 2017,
    type: 'CEX',
    rating: 4.8,
    description: 'World\'s largest crypto exchange by trading volume.',
  },
  {
    rank: 2,
    name: 'Coinbase',
    logo: 'https://www.coinbase.com/favicon.ico',
    url: 'https://www.coinbase.com',
    volume24h: '$4.2B',
    coins: 240,
    year: 2012,
    type: 'CEX',
    rating: 4.5,
    description: 'Most trusted US-based exchange, publicly listed on NASDAQ.',
  },
  {
    rank: 3,
    name: 'OKX',
    logo: 'https://www.okx.com/favicon.ico',
    url: 'https://www.okx.com',
    volume24h: '$3.8B',
    coins: 300,
    year: 2017,
    type: 'CEX',
    rating: 4.4,
    description: 'Leading global exchange with advanced trading features.',
  },
  {
    rank: 4,
    name: 'Bybit',
    logo: 'https://www.bybit.com/favicon.ico',
    url: 'https://www.bybit.com',
    volume24h: '$3.1B',
    coins: 200,
    year: 2018,
    type: 'CEX',
    rating: 4.4,
    description: 'Popular derivatives and spot exchange with low fees.',
  },
  {
    rank: 5,
    name: 'Kraken',
    logo: 'https://www.kraken.com/favicon.ico',
    url: 'https://www.kraken.com',
    volume24h: '$1.8B',
    coins: 180,
    year: 2011,
    type: 'CEX',
    rating: 4.5,
    description: 'Veteran exchange known for security and reliability.',
  },
  {
    rank: 6,
    name: 'KuCoin',
    logo: 'https://www.kucoin.com/favicon.ico',
    url: 'https://www.kucoin.com',
    volume24h: '$1.2B',
    coins: 700,
    year: 2017,
    type: 'CEX',
    rating: 4.2,
    description: 'Huge selection of altcoins, known as "The People\'s Exchange".',
  },
  {
    rank: 7,
    name: 'Gate.io',
    logo: 'https://www.gate.io/favicon.ico',
    url: 'https://www.gate.io',
    volume24h: '$980M',
    coins: 1400,
    year: 2013,
    type: 'CEX',
    rating: 4.1,
    description: 'One of the widest coin selections of any exchange.',
  },
  {
    rank: 8,
    name: 'Uniswap',
    logo: 'https://app.uniswap.org/favicon.ico',
    url: 'https://app.uniswap.org',
    volume24h: '$1.5B',
    coins: 5000,
    year: 2018,
    type: 'DEX',
    rating: 4.6,
    description: 'Largest decentralized exchange on Ethereum.',
  },
  {
    rank: 9,
    name: 'dYdX',
    logo: 'https://dydx.exchange/favicon.ico',
    url: 'https://dydx.exchange',
    volume24h: '$420M',
    coins: 35,
    year: 2017,
    type: 'DEX',
    rating: 4.3,
    description: 'Leading decentralized derivatives trading platform.',
  },
  {
    rank: 10,
    name: 'Bitget',
    logo: 'https://www.bitget.com/favicon.ico',
    url: 'https://www.bitget.com',
    volume24h: '$2.1B',
    coins: 250,
    year: 2018,
    type: 'CEX',
    rating: 4.3,
    description: 'Fast-growing exchange popular for copy trading.',
  },
];

const fetcher = (url) => fetch(url).then((r) => r.json());

function fmtVol(usd) {
  if (!usd) return '—';
  if (usd >= 1e9) return '$' + (usd / 1e9).toFixed(2) + 'B';
  if (usd >= 1e6) return '$' + (usd / 1e6).toFixed(1) + 'M';
  return '$' + usd.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function TopExchanges() {
  const { data: exchanges } = useSWR('/api/exchanges', fetcher, { refreshInterval: 300000 });
  const list = Array.isArray(exchanges) ? exchanges : [];
  return (
    <>
      <Head>
        <title>Top Crypto Exchanges — Ranked by Volume & Trust Score | LiveChainNews</title>
        <meta name="description" content="Compare the best crypto exchanges by volume, coins listed, fees and security. Find the right exchange for you." />
        <link rel="canonical" href="https://livechainnews.com/trending" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 1600, margin: '0 auto', padding: '32px 24px 60px' }}>
        <div className="pricesLayout">
        <aside className="pricesSidebarLeft">
          <LatestNews limit={5} />
        </aside>
        <div className="pricesMain">
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Top Crypto Exchanges</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 15 }}>
          Compare the best centralized and decentralized exchanges by volume, coins and reputation.
        </p>

        <div style={{ overflowX: 'auto' }}>
          {list.length === 0 ? (
            <p style={{ color: '#888', padding: '40px 0', textAlign: 'center' }}>Loading exchange data...</p>
          ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222', color: '#888', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>#</th>
                <th style={{ padding: '10px 12px' }}>Exchange</th>
                <th style={{ padding: '10px 12px' }}>Trust Score</th>
                <th style={{ padding: '10px 12px' }}>Volume 24h</th>
                <th style={{ padding: '10px 12px' }}>Founded</th>
                <th style={{ padding: '10px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {list.map((ex) => (
                <tr key={ex.id} style={{ borderBottom: '1px solid #1a1a1a' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0a0a0a'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 12px', color: '#888' }}>{ex.rank}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={ex.logo}
                        alt={ex.name}
                        width={28}
                        height={28}
                        style={{ borderRadius: 6, background: '#1a1a1a', objectFit: 'contain' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      <div style={{ fontWeight: 600, color: '#fff' }}>{ex.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    {ex.trustScore != null ? (
                      <span style={{
                        padding: '2px 10px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 700,
                        background: ex.trustScore >= 8 ? 'rgba(0,230,118,0.12)' : ex.trustScore >= 6 ? 'rgba(255,193,7,0.12)' : 'rgba(255,255,255,0.05)',
                        color: ex.trustScore >= 8 ? '#00e676' : ex.trustScore >= 6 ? '#ffc107' : '#aaa',
                      }}>{ex.trustScore}/10</span>
                    ) : <span style={{ color: '#555' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 12px', color: '#fff', fontWeight: 500 }}>{fmtVol(ex.volumeUsd)}</td>
                  <td style={{ padding: '14px 12px', color: '#aaa' }}>{ex.year || '—'}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <a href={ex.url} target="_blank" rel="noopener noreferrer" style={{
                      padding: '6px 14px',
                      background: '#00e676',
                      color: '#000',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 12,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}>Visit →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
        <p style={{ color: '#555', fontSize: 12, marginTop: 24, textAlign: 'center' }}>
          Data provided by CoinGecko, updated every 5 minutes. Trust Score reflects exchange liquidity and reliability. Always do your own research before using any exchange.
        </p>
        </div>
        <aside className="pricesSidebarRight">
          <TrendingWidget />
          <div style={{ marginTop: 16 }}><FearGreedWidget /></div>
        </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
