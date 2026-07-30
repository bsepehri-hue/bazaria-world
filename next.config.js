/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🛡️ The modern, native way to protect backend libraries from Webpack
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
};

export default nextConfig;
