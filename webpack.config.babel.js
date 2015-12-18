import fs from 'fs'
import webpack from 'webpack'

const prod = process.env.NODE_ENV == "production"

module.exports = {
  entry: {
    index: ["./app/index.js"]
  },
  output: {
    path: "./dist",
    filename: 'js/[name].js',
    publicPath: prod ? '/' : 'http://localhost:4080/',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'react-hot!babel?compact=false'},
      { test: /\.css$/, loader: "style!css"},
      { test: /\.scss$/, loader: "style!css!sass?includePaths[]=node_modules/compass-mixins/lib"},
      { test: /\.less/, loader: "style!css!less"},
      { test: /\.(svg|eot|ttf|woff2?|jpg|png)$/, loader: "url?limit=8000&name=img/[name].[hash].[ext]" },
    ]
  },
  devtool: prod ? "source-map" : "eval-source-map",
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
