/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 🚨 CRITICAL: Do not bundle these server-only packages for the browser
      config.resolve.alias['firebase-admin'] = false;
      config.resolve.alias['@google-cloud/firestore'] = false;
    }
    return config;
  },
};

export default nextConfig;
