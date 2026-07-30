/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the native protection
  serverExternalPackages: ["firebase-admin", "@google-cloud/firestore"],

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups', 
          },
        ],
      },
    ];
  },

  // 🔨 THE ULTIMATE HAMMER: Force Webpack to ignore these packages
  webpack: (config, { isServer }) => {
    config.externals = [
      ...(config.externals || []),
      "firebase-admin",
      "@google-cloud/firestore",
    ];
    return config;
  },
};

export default nextConfig;
