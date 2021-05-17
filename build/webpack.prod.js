const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { merge } = require("webpack-merge");
const base = require("./webpack.common");

module.exports = merge(base, {
  mode: "production",
  devtool: false,
  output: {
    filename: 'bundle.production.js'
  },
  plugins: [
    // You can paste your CSP in this website https://csp-evaluator.withgoogle.com/
    // for it to give you suggestions on how strong your CSP is
    new CspHtmlWebpackPlugin(
      {
        "base-uri": ["'self'"],
        "object-src": ["'none'"],
        "script-src": ["'self'"],
        "style-src": ["'self'"],
        "frame-src": ["'none'"],
        "worker-src": ["'none'"]
      },
      {
        hashEnabled: {
          "style-src": false
        }
      }
    )
  ],
  optimization: {
    minimize: true,
    minimizer: [
      "...", // This adds default minimizers to webpack. For JS, Terser is used. // https://webpack.js.org/configuration/optimization/#optimizationminimizer
      new CssMinimizerPlugin()
    ]
  }
});
