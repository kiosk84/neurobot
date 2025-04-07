/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Увеличиваем лимит размера тела запроса для API роутов
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  },
  // Настройки для работы с внешними API
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ]
      }
    ]
  },
  webpack: (config) => {
    config.resolve.fallback = config.resolve.fallback || {};
    return config;
  }
}

module.exports = nextConfig
