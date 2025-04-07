/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // serverActions: true, // Corrected: should be an object or removed if not needed
    serverActions: {}, // Use an empty object if server actions are used
  },
  // Removed invalid 'api' key
  // Removed 'headers' key, CORS should be handled differently if needed
  webpack: (config) => {
    config.resolve.fallback = config.resolve.fallback || {};
    return config;
  }
}

module.exports = nextConfig
