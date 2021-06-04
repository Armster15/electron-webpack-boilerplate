const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const babel = require("@babel/core");

module.exports = {
  target: "web",
  entry: path.resolve(__dirname, "../src/renderer/index.tsx"),
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
            loader: "css-loader",
          },
        ],
      },
      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]__[hash:base64:5]",
              },
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.global\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /^((?!\.global).)*\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]__[hash:base64:5]",
              },
              importLoaders: 1,
            },
          },
          "sass-loader",
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
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        // Convert TypeScript to JavaScript
        {
          from: path.resolve(__dirname, "../src/main"),
          to({ context, absoluteFilename }) {
            return path.resolve(
              __dirname,
              "../dist/main/",
              path.relative(context, path.dirname(absoluteFilename)), // Preserves all the nested directories the file is in
              "[name].js"
            );
          },
          transform: {
            transformer: (content, absoluteFrom) =>
              babel.transform(content, {
                filename: path.basename(absoluteFrom),
                comments: false,
                presets: ["@babel/preset-typescript"],
              }).code,
            cache: true,
          },
          globOptions: {
            ignore: ["**/!(*.ts)", "**/*.d.ts"],
          },
          noErrorOnMissing: true,
        },
        // Files that aren't TypeScript just copy them to /dist/main
        {
          from: path.resolve(__dirname, "../src/main"),
          to: path.resolve(__dirname, "../dist/main"),
          globOptions: {
            ignore: ["**/*.ts", "**/*.d.ts"],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};
