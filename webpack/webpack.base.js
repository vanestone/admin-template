const path = require('path');
const pkg = require('../package.json');

const webpack = require('webpack');
const ProgressPlugin = webpack.ProgressPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const mfConfig = require('./webpack.mf');
const { merge } = require('webpack-merge');

const {
  APP_ENV = 'prod',
  NODE_ENV = 'production',
  CI_PROJECT_ID,
  CI_COMMIT_BRANCH,
  CI_COMMIT_SHORT_SHA,
} = process.env;

const isDevelopment = NODE_ENV === 'development';

/** 默认值 */
let publicPath = '/';

if (CI_PROJECT_ID) {
  publicPath = `https://mico.meetsocial.cn/${CI_PROJECT_ID}/${CI_COMMIT_BRANCH}/${CI_COMMIT_SHORT_SHA}/`;
}

const config = {
  entry: './src/index.ts',
  target: 'web',
  output: {
    publicPath,
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    alias: {
      '@': path.resolve('src'),
      '@app': path.resolve('app'),
    },
  },
  cache: {
    type: 'filesystem',
  },
  performance: {
    hints: false,
    maxAssetSize: 1024 * 1024 * 50,
    maxEntrypointSize: 1024 * 1024 * 50,
  },
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|svg)$/i,
        exclude: ['/node_modules/'],
        type: 'asset',
      },
      {
        test: /\.(less|css)$/i,
        exclude: ['/node_modules/'],
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
              importLoaders: 2,
            },
          },
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'css',
              minify: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDevelopment,
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.[tj]sx?$/,
        loader: 'esbuild-loader',
        exclude: ['/node_modules/'],
        options: {
          jsx: 'automatic',
          tsconfig: 'tsconfig.json',
        },
      },
    ],
  },

  plugins: [
    new ProgressPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/*index.html'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new ESLintPlugin({
      exclude: 'node_modules',
      cache: true,
      cacheLocation: path.resolve('/node_modules/.cache/.eslintcache'),
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      title: pkg.description,
    }),
  ],
};

// module.exports = merge(mfConfig, config);
module.exports = config;
