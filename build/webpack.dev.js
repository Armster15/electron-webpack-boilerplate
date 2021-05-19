const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const { merge } = require("webpack-merge");
const base = require("./webpack.common");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

module.exports = merge(base, {
  mode: "development",
  devtool: "source-map", // Show the source map so we can debug when developing locally
  output: {
    filename: "bundle.development.js",
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new CspHtmlWebpackPlugin({
      "base-uri": ["'self'"],
      "object-src": ["'none'"],
      "script-src": ["'self'"],
      "style-src": ["'self'"],
      "frame-src": ["'none'"],
      "worker-src": ["'none'"],
    }),
  ],
});
