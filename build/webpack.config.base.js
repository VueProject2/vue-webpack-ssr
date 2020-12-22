/* 存放webpack基础配置，被其他配置文件所依赖 */

const path = require('path')

// 判断环境，值为true时是开发环境
// 这里process.env.NODE_ENV对应的是package.json中"scripts"里"build"、"dev"里配置的环境变量
const isDev = process.env.NODE_ENV === 'development'

const createVueLoaderOptions = require('./vue-loader.config.js')

const config = {
  mode: process.env.NODE_ENV || 'production', // 指定环境，webpack4新出内容，根据不同的环境，webpack会做优化
  target: 'web', // 指定项目的运行环境是web平台
  // entry设置入口文件
  // __dirname是当前文件webpack.config.js所在地址，也就是根目录
  // path.join()方法，将两个路径拼接起来，形成一个绝对路径
  entry: path.join(__dirname, '../client/index.js'),
  // output设置出口
  output: {
    filename: "bundle.[hash:8].js", //设置文件名，这里不能使用chunkhash，否则会报错
    path: path.join(__dirname, '../dist'), // 设置文件路径
    publicPath: 'http://127.0.0.1:8000/',//为了服务端渲染，node端获取前端静态资源的路径设置为绝对路径
  },
  module: {
    // rules配置规则
    rules: [{
      test: /.(vue|jsx|js)$/,
      loader: 'eslint-loader',
      exclude: /node_modules/, // 排除node_modules文件夹下的文件
      enforce: 'pre' // 设置为预处理，也就这些匹配的文件先用eslint-loader预处理，如果不报错，再用下边配置的loader进行处理
    },
    {
      // test检测文件类型
      // test值是一个正则，下边这个正则就是匹配所有.vue文件
      test: /.vue$/,
      // loader让webpack能够去处理那些非JavaScript文件
      loader: 'vue-loader',
      options: createVueLoaderOptions(isDev)
    },
    {
      test: /\.jsx$/,
      loader: 'babel-loader'
    },
    {
      // 用babel-loader处理js文件中的es6代码
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/ // 忽略掉node_modules文件路径下的文件

    },
    {
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      use: [{
        // url-loader可以把图片转换成base64代码
        loader: 'url-loader',
        options: {
          limit: 1024, // 当文件大小小于1024时，就会将图片转换成base64代码
          name: 'resourse/[path][name]-[hash:8].[ext]' // 配置名称，[path]是原文件路径，打包之后会使用之前的路径，[name]是原文件名，[ext]是后缀
        }
      }]
    }
    ]
  }
}

module.exports = config
