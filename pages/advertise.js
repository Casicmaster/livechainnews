import Head from 'next/head';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';

const PACKAGES = [
  {
    name: 'Basic',
    price: '$99',
    period: '/month',
    color: '#444',
    features: [
      'Listed in /listings directory',
      'Project logo + description',
      'Link to your website',
      'Category tag',
    ],
  },
  {
    name: 'Pro',
    price: '$299',
    period: '/month',
    color: '#00e676',
    featured: true,
    features: [
      'Everything in Basic',
      'Featured badge',
      'Top placement in listings',
      'Mention in weekly newsletter',
      '1 sponsored article',
    ],
  },
  {
    name: 'Premium',
    price: '$599',
    period: '/month',
    color: '#00b0ff',
    features: [
      'Everything in Pro',
      'Homepage banner placement',
      '2 sponsored articles/month',
      'Social media mention (X + Telegram)',
      'Priority support',
    ],
  },
];

export default function Advertise() {
  return (
    <>
      <Head>
        <title>Advertise & List Your Project – LiveChainNews</title>
        <meta name="description" content="List your crypto project on LiveChainNews and reach thousands of crypto investors and enthusiasts daily." />
        <link rel="canonical" href="https://livechainnews.com/advertise" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 20, fontSize: 12, color: '#00e676', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
            🚀 GROW YOUR PROJECT
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.03em' }}>
            Reach the Crypto Community
          </h1>
          <p style={{ fontSize: 17, color: '#888', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
            LiveChainNews connects your project with thousands of crypto investors, traders, and enthusiasts every day. Get listed, get noticed.
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['10K+', 'Monthly Readers'], ['24/7', 'Live Coverage'], ['Global', 'Audience']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#00e676' }}>{val}</div>
                <div style={{ fontSize: 13, color: '#666' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Packages */}
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>Choose Your Package</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 64 }}>
          {PACKAGES.map((pkg) => (
            <div key={pkg.name} style={{
              background: '#111',
              border: `1px solid ${pkg.featured ? '#00e676' : '#222'}`,
              borderRadius: 16,
              padding: 28,
              position: 'relative',
            }}>
              {pkg.featured && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#00e676', color: '#000', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: pkg.color, marginBottom: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{pkg.name}</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{pkg.price}<span style={{ fontSize: 14, color: '#666', fontWeight: 400 }}>{pkg.period}</span></div>
              <div style={{ borderTop: '1px solid #222', margin: '20px 0' }} />
              <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                {pkg.features.map((f) => (
                  <li key={f} style={{ fontSize: 14, color: '#aaa', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: '#00e676', marginTop: 1 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href={`mailto:advertise@livechainnews.com?subject=${pkg.name} Package Inquiry`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px 0',
                  background: pkg.featured ? '#00e676' : 'transparent',
                  color: pkg.featured ? '#000' : '#00e676',
                  border: `1px solid ${pkg.featured ? '#00e676' : '#333'}`,
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                }}>
                Get Started →
              </a>
            </div>
          ))}
        </div>

        {/*