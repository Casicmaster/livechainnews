/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cryptopanic.com',
      'assets.coingecko.com',
      'coin-images.coingecko.com',
      's2.coinmarketcap.com',
      'cryptologos.cc',
    ],
  },
};

module.exports = nextConfig;
