/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Experimental features configuration
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  // Remote images configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
};

export default nextConfig;
