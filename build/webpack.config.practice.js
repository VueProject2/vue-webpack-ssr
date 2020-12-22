/* 开发环境使用 */

const path = require('path')
// vue-loader版本是v15的话，加一个plugins
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// html插件
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge') // 用来合并不同的webpack配置
const baseConfig = require('./webpack.config.base')

const devServer = {
	port: 8080, // 端口
	// host设置成0.0.0.0之后，项目就可以通过ip地址访问，比如本机ip，或者127.0.0.1
	host: '0.0.0.0',
	// open: true,
	inline: true,
	overlay: {
			errors: true // 将编译错误显示在网页上
	},
	hot: true // 作用是：更改内容的时候，不会将页面更新，而是只更新当前组件
}

const defaultPlugins = [
	new VueLoaderPlugin(),
	new HTMLPlugin({
    //生成html文件时，根据template.html这个模板生成
    template: path.join(__dirname,"template.html"),
  }),
	// 这个作用是在项目其他地方获取环境变量
	new webpack.DefinePlugin({
			'process.env': {
					NODE_ENV: '"development"'
			}
	})
]

let config

// merge方法返回一个新的对象，不会改变baseConfig。
config = merge(baseConfig, {
  entry: path.join(__dirname,"../practice/index.js"),
	devtool: "#cheap-module-eval-source-map",
	module: {
		rules: [{ // 开发环境下，处理less文件
			test: /\.less$/,
			// 当前需要处理.less文件，首先是less-loader将文件处理成css代码，css-loader将待变
			use: [
				'style-loader', // 将css-loader解析完的css代码加入到html文件style标签中
				'css-loader',
				{
					loader: 'postcss-loader',
					options: {
						// less-loader和portcss-loader都会生成sourceMap，
						// 这里的作用是使用之前的loader生成的sourceMap，提高编译速度
						sourceMap: true
					}
				},
				'less-loader' // 将less代码转成css
			]
		}]
	},
	plugins: defaultPlugins.concat([
    new webpack.HotModuleReplacementPlugin()
	]),
  devServer,
  resolve: {
    alias: {
      //指定"import Vue from 'vue'"中的vue的路径，默认路径是"../node_modules/vue/dist/vue.runtime.xxx.js"
      //引用vue.esm.js，就可以在new Vue({})中使用template
      'vue': path.join(__dirname, '../node_modules/vue/dist/vue.esm.js'),
    }
  }
})
module.exports = config
