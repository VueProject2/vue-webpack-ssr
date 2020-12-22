/* 存放扩展配置 */

const path = require('path')
// vue-loader版本是v15的话，加一个plugins
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// html插件
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge') // 用来合并不同的webpack配置
// 分离css的插件
// const CssExtractPlugin = require('mini-css-extract-plugin')
const CssExtractPlugin = require('extract-css-chunks-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const VueClientPlugin = require('vue-server-renderer/client-plugin')


// 判断环境，值为true时是开发环境
// 这里process.env.NODE_ENV对应的是package.json中"scripts"里"build"、"dev"里配置的环境变量
const isDev = process.env.NODE_ENV === 'development'

const devServer = {
  port: 8000, // 端口
  // host设置成0.0.0.0之后，项目就可以通过ip地址访问，比如本机ip，或者127.0.0.1
  host: '0.0.0.0',
  // open: true,
  inline: true,
  overlay: {
    errors: true // 将编译错误显示在网页上
  },
  historyApiFallback:{
    index: '/index.html'
  },
  hot: true // 作用是：更改内容的时候，不会将页面更新，而是只更新当前组件
}

const defaultPlugins = [
  new VueLoaderPlugin(),
  new HTMLPlugin({
    template: path.join(__dirname,'./template.html')
  }),
  // 这个作用是在项目其他地方获取环境变量
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new VueClientPlugin()
]

let config

if (isDev) { // 开发环境
  // merge方法返回一个新的对象，不会改变baseConfig。
  config = merge(baseConfig, {
    // devtool: "#cheap-module-eval-source-map",
    module: {
      rules: [{ // 开发环境下，处理less文件
        test: /\.less$/,
        // 当前需要处理.less文件，首先是less-loader将文件处理成css代码，css-loader将待变
        use: [
          // 'style-loader', // 将css-loader解析完的css代码加入到html文件style标签中
          CssExtractPlugin.loader,
          'css-loader',
          /* {
                loader: "css-loader", //分析出各个css文件之间的关系，把各个css文件合并成一段css
                options: {
                    modules: {
                        // camelCase: true, //将"form-input"这种类名转成驼峰命名"formInput"
                        localIdentName: '[path][name]-[hash:base64:5]', //设置css的类名
                    },
                }
            }, */
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
      new webpack.HotModuleReplacementPlugin(),
      // new webpack.NoEmitOnErrorsPlugin()
      new CssExtractPlugin({
        filename: 'styles.[contentHash:8].css',
        chunkFilename: 'styles.[contentHash:8].css'
      })
    ]),
    devServer
  })
} else { // 生产环境
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/index.js')
      // vendor: ['vue'],
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [{ // 生产环境下分离css
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
    plugins: defaultPlugins.concat([
      new CssExtractPlugin({
        filename: 'styles.[contentHash:8].css',
        chunkFilename: 'styles.[contentHash:8].css'
      })
    ]),
    optimization: { // 分离类库
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: true
    }
  })
}

module.exports = config
