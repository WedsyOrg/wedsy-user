/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Add 301 redirects for old or broken URLs. Example:
      // { source: '/old-path', destination: '/new-path', permanent: true },
      { source: '/decor', destination: '/coming-soon', permanent: false },
      { source: '/wedding-store', destination: '/coming-soon', permanent: false },
    ];
  },
  images: {
    domains: [
      "wedsy.s3.amazonaws.com",
      "wedsy.s3.ap-south-1.amazonaws.com",
      "wedsy-images-prod.s3.amazonaws.com",
      "wedsy-images-prod.s3.ap-south-1.amazonaws.com"
    ],
  },
  async rewrites() {
    return [
      {
        source: '/blogs/:path*',
        destination: 'https://hub.wedsy.in/:path*',
      },
      {
        source: '/hub/:path*',
        destination: 'https://hub.wedsy.in/:path*',
      },
    ]
  },
};

module.exports = nextConfig;