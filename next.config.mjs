/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''; // e.g. iron-island-mech-squad
const basePath = isProd && repoName ? `/${repoName}` : '';

const nextConfig = {
  // Use static export for GitHub Pages
  output: 'export',

  // Needed if deploying to a repo page (not user/organization root)
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',

  images: {
    unoptimized: true, // needed for export
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.abacus.ai' }]
  },

  trailingSlash: true // helps with static hosting on Pages
};

export default nextConfig;