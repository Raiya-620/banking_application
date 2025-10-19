const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Ensure Turbopack chooses the frontend folder as the root when running from the workspace
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;
