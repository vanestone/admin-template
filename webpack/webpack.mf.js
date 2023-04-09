const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'sino_admin_rule',
      filename: 'remoteEntry.js',
      exposes: {
        './app': '@app/index.tsx',
      },
    }),
  ],
};
