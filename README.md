# LiveChainNews — Next.js Project

Crypto news, trending tokens & market intelligence site.
**Domain:** livechainnews.com

---

## 🚀 Quick Start (local)

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open http://localhost:3000
```

---

## 📁 Project Structure

```
livechainnews-nextjs/
├── pages/
│   ├── _app.js              # App wrapper (fonts, global CSS)
│   ├── index.js             # Homepage
│   ├── index.module.css     # Homepage styles
│   └── api/
│       ├── prices.js        # Live prices from CoinGecko
│       ├── trending.js      # Trending tokens from CoinGecko
│       ├── news.js          # News from CryptoPanic
│       └── feargreed.js     # Fear & Greed Index
├── components/
│   ├── Navbar.js / .module.css
│   ├── PriceTicker.js / .module.css
│   ├── TrendingWidget.js / .module.css
│   ├── FearGreedWidget.js / .module.css
│   ├── NewsCard.js / .module.css
│   └── Footer.js / .module.css
├── styles/
│   └── globals.css          # Design tokens + utilities
├── lib/
│   └── utils.js             # Formatters, helpers, fallback data
├── public/                  # favicon.ico, og-image.png etc.
├── package.json
└── next.config.js
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root:

```env
# Optional: CryptoPanic free API key
# Get one at https://cryptopanic.com/developers/api/
CRYPTOPANIC_KEY=your_key_here

# Optional: CoinGecko Pro key (for higher rate limits)
# COINGECKO_KEY=your_key_here
```

---

## ☁️ Deploy to Vercel (free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set your domain
# 1. Go to vercel.com → your project → Settings → Domains
# 2. Add: livechainnews.com
# 3. Add the DNS records shown to your domain registrar
```

Or connect your GitHub repo directly at vercel.com/new for auto-deploys.

---

## 📄 Pages to build next

| Page | Route | Status |
|------|-------|--------|
| Homepage | `/` | ✅ Done |
| News list | `/news` | 🔜 Next |
| News article | `/news/[slug]` | 🔜 Next |
| Prices | `/prices` | 🔜 Next |
| Trending | `/trending` | 🔜 Next |
| Blog | `/blog` | 🔜 Planned |
| Advertise | `/advertise` | 🔜 Planned |

---

## 🎨 Design Tokens

| Token | Value |
|-------|-------|
| Background | `#090c10` |
| Surface | `#0d1117` |
| Neon accent | `#00e676` |
| Text primary | `#e6edf3` |
| Text secondary | `#8b949e` |
| Font display | Space Grotesk |
| Font mono | Space Mono |

---

## 📡 Data Sources (all free)

| Data | Source | Refresh |
|------|--------|---------|
| Prices | CoinGecko `/simple/price` | 30s |
| Trending | CoinGecko `/search/trending` | 2min |
| News | CryptoPanic `/posts` | 3min |
| Fear & Greed | alternative.me/fng | 1h |

---

Built with Next.js 14, React 18, SWR for data fetching.
