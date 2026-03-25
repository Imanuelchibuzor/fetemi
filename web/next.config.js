// eslint-disable-next-line
const path = require("path");

/** @type {import('next').NextConfig} */

module.exports = {
  outputFileTracingRoot: path.join(__dirname, "../"),
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};
