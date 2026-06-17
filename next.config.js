/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  typescript: {
    // We handle type checking separately
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
