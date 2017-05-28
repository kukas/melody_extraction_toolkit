var path = require('path');

module.exports = {
  entry: './app.js',
  devtool: "cheap-eval-source-map",
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }

};