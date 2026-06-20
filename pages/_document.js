import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://api.coingecko.com" />
        <link rel="preconnect" href="https://googbmkxhsbjrscyfnzk.supabase.co" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="alternate" type="application/rss+xml" title="LiveChainNews RSS Feed" href="https://livechainnews.com/rss.xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
