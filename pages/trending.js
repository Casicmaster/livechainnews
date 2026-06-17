import Head from 'next/head';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';
import styles from './prices.module.css';

const EXCHANGES = [
  {
    rank: 1,
    name: 'Binance',
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
    url: 'https://www.bitget.com',
    volume24h: '$2.1B',
    coins: 250,
    year: 2018,
    type: 'CEX',
    rating: 4.3,
    description: 'Fast-growing exchange popular for copy trading.',
  },
];

export default function TopExchanges() {
  return (
    <>
      <Head>
        <title>Top Crypto Exchanges 2025 – LiveChainNews</title>
        <meta name="description" content="Compare the best crypto exchanges by volume, coins listed, fees and security. Find the right exchange for you." />
        <link rel="canonical" href="https://livechainnews.com/trending" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Top Crypto Exchanges</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 15 }}>
          Compare the best centralized and decentralized exchanges by volume, coins and reputation.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222', color: '#888', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>#</th>
                <th style={{ padding: '10px 12px' }}>Exchange</th>
                <th style={{ padding: '10px 12px' }}>Type</th>
                <th style={{ padding: '10px 12px' }}>Volume 24h</th>
                <th style={{ padding: '10px 12px' }}>Coins</th>
                <th style={{ padding: '10px 12px' }}>Founded</th>
                <th style={{ padding: '10px 12px' }}>Rating</th>
                <th style={{ padding: '10px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {EXCHANGES.map((ex) => (
                <tr key={ex.rank} style={{ borderBottom: '1px solid #1a1a1a' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0a0a0a'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 12px', color: '#888' }}>{ex.rank}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{ex.name}</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{ex.description}</div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      background: ex.type === 'DEX' ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.05)',
                      color: ex.type === 'DEX' ? '#00e676' : '#aaa',
                    }}>{ex.type}</span>
                  </td>
                  <td style={{ padding: '14px 12px', color: '#fff', fontWeight: 500 }}>{ex.volume24h}</td>
                  <td style={{ padding: '14px 12px', color: '#aaa' }}>{ex.coins.toLocaleString()}</td>
                  <td style={{ padding: '14px 12px', color: '#aaa' }}>{ex.year}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ color: '#00e676', fontWeight: 600 }}>★ {ex.rating}</span>
                  </td>
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
        </div>

        <p style={{ color: '#555', fontSize: 12, marginTop: 24, textAlign: 'center' }}>
          Data updated manually. Volume figures are approximate 24h averages. Always do your own research before using any exchange.
        </p>
      </main>
      <Footer />
    </>
  );
}