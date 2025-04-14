/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        worker_threads: false,
        process: require.resolve('process/browser'),
      };
    }
    
    // Handle node: scheme
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false
          }
        }
      ]
    };

    // Fix for node: scheme
    config.plugins = config.plugins || [];
    config.plugins.push(
      new (require('webpack').DefinePlugin)({
        'process.env.NODE_DEBUG': JSON.stringify(''),
      })
    );

    return config;
  },
}

module.exports = nextConfig
