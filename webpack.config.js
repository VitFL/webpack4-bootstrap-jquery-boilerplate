// Base variables
var path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

// Module settings
module.exports = (env, argv) => ({
   entry: {
     //JS and scss entry points for our main/index page
    index: [
      './src/js/main.js', // Javascript entry point
      './src/scss/main.scss', // scss entry point
    ]
  },
  // Path for bundled files
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: "js/[name]-[contenthash:4].js",
    filename: "js/[name]-[contenthash:4].js"
  },
   // enable source maps
   devtool: argv.mode === 'development' ? 'eval' : 'source-map',

   // directory for starting webpack dev server
   devServer: {
       contentBase: './'
   },

    // optimizing configuration
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
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
        use:  [
         MiniCssExtractPlugin.loader,
         'css-loader',
         'sass-loader'
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href',':data-src'],
              minimize: true,
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|ico|svg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src',
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[path][name].[ext]',
                context: 'src',
                publicPath: '../'
            }
        }]
    },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            }
          }
        ],
        exclude: path.resolve(__dirname, 'src/index.html')
      }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'windows.jQuery': 'jquery',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:4].css',
      chunkFilename: 'css/[id]-[contenthash:4].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),    
    new CleanWebpackPlugin(['dist'])
  ]
});
