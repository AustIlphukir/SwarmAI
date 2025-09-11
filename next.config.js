/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
  },
  async redirects() {
    return [
      {
        source: "/architecture",
        destination: "http://localhost:8080",
        permanent: false, // set to true if this will never change
      },
    ]
  },
};

module.exports = nextConfig;