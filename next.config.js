/** @type {import('next').NextConfig} */
const nextConfig = {
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
