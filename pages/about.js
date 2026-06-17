import Head from 'next/head';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Head>
        <title>About – LiveChainNews</title>
        <meta name="description" content="Learn more about LiveChainNews — your real-time source for crypto news, market analysis and blockchain insights." />
        <link rel="canonical" href="https://livechainnews.com/about" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>About LiveChainNews</h1>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 40, fontFamily: 'var(--font-mono)' }}>Built for the global crypto community</p>

        <section style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: '#aaa', marginBottom: 20 }}>
            LiveChainNews is an independent crypto media platform dedicated to delivering real-time news, market analysis, and educational content to the global blockchain community.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: '#aaa', marginBottom: 20 }}>
            We cover everything from Bitcoin and Ethereum to DeFi, NFTs, regulation, and emerging altcoins — keeping traders, investors, and enthusiasts informed 24/7.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: '#aaa' }}>
            Our mission is simple: cut through the noise and deliver what matters. No hype, no paid promotion disguised as news — just clear, accurate, and timely reporting.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: '#fff' }}>What We Cover</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: '📰', label: 'Breaking News', desc: 'Real-time coverage of the most important events in crypto.' },
              { icon: '📊', label: 'Market Analysis', desc: 'In-depth chart breakdowns and market insights.' },
              { icon: '📚', label: 'Learn Crypto', desc: 'Beginner-friendly guides to navigate the crypto world.' },
              { icon: '💱', label: 'Prices & Data', desc: 'Live prices for top 100 cryptocurrencies.' },
              { icon: '🏦', label: 'Top Exchanges', desc: 'Compare the best crypto exchanges by volume and trust.' },
              { icon: '✍️', label: 'Blog & Opinion', desc: 'Editorial takes and opinions on the crypto industry.' },
            ].map((item) => (
              <div key={item.label} style={{
                background: '#111',
                border: '1px solid #222',
                borderRadius: 12,
                padding: 20,
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#fff' }}>Our Values</h2>
          {[
            { title: 'Independence', text: 'We are editorially independent. Our content is not influenced by advertisers or sponsors.' },
            { title: 'Accuracy', text: 'We verify information before publishing and correct errors transparently when they occur.' },
            { title: 'Transparency', text: 'We clearly label sponsored content, affiliate links, and opinion pieces.' },
            { title: 'Community First', text: 'We exist to serve our readers — not to pump tokens or push agendas.' },
          ].map((v) => (
            <div key={v.title} style={{ marginBottom: 20, paddingLeft: 16, borderLeft: '2px solid #00e676' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{v.title}</div>
              <div style={{ fontSize: 15, color: '#aaa', lineHeight: 1.7 }}>{v.text}</div>
            </div>
          ))}
        </section>

        <section style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 28, textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#fff' }}>Want to work with us?</h2>
          <p style={{ color: '#888', fontSize: 15, marginBottom: 20 }}>We are open to partnerships, sponsored content, and exchange listings.</p>
          <a href="/contact" style={{
            display: 'inline-block',
            padding: '10px 28px',
            background: '#00e676',
            color: '#000',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
          }}>Get in touch →</a>
        </section>
      </main>
      <Footer />
    </>
  );
}