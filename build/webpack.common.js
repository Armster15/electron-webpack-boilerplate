const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const babel = require("@babel/core");

module.exports = {
  target: "web",
  entry: path.resolve(__dirname, "../src/renderer/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist/renderer"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: path.resolve(__dirname, "../src/renderer"),
        loader: "babel-loader",
        resolve: {
          // Extensions that should be used to resolve modules
          extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
        },
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "../src/renderer"),
          path.resolve(__dirname, "../node_modules/"),
        ],
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        resolve: {
          extensions: [".css"],
        },
      },
      // loads common image formats
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: "url-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/renderer/index.html"),
      filename: "index.html",
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        // Convert TypeScript to JavaScript
        {
          from: path.resolve(__dirname, "../src/main/**/*.ts").split(path.sep).join(path.posix.sep),
          to: path.resolve(__dirname, "../dist/main/[name].js"),
          transform(content, absoluteFrom) {
            return babel.transform(content, {
              filename: path.basename(absoluteFrom), // path.basename gets just the filename, remove all the path stuff
              comments: false,
              presets: ["@babel/preset-typescript"]
            }).code
          },
          noErrorOnMissing: true
        },
        // Files that aren't TypeScript just copy them to /dist/main
        {
          from: path.resolve(__dirname, "../src/main/**/!(*.ts)").split(path.sep).join(path.posix.sep),
          to: path.resolve(__dirname, "../dist/main/[name][ext]"),
          noErrorOnMissing: true
        },
      ]
    })
  ],
};
