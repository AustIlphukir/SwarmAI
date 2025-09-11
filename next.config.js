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
        // destination: "https://d1rmg6jcg0tsw.cloudfront.net/viewer/3060a252-e667-48f3-ad33-d4d3fb06ce1a",
        permanent: false, // set to true if this will never change
      },
    ]
  },
};

module.exports = nextConfig;


