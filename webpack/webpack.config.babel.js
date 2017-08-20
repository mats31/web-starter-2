import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const Config = {
  devtool: 'inline-source-map',
  entry: './src/main.js',
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle.js',
  },
  resolve: {
    root: path.resolve( __dirname, 'src' ),
    extensions: [
      '',
      '.js',
      '.vue',
      '.json',
      '.styl',
    ],
  },
  module: {
    postLoaders: [
      {
        test: /\.js$/,
        loader: 'ify',
      },
    ],
    loaders: [
      {
        test: /\.html$/,
        loader: 'html',
      },
      {
        test: /node_modules/,
        loader: 'ify',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              // url: false // @TODO - CW - we don't want this
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [require('autoprefixer')];
              }
            }
          },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.(glsl|frag|vert)$/,
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
      template: 'src/template/index.tpl.html',
    }),
    new CopyWebpackPlugin([
      { from: 'static' },
    ]),
  ],
};

module.exports = Config;
