/* ─────────────────────────────────────────────────────────────────────────
   WARNING: styled-jsx with TWO template-literal `<style jsx>` blocks in the
   same component file causes a Next.js SWC compile failure with an
   unhelpful generic message: `./pages/.../foo.js  Error: failed to process`.

   It surfaces specifically when one of the two blocks uses dynamic
   interpolation (e.g. `${someVar}` inside the template literal). Both blocks
   parse individually, ESLint passes, `node --check` passes — only
   `next build` fails, with no line number.

   ALWAYS use ONE `<style jsx>` block per component. Consolidate keyframes,
   :global() selectors, hover rules, and animations into that single block.
   See pages/venues/index.js for the canonical pattern.
   ───────────────────────────────────────────────────────────────────────── */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Add 301 redirects for old or broken URLs. Example:
      // { source: '/old-path', destination: '/new-path', permanent: true },
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