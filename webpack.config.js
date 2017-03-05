var path = require('path');

module.exports = {
  // devtool: 'sourcemap',
  context: path.resolve('app'),
  entry: ['./index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/assets/js/',
  },
  devServer: {
    contentBase: 'public',
  },
  watch: true,
  module: {
  loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.jsx?$/,
        enforce: "pre",
        loaders: ['eslint-loader'],
        //include: path.join(__dirname, 'app'),
        exclude: /(node_modules|bower_components)/,
        //exclude: path.join(__dirname, 'src/app/container')
      }
    ]
  }
};
