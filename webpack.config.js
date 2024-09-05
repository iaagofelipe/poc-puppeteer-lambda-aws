const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production', 
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, '.webpack'),
    filename: 'handler.js',
    libraryTarget: 'commonjs2',
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    modules: ['node_modules'],
  },
};
