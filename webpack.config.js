// Base variables
const path = require('path');
const webpack = require('webpack');

// Importing plugins that do not come by default in webpack
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const src = path.resolve(__dirname, 'src/');
// Module settings
module.exports = {
  resolve: {
    alias: {
      '@': src,
    },
  },
  entry: {
    // JS and scss entry points for main/index page
    index: [
      './src/js/main.js', // Javascript entry point
      './src/scss/main.scss', // scss entry point
    ],
  },
  // Path for bundled files
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'js/[name]-[contenthash:4].js',
    filename: 'js/[name]-[contenthash:4].js',
  },
  // enable source maps
  devtool: 'source-map',

  // directory for starting webpack dev server
  devServer: {
    contentBase: './',
  },

  // optimization configuration
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCssAssetsPlugin({}),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader', // configuration in postcss.config.js
            options: {
              sourceMap: true,
            },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href', ':data-src'],
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.(png|gif|jpe?g|ico|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /img/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              //  publicPath: '../', // fonts folder is outside scss/css folder, thats why we need to go one folder up.
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
        exclude: path.resolve(__dirname, 'src/index.html'),
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:4].css',
      chunkFilename: 'css/[id]-[contenthash:4].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
    new CleanWebpackPlugin(['dist']),
  ],
};
