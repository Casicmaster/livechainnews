// ── PRICE FORMATTING ──
export function fmtPrice(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1000) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (n >= 1)    return '$' + n.toFixed(2);
  if (n >= 0.01) return '$' + n.toFixed(4);
  return '$' + n.toFixed(6);
}

export function fmtPct(n) {
  if (n === null || n === undefined) return { text: '—', cls: '' };
  const text = (n >= 0 ? '+' : '') + n.toFixed(2) + '%';
  return { text, cls: n >= 0 ? 'pos' : 'neg' };
}

export function fmtLargeNum(n) {
  if (!n) return '—';
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2) + 'M';
  return '$' + n.toLocaleString();
}

// ── TIME ──
export function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

// ── NEWS TAG DETECTION ──
export function guessTag(title = '', currencies = []) {
  const t = title.toLowerCase();
  if (currencies?.some(c => ['BTC', 'XBT'].includes(c.code)))
    return { label: 'Bitcoin', cls: 'tag-btc' };
  if (currencies?.some(c => c.code === 'ETH'))
    return { label: 'Ethereum', cls: 'tag-eth' };
  if (t.includes('defi') || t.includes('protocol') || t.includes('liquidity') || t.includes('yield'))
    return { label: 'DeFi', cls: 'tag-defi' };
  if (t.includes('nft') || t.includes('collectible') || t.includes('opensea'))
    return { label: 'NFT', cls: 'tag-nft' };
  if (t.includes('sec') || t.includes('regulat') || t.includes('legal') || t.includes('govern') || t.includes('ban'))
    return { label: 'Regulation', cls: 'tag-regulation' };
  if (t.includes('market') || t.includes('price') || t.includes('rally') || t.includes('bull') || t.includes('bear'))
    return { label: 'Market', cls: 'tag-market' };
  if (t.includes('analys') || t.includes('outlook') || t.includes('report') || t.includes('forecast'))
    return { label: 'Analysis', cls: 'tag-analysis' };
  return { label: 'Crypto', cls: 'tag-altcoin' };
}

// ── TOKEN METADATA ──
export const TOKEN_META = {
  BTC:   { icon: '₿',  bg: '#1a1200', color: '#f7931a' },
  ETH:   { icon: 'Ξ',  bg: '#0e0e2c', color: '#627eea' },
  BNB:   { icon: 'B',  bg: '#1a1400', color: '#f3ba2f' },
  SOL:   { icon: '◎',  bg: '#0d1a1a', color: '#9945ff' },
  XRP:   { icon: '✕',  bg: '#001a1a', color: '#00aae4' },
  ADA:   { icon: '₳',  bg: '#001020', color: '#0033ad' },
  AVAX:  { icon: '▲',  bg: '#1a0000', color: '#e84142' },
  DOGE:  { icon: 'Ð',  bg: '#1a1200', color: '#c2a633' },
  DOT:   { icon: '●',  bg: '#1a0010', color: '#e6007a' },
  LINK:  { icon: '⬡',  bg: '#00001a', color: '#2a5ada' },
  MATIC: { icon: 'M',  bg: '#0a0020', color: '#8247e5' },
  UNI:   { icon: '🦄', bg: '#1a0018', color: '#ff007a' },
  ATOM:  { icon: '⚛',  bg: '#100020', color: '#6f4cff' },
  LTC:   { icon: 'Ł',  bg: '#0a0a0a', color: '#bfbbbb' },
  NEAR:  { icon: 'N',  bg: '#001000', color: '#00ec97' },
  SUI:   { icon: 'S',  bg: '#001020', color: '#4da2ff' },
  ARB:   { icon: 'A',  bg: '#00101a', color: '#28a0f0' },
  OP:    { icon: 'O',  bg: '#1a0000', color: '#ff0420' },
  INJ:   { icon: 'I',  bg: '#00101a', color: '#00b2ff' },
};

export function getTokenMeta(sym) {
  return TOKEN_META[sym?.toUpperCase()] || {
    icon: (sym || '?')[0].toUpperCase(),
    bg: '#1a1a2e',
    color: '#00e676',
  };
}

// ── FALLBACK NEWS (when API is unavailable) ──
export const FALLBACK_NEWS = [
  { id: 1, title: 'Bitcoin Surges Past Key Resistance as Institutional Demand Accelerates', published_at: new Date(Date.now() - 1800000).toISOString(), source: 'CoinDesk', url: '#', currencies: [{ code: 'BTC' }] },
  { id: 2, title: 'Ethereum Layer-2 Solutions Hit Record Transaction Volume Amid Network Growth', published_at: new Date(Date.now() - 3600000).toISOString(), source: 'The Block', url: '#', currencies: [{ code: 'ETH' }] },
  { id: 3, title: 'DeFi Total Value Locked Climbs to Multi-Month High as New Protocols Launch', published_at: new Date(Date.now() - 5400000).toISOString(), source: 'DeFi Pulse', url: '#', currencies: [] },
  { id: 4, title: 'SEC Crypto Task Force Meets With Industry Leaders to Discuss New Framework', published_at: new Date(Date.now() - 7200000).toISOString(), source: 'Reuters', url: '#', currencies: [] },
  { id: 5, title: 'Solana Ecosystem Sees Surge in Developer Activity, New Projects Launch Weekly', published_at: new Date(Date.now() - 10800000).toISOString(), source: 'Decrypt', url: '#', currencies: [] },
  { id: 6, title: 'NFT Market Shows Signs of Recovery as Blue-Chip Collections Gain Momentum', published_at: new Date(Date.now() - 14400000).toISOString(), source: 'NFT Now', url: '#', currencies: [] },
  { id: 7, title: 'Binance Announces Expansion Plans and New Market-Making Partnerships', published_at: new Date(Date.now() - 18000000).toISOString(), source: 'CoinTelegraph', url: '#', currencies: [{ code: 'BNB' }] },
  { id: 8, title: 'Cross-Chain Bridges Process Record Volume as Multi-Chain Strategies Grow', published_at: new Date(Date.now() - 21600000).toISOString(), source: 'The Defiant', url: '#', currencies: [] },
  { id: 9, title: 'Central Banks Worldwide Accelerate CBDC Pilot Programs Into 2025', published_at: new Date(Date.now() - 25200000).toISOString(), source: 'Bloomberg Crypto', url: '#', currencies: [] },
];

export const NEWS_EMOJIS = ['🔗','📈','⚡','🌐','🔐','💎','🚀','📊','🔮','⛓','🏦','🎯'];

// Safely extract a source name whether it's a string or an object { title }
export function sourceName(source) {
  if (!source) return 'LiveChainNews';
  if (typeof source === 'string') return source;
  if (typeof source === 'object' && source.title) return source.title;
  return 'LiveChainNews';
}

// Reading time estimator
export function readingTime(text) {
  if (!text) return '1 min read';
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}