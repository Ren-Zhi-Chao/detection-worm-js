const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals')
const domain = require('../package.json');
const entry = domain.entry.startsWith('./') ? domain.entry : `./${domain.entry}`;
const output_file = path.basename(domain.main);
const output_path = path.dirname(domain.main);

module.exports = {
  devtool: 'none',
  entry,
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../', output_path),
    filename: output_file,
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'babel-loader' } // options 在 .babelrc 定义
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  externals: [
    nodeExternals()
  ]
}
