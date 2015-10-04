import fs from 'fs'
import webpack from 'webpack'

module.exports = {
  entry: {
    index: ["./app/index.js"]
  },
  output: {
    filename: 'js/[name].js',
    publicPath: 'http://localhost:8080/',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'react-hot!babel?compact=false&stage=0'},
      { test: /\.css$/, loader: "style!css"},
      { test: /\.scss$/, loader: "style!css!sass?includePaths[]=node_modules/compass-mixins/lib"},
      { test: /\.less/, loader: "style!css!less"},
      { test: /\.(svg|eot|ttf|woff2?|jpg|png)$/, loader: "url?limit=8000&name=images/[name].[hash].[ext]" },
    ]
  },
  devtool: "eval-source-map",
}

// Monkey patch the bootstrap theme
const ln_sf = (src, dst) => {
  try {
    fs.unlinkSync("node_modules/bootstrap/less/variables.less")
  } catch(e) {
    if (e.code != 'ENOENT')
      throw(e)
  }
  fs.symlinkSync(src, dst)
}

ln_sf("../../../app/layout/_bootstrap_variables.less",
      "node_modules/bootstrap/less/variables.less")
