import Head from 'next/head';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms & Conditions – LiveChainNews</title>
        <meta name="description" content="Terms and Conditions for LiveChainNews.com" />
        <link rel="canonical" href="https://livechainnews.com/terms" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Terms & Conditions</h1>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 40, fontFamily: 'var(--font-mono)' }}>Last updated: June 2025</p>

        {[
          {
            title: '1. Acceptance of Terms',
            text: 'By accessing and using LiveChainNews.com, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.'
          },
          {
            title: '2. Use of Content',
            text: 'All content published on LiveChainNews.com, including articles, analysis, prices, and graphics, is for informational purposes only. You may not reproduce, distribute, or republish our content without prior written permission. Brief excerpts may be shared with proper attribution and a link back to the original article.'
          },
          {
            title: '3. No Financial Advice',
            text: 'Nothing on LiveChainNews.com constitutes financial, investment, legal, or tax advice. Cryptocurrency markets are highly volatile and speculative. Always conduct your own research and consult a qualified financial advisor before making any investment decisions. We are not responsible for any financial losses incurred as a result of information on this site.'
          },
          {
            title: '4. Accuracy of Information',
            text: 'We strive to provide accurate and up-to-date information, but we make no warranties or representations regarding the completeness, accuracy, or reliability of any content on this site. Price data is provided by third-party APIs and may be delayed or inaccurate.'
          },
          {
            title: '5. Third-Party Links',
            text: 'Our website may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.'
          },
          {
            title: '6. User Conduct',
            text: 'You agree not to use LiveChainNews.com for any unlawful purpose, to distribute spam or malware, to attempt to gain unauthorized access to our systems, or to engage in any conduct that restricts or inhibits anyone\'s use or enjoyment of the site.'
          },
          {
            title: '7. Intellectual Property',
            text: 'All content, trademarks, logos, and intellectual property on LiveChainNews.com are owned by or licensed to us. Unauthorized use of our intellectual property is strictly prohibited.'
          },
          {
            title: '8. Limitation of Liability',
            text: 'To the fullest extent permitted by law, LiveChainNews.com shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of, or inability to use, this website or its content.'
          },
          {
            title: '9. Changes to Terms',
            text: 'We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the site following any changes constitutes your acceptance of the new terms.'
          },
          {
            title: '10. Contact',
            text: 'For any questions regarding these Terms and Conditions, please contact us at contact@livechainnews.com.'
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