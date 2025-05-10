const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://95.163.152.102:3000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://95.163.152.102:3000/:path*',
      },
    ];
  },
};

module.exports = nextConfig;