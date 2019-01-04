const path = require('path');

module.exports = {
  mode: 'production',
  entry: [
    './src/pages/test.js',
  ],
  output: {
    path: __dirname + '/src/pages/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }]
      },
      {
        test: /(\.text|\.html|\.htm)$/,
        use: [{
          loader: "text-loader"
        }]
      },
    ]
  }
}