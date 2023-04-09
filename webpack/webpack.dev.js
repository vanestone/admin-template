const path = require('path');
const fs = require('fs');
const mkcert = require('mkcert');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// 证书路径
const appKey = 'cert/local.key';
const appCert = 'cert/local.crt';
const rootKey = 'cert/root.key';
const rootCert = 'cert/root.crt';

const config = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    host: 'localhost.meetsocial.cn',
    port: 3000,
    hot: true,
    compress: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    server: {
      type: 'https',
      options: { key: appKey, cert: appCert },
    },
  },
  plugins: [new ReactRefreshWebpackPlugin()],
};

module.exports = (env, args) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(appKey) || !fs.existsSync(appCert)) {
      console.log('检测到SSL证书不存在, 正在生成证书...');
      fs.mkdirSync(path.resolve('../cert'));
      mkcert
        .createCA({
          organization: 'Meetsocial',
          countryCode: 'CN',
          state: 'Shanghai',
          locality: 'Shanghai',
          validityDays: 9999,
        })
        .then((root) => {
          mkcert
            .createCert({
              domains: [
                config.devServer.host,
                'localhost',
                '127.0.0.1',
                '0.0.0.0',
              ],
              validityDays: 9999,
              caKey: root.key,
              caCert: root.cert,
            })
            .then((cert) => {
              Promise.all([
                fs.promises.writeFile(rootKey, root.key),
                fs.promises.writeFile(rootCert, root.cert),
                fs.promises.writeFile(appKey, cert.key),
                fs.promises.writeFile(appCert, `${cert.cert}\n${root.cert}`),
              ]).then(() => {
                console.log(`证书生成成功, 请安装根证书: ${rootCert}`);
                resolve(merge(baseConfig, config));
              });
            });
        });
    } else {
      resolve(merge(baseConfig, config));
    }
  });
};
