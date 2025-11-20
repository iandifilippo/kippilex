/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'wdtggkomstoptrgcekyo.supabase.co',   // para tus PDFs y posibles avatars futuros
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;