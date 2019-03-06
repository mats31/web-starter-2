const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const Config = {
  mode: 'production',
  entry: {
    desktop: './src/main.js',
    mobile: './src/mobile_main.js',
  },
  output: {
    path: path.join(__dirname, '..', 'build'),
    filename: '[name]-[hash].min.js',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '..', 'src'),
      path.resolve(__dirname, '..', 'node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tpl\.html$/,
        use: [
          {
            loader: 'underscore-template-loader',
            options: {
              attributes: [],
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: (modulePath) => {
          return /node_modules/.test(modulePath) && !/node_modules\/sono/.test(modulePath);
        },
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                "@babel/plugin-syntax-dynamic-import",
                "@babel/plugin-transform-runtime",
                ["@babel/plugin-proposal-decorators", { "legacy": true }]
              ],
            },
          },
        ],
      },
      {
        test: /\.json$/,
        use: [
          {
            loader: 'json-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer({
                browsers: [
                  'last 2 versions',
                  'iOS >= 8',
                  'Safari >= 8',
                ]
              })],
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(glsl|frag|vert|vs|fs)$/,
        loader: 'raw-loader!glslify-loader',
        exclude: /node_modules/,
      },
      {
        test: /animation.gsap\.js$/,
        loader: 'imports?define=>false',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.php',
      inject: false,
      template: 'src/template/index.php',
      chunks: ['desktop', 'mobile'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index_subdomain.php',
      inject: false,
      template: 'src/template/index_subdomain.php',
      chunks: ['desktop', 'mobile'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: 'src/template/index.html',
      chunks: ['desktop'],
    }),
    new webpack.ProvidePlugin({
      THREE: 'three',
    }),
    new CopyWebpackPlugin([
      { from: 'static' },
    ],
      { ignore: ['.DS_Store', '.keep'] }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name]-[hash].min.css',
      chunkFilename: "[id].css"
    }),
    new CleanWebpackPlugin(['build'], { root: path.resolve(__dirname, '..') }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
};

module.exports = Config;
