const slsw = require('serverless-webpack');
const path = require('path');

module.exports = {
  externals: ['express', 'swagger-jsdoc'],
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
