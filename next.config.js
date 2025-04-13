/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Удаляем serverActions, так как они теперь стандартная функция в Next.js 14+
  },
  webpack: (config) => {
    config.resolve.fallback = config.resolve.fallback || {};
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logotic.me',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
