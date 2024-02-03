/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;

//for react-md-editor
const removeImports = require("next-remove-imports")();
module.exports = removeImports({});
