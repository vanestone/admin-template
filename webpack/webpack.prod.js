const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { EsbuildPlugin } = require('esbuild-loader');

let config = {
  mode: 'production',
  optimization: {
    moduleIds: 'deterministic',
    minimize: true,
    minimizer: [new EsbuildPlugin()],
  },
  plugins: [new MiniCssExtractPlugin()],
};

module.exports = merge(baseConfig, config);
