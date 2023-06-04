/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        protocol: "https",
        hostname: "t.scdn.co",
      },
      {
        protocol: "https",
        hostname: "thisis-images.scdn.co",
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
      },
      {
        protocol: "https",
        hostname: "charts-images.scdn.co",
      },
      {
        protocol: "https",
        hostname: "seeded-session-images.scdn.co",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },

      // {
      //   protocol: "https",
      //   hostname: "**",
      // },
    ],
  },
};

module.exports = nextConfig;
