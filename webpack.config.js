const devConfig = require('./webpack/webpack.dev');
const prodConfig = require('./webpack/webpack.prod');
const isProduction = process.env.NODE_ENV == 'production';
module.exports = (env, args) => {
  return isProduction ? prodConfig : devConfig(env, args);
};
