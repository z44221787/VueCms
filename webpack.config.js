const path = require('path');
module.exports = {
  // devtool: 'eval-source-map',
  mode: 'production',
  entry: [
     './src/pages/test.js',
  ],
  output: {
    path: __dirname + '/src/pages/',
    filename: 'outils.min.ie8.js'
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
      {
        test:/\.(jsx|js)$/,
        use:{loader:'babel-loader',
            options:{
            presets:[
                "es2015","react"
              ]
            }
        },
        exclude:/node_modules/
      }
    ]
  }
}