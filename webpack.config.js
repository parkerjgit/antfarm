const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: ['babel-polyfill', './client/index.js'],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'client')
        ],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },

  resolve: {
    alias: {
      'three/OrbitControls': path.join(__dirname, 'node_modules/three/examples/js/controls/OrbitControls.js'),
      'three/OBJLoader': path.join(__dirname, 'node_modules/three/examples/js/loaders/OBJLoader.js'),
      'three/CanvasRenderer': path.join(__dirname, 'node_modules/three/examples/js/renderers/CanvasRenderer.js'),
      'three/Projector': path.join(__dirname, 'node_modules/three/examples/js/renderers/Projector.js')
      // ...
    }
  },

  plugins: [
    // new ThreeWebpackPlugin(),
    new webpack.ProvidePlugin({
      'THREE': 'three/build/three'
    }),
	]
};
