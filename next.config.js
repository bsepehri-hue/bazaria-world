/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🛡️ THE FIX: Force Next.js to run these native Node libraries strictly on the server
  serverExternalPackages: ["firebase-admin", "@google-cloud/firestore"],

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  // 🟢 ADDED: Allows Next.js to optimize images directly from Firebase Storage into .webp
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  
  // 🔓 THE FIX: Allow Firebase Auth popups to communicate back to the main window
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

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 🚨 CRITICAL: Do not bundle these server-only packages for the browser
      config.resolve.alias['firebase-admin'] = false;
      config.resolve.alias['@google-cloud/firestore'] = false;
    }
    return config;
  },
};

// 👇 CRITICAL FIX: Reverted back to ES Module syntax to match your package.json!
export default nextConfig;
