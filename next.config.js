/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // worker_threads: false, // Removed this line as it might interfere with server build
    };
    // Ensure fallback object exists even if empty after removal
    config.resolve.fallback = config.resolve.fallback || {};
    return config;
  },
}

module.exports = nextConfig
