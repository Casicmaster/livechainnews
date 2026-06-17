import Head from 'next/head';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy – LiveChainNews</title>
        <meta name="description" content="Privacy Policy for LiveChainNews.com" />
        <link rel="canonical" href="https://livechainnews.com/privacy" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 40, fontFamily: 'var(--font-mono)' }}>Last updated: June 2025</p>

        {[
          {
            title: '1. Information We Collect',
            text: 'We collect information you provide directly to us, such as your email address when you subscribe to our newsletter. We also collect usage data automatically, including your IP address, browser type, pages visited, and time spent on our site through standard server logs and analytics tools.'
          },
          {
            title: '2. How We Use Your Information',
            text: 'We use the information we collect to send you our newsletter (if subscribed), improve our content and services, analyze site traffic and usage patterns, and comply with legal obligations. We do not sell your personal information to third parties.'
          },
          {
            title: '3. Cookies',
            text: 'LiveChainNews uses cookies and similar tracking technologies to enhance your browsing experience. These include essential cookies for site functionality and analytics cookies to understand how visitors use our site. You can control cookie settings through your browser preferences.'
          },
          {
            title: '4. Third-Party Services',
            text: 'We use third-party services including Google Analytics for traffic analysis and CoinGecko for cryptocurrency price data. These services may collect data according to their own privacy policies. We are not responsible for the privacy practices of these third parties.'
          },
          {
            title: '5. Data Retention',
            text: 'We retain your email address for as long as you are subscribed to our newsletter. You may unsubscribe at any time by clicking the unsubscribe link in any email we send. Upon unsubscription, your data will be removed from our mailing list within 30 days.'
          },
          {
            title: '6. Your Rights',
            text: 'Depending on your location, you may have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at contact@livechainnews.com. We will respond to your request within 30 days.'
          },
          {
            title: '7. Security',
            text: 'We take reasonable measures to protect your information from unauthorized access, loss, or misuse. However, no internet transmission is completely secure, and we cannot guarantee absolute security.'
          },
          {
            title: '8. Changes to This Policy',
            text: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. Continued use of our site after changes constitutes acceptance of the new policy.'
          },
          {
            title: '9. Contact',
            text: 'If you have any questions about this Privacy Policy, please contact us at contact@livechainnews.com.'
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