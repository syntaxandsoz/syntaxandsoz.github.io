/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Agar Next.js <Image /> component use kar raha hai, toh yeh lazmi hai:
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;