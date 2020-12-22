const Router = require('koa-router')
const axios = require('axios')
const fs = require('fs')

const path = require('path')
const MeMoryFs = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')

//memory-fs，和node.js里的fs的api是一样的，并且会扩展一些api
//和fs的唯一区别是，memory-fs不把软件写入到我们的磁盘上面，如果写入磁盘上面，就会在项目路径下看到一个文件夹,memory-fs是写在内存里。
//写入磁盘是一个非常浪费时间的事情，效率非常低，webpack去编译文件、读取文件、输出文件，如果都是从磁盘上去操作，效率会比较低，webpack依赖的文件比较多,
//所以把所有的文件输出都放到memory-fs里面，这样的话读取文件、输出文件，都会非常快。
const serverCompiler = webpack(serverConfig)
const mfs = new MeMoryFs()
serverCompiler.outputFileSystem = mfs;

//用来记录node代码用webpack打包后生成的新文件
let bundle
//watch的好处是，改了文件之后都会重新打包，然后拿到重新打包后的bundle
serverCompiler.watch({}, (err, stats) => {
  //如果打包出错，抛出这个错误
  if(err) throw err
  //有一些错误不是打包的错误，比如是eslint的错误，会在stats中出现
  stats = stats.toJson()
  stats.errors.forEach(err => console.log('我是 stats errors in dev-ssr.js:'+err));
  // stats.warnings.forEach(warn => console.warn('我是 stats warnings in dev-ssr.js:'+warn))

  //这里是使用webpack.config.server.js配置文件webpack打包后生成的vue-ssr-server-bundle.json
  //为什么是json呢，因为配置文件里用了require('vue-server-renderer/server-plugin')这个插件
  //vue-ssr-server-bundle.json可以是别的名字，在配置文件，插件中定义。
  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json'
  )

  //不指定编码格式读出来的是二进制，指定编码是utf-8，读出来是字符串，要用JSON.parse转成json对象
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))

  console.log('new bundle generated')
})

const handleSSR = async (ctx) => {
  if(!bundle){
    ctx.body = '你等一会，别着急……'
    return
  }

  //获取客户端的webpack dev server帮我们打包出来的js文件的地址
  //因为我们要拿到这个地址之后，才能在我们去拼接html的时候，把客户端的js文件路径写在里面
  //这样的话，我们把html返回给浏览器之后，浏览器渲染出来可以引用客户端的js
  //才能够让整个应用在客户端运行起来。

  //通过向webpack dev server发送请求，拿到前端部分的文件
  const clientManifestResp = await axios.get(
    //这个文件就是webpack.config.client.js中VueClientPlugin生成的
    'http://127.0.0.1:8000/vue-ssr-client-manifest.json'
  )

  //clientManifestResp是axios.get()返回的一个response的对象，clientManifestResp.data才是我们要用的数据
  const clientManifest = clientManifestResp.data

  const template = fs.readFileSync(
    path.join(__dirname, '../server.template.ejs'),
    'utf-8'
  )

  //生成一个可以直接调用render的function
  const renderer = VueServerRenderer
    .createBundleRenderer(bundle, {
      //VueServerRenderer可以自动帮我们把需要的内容插入进去
      //需要在这里指定一个template，这个template一定要按照VueServerRenderer官方提供的模板形式
      //但是呢，用VueServerRenderer做这些工作的话，限制比较大，会导致我们有一些功能没办法做，
      //我们只需要它把内容渲染出来，然后我们自己去处理剩下的部分，就可以了
      //所以不需要这个功能，这里设置为false，阻止注入
      inject: false,//不执行注入
      //把clientManifest传入这里，createBundleRenderer会帮我们自动生成一个带有<script>标签的js文件引用的字符串，
      //把这个内容添加到server.template.ejs里
      clientManifest
    })

  await serverRender(ctx, renderer, template)
}

const router = new Router()

// router.get('*', handleSSR)
router.get('/(.*)', handleSSR)

module.exports = router

