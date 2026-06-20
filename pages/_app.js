import '../styles/globals.css';
import Head from 'next/head';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import BackToTop from '../components/BackToTop';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-grotesk',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono-next',
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${spaceGrotesk.variable} ${spaceMono.variable}`} style={{ display: 'contents' }}>
        <Component {...pageProps} />
        <BackToTop />
      </main>
    </>
  );
}