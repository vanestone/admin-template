const prodConfig = require('./webpack.prod.js');

const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(
  merge(prodConfig, {
    plugins: [new BundleAnalyzerPlugin()],
  })
);
