/**
 * @type {import('next').NextConfig}
 */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  distDir: '.next',    
  reactStrictMode: true,
  experimental: {
  },
  async redirects() {
    return [
      {
        source: "/architecture",
        destination: isProd
          ? "https://web.ambitiousgrass-e50277e8.westeurope.azurecontainerapps.io"
          : "https://web.ambitiousgrass-e50277e8.westeurope.azurecontainerapps.io",
        permanent: false, // set to true if this will never change
      },
    ]
  },
};

module.exports = nextConfig;


