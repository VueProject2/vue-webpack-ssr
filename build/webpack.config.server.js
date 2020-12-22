/* 服务端渲染使用 */

const path = require('path')
// vue-loader版本是v15的话，加一个plugins
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// 分离css的插件
const CssExtractPlugin = require('mini-css-extract-plugin')
// const CssExtractPlugin = require('extract-css-chunks-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge') // 用来合并不同的webpack配置
const baseConfig = require('./webpack.config.base')
const VueServerPlugin = require('vue-server-renderer/server-plugin')//用于vue服务端渲染

let config

// merge方法返回一个新的对象，不会改变baseConfig。
config = merge(baseConfig, {
  target: 'node',//指定打包的环境是node
  entry: path.join(__dirname,"../client/server-entry.js"),
  devtool: "source-map",//使用这个是因为vue-server-render有一个webpack的插件，提供代码调试的功能，指引到出错代码在什么文件的哪行
  output: {
    //用来指定我们写的代码的入口是什么，设置成commonjs2，入口就是module.exports = ...，这样的话我们就可以在node中直接使用打包出来的js，因为node的模块系统就是module.exports = ...以及require
    libraryTarget: 'commonjs2',
    filename: 'server-entry.js',
    path: path.join(__dirname, '../server-build')
  },
  //不要去打包dependencies中的依赖文件
  externals: Object.keys(require('../package.json').dependencies),
	module: {
		rules: [
      { // 生产环境下分离css
        test: /\.less$/,
        use: [
          CssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'less-loader'
        ]
      }]
	},
	plugins: [
    new VueLoaderPlugin(),
    new CssExtractPlugin({
      filename: 'styles.[contentHash:8].css',
      chunkFilename: 'styles.[contentHash:8].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueServerPlugin()
	]
})
module.exports = config
