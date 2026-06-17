import Head from 'next/head';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact – LiveChainNews</title>
        <meta name="description" content="Get in touch with LiveChainNews for partnerships, press inquiries, or general questions." />
        <link rel="canonical" href="https://livechainnews.com/contact" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Contact Us</h1>
        <p style={{ color: '#888', fontSize: 15, marginBottom: 48, lineHeight: 1.7 }}>
          Have a question, a news tip, or want to work with us? Reach out through any of the channels below.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 48 }}>
          {[
            {
              icon: '✉️',
              title: 'General Inquiries',
              value: 'contact@livechainnews.com',
              href: 'mailto:contact@livechainnews.com',
            },
            {
              icon: '📢',
              title: 'Advertise / Partnerships',
              value: 'advertise@livechainnews.com',
              href: 'mailto:advertise@livechainnews.com',
            },
            {
              icon: '📰',
              title: 'News Tips',
              value: 'tips@livechainnews.com',
              href: 'mailto:tips@livechainnews.com',
            },
            {
              icon: '𝕏',
              title: 'X (Twitter)',
              value: '@livechainnews',
              href: 'https://x.com/livechainnews',
            },
            {
              icon: '✈️',
              title: 'Telegram',
              value: '@livechainnews',
              href: 'https://t.me/livechainnews',
            },
          ].map((item) => (
            <a key={item.title} href={item.href} target={item.href.startsWith('mailto') ? '_self' : '_blank'} rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#111',
                border: '1px solid #222',
                borderRadius: 12,
                padding: 24,
                transition: 'border-color 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#00e676'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#222'}
              >
                <div style={{ fontSize: 24, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontSize: 12, color: '#666', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: '#00e676', fontWeight: 600 }}>{item.value}</div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#fff' }}>Response Time</h2>
          <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.8 }}>
            We aim to respond to all inquiries within 48 hours. For urgent news tips or time-sensitive matters, please reach out via X or Telegram for a faster response.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}