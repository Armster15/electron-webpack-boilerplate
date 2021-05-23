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
      // loads .css files
      {
        test: /\.global\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
        include: [
          path.resolve(__dirname, "../src/renderer"),
          path.resolve(__dirname, "../node_modules/"),
        ],
      },
      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
              sourceMap: true,
              importLoaders: 1,
            },
          },
        ],
        include: [
          path.resolve(__dirname, "../src/renderer"),
          path.resolve(__dirname, "../node_modules/"),
        ],
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
          from: path.resolve(__dirname, "../src/main").split(path.sep).join(path.posix.sep),
          to({ context, absoluteFilename }) {
            return path.resolve(__dirname, "../dist/main/", path.relative(context, path.dirname(absoluteFilename)), "[name].js")
          },
          transform: {
            transformer(content, absoluteFrom) {
              return babel.transform(content, {
                filename: path.basename(absoluteFrom), // path.basename gets just the filename, remove all the path stuff
                comments: false,
                presets: ["@babel/preset-typescript"]
              }).code  
            },
            cache: true
          },
          globOptions: {
            ignore: ["**/!(*.ts)"]
          },
          noErrorOnMissing: true,
        },
        // Files that aren't TypeScript just copy them to /dist/main
        {
          from: path.resolve(__dirname, "../src/main").split(path.sep).join(path.posix.sep),
          to: path.resolve(__dirname, "../dist/main"),
          globOptions: {
            ignore: ["**/*.ts"]
          },
          noErrorOnMissing: true
        },
      ]
    })
  ],
};
