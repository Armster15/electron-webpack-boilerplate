const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  target: "web",
  entry: path.resolve(__dirname, "../src/renderer/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist/renderer"),
  },
  module: {
    rules: [
      // loads .js/jsx files
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "../src/renderer"),
        loader: "babel-loader",
        resolve: {
          extensions: [".js", ".jsx", ".json"]
        }
      },
      // loads .css files
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "../src/renderer"),
          path.resolve(__dirname, "../node_modules/"),
        ],
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ],
        resolve: {
          extensions: [".css"]
        }
      },
      // loads common image formats
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: "url-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/renderer/index.html"),
      filename: "index.html"
    }),
    new MiniCssExtractPlugin(),
    // new WebpackBar({
    //   reporter: {
    //     start() {
    //       console.clear();
    //     }
    //   }
    // }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../src/main/"),
          to: path.resolve(__dirname, "../dist/main/")
        }
      ]
    })
  ]
};