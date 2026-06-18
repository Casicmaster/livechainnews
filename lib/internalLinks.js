// Internal linking map: keyword → target URL
// The first occurrence of each keyword in an article body becomes a link.
// Keep keywords specific to avoid wrong matches.
export const INTERNAL_LINKS = [
  { keyword: 'Bitcoin', url: '/news/what-is-bitcoin-beginners-guide' },
  { keyword: 'Ethereum', url: '/news/what-is-ethereum-beginners-guide' },
  { keyword: 'DeFi', url: '/news/what-is-defi-explained' },
  { keyword: 'crypto wallet', url: '/news/what-is-crypto-wallet-hot-cold' },
  { keyword: 'bull market', url: '/news/bull-market-vs-bear-market-crypto' },
  { keyword: 'bear market', url: '/news/bull-market-vs-bear-market-crypto' },
  { keyword: 'Hyperliquid', url: '/news/what-is-hyperliquid-defi-exchange' },
];