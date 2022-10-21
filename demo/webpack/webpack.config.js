const path = require('path');
const { ContextReplacementPlugin } = require('webpack')

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  target: 'node',
  plugins: [
    new ContextReplacementPlugin(/liquidjs/)
  ],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
};