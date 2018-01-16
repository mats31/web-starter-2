import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export default {
  entry: './src/main.js',
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
    loaders: [
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
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'syntax-dynamic-import',
                'transform-decorators-legacy',
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer],
              },
            },
            { loader: 'sass-loader' },
          ],
        }),
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
      filename: 'index.html',
      inject: 'body',
      template: 'src/template/index.html',
    }),
    new webpack.ProvidePlugin({
      THREE: 'three',
    }),
    new CopyWebpackPlugin([
      { from: 'static' },
    ],
    { ignore: ['.DS_Store', '.keep'] }),
    new ExtractTextPlugin('[name]-[hash].min.css', { allChunks: true }),
    new CleanWebpackPlugin(['build'], { root: `${__dirname}` }),
  ],
};
