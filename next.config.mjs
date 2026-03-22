/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    formats: ["image/webp"],
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
