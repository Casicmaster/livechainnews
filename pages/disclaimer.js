import Head from 'next/head';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer – LiveChainNews</title>
        <meta name="description" content="Disclaimer for LiveChainNews.com" />
        <link rel="canonical" href="https://livechainnews.com/disclaimer" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Disclaimer</h1>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 40, fontFamily: 'var(--font-mono)' }}>Last updated: June 2025</p>

        {[
          {
            title: 'Not Financial Advice',
            text: 'The content published on LiveChainNews.com is for informational and educational purposes only. Nothing on this website should be construed as financial, investment, legal, or tax advice. Cryptocurrency investments carry a high level of risk and may not be suitable for all investors.'
          },
          {
            title: 'No Guarantee of Accuracy',
            text: 'While we make every effort to ensure the accuracy and timeliness of our content, LiveChainNews.com makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information provided.'
          },
          {
            title: 'Investment Risk',
            text: 'Cryptocurrencies are highly volatile assets. Past performance is not indicative of future results. You should never invest more than you can afford to lose. Always conduct thorough research and seek independent financial advice before making any investment decisions.'
          },
          {
            title: 'Third-Party Content',
            text: 'LiveChainNews.com may feature content, analysis, or opinions from third-party contributors. These views are their own and do not necessarily reflect the views of LiveChainNews. We are not responsible for any third-party content published on our platform.'
          },
          {
            title: 'Affiliate Links',
            text: 'Some links on LiveChainNews.com may be affiliate links. This means we may earn a commission if you click through and make a purchase or sign up. This does not influence our editorial content or recommendations. We only link to services we believe may be of value to our readers.'
          },
          {
            title: 'Price Data',
            text: 'Cryptocurrency price data displayed on this site is sourced from third-party providers and may be delayed, inaccurate, or incomplete. Do not rely solely on price data from this site for trading decisions.'
          },
          {
            title: 'Limitation of Liability',
            text: 'LiveChainNews.com and its operators shall not be held liable for any losses, damages, or missed opportunities resulting from the use of information on this website. Use of this site is entirely at your own risk.'
          },
          {
            title: 'Contact',
            text: 'If you have any questions about this Disclaimer, please contact us at contact@livechainnews.com.'
          },
        ].map((s) => (
          <section key={s.title} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#fff' }}>{s.title}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#aaa' }}>{s.text}</p>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}