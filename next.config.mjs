/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Frame-Options",          value: "DENY" },
  { key: "X-Content-Type-Options",   value: "nosniff" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control",   value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig = {
  compress: true,
  images: {
    formats: ["image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Tell webpack to treat node:sqlite as an external (native built-in).
      // Without this, builds on Vercel may warn about the node: protocol module.
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
        ({ request }, callback) => {
          if (request === "node:sqlite") return callback(null, "commonjs node:sqlite");
          callback();
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
