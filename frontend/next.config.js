/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ["pages", "templates", "components", "lib"],
  },
};

module.exports = nextConfig;
