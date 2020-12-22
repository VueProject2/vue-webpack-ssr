const Koa = require('koa')
const send = require('koa-send')
const pageRouter = require('./routers/dev-ssr')
const app = new Koa()
const path = require('path')

//服务端渲染是分 开发环境 和 正式环境 两种情况的
const isDev = process.env.NODE_ENV === 'development'

//中间件，来记录一下所有服务端的请求以及抓取一些错误，这样的话，我们能够很好的了解做服务端的一些内容时是否出现了错误
//next是用于执行下一个中间件
//koa都是使用async await的写法，所以中间件的调用都可以在最外层try catch到错误，所以可以把所有的错误情况都放到最外层去处理
app.use(async (ctx, next) => {
  try{
    console.log(`request with path ${ctx.path}`);
    await next()
  }catch(err){
    console.log('我是 server.js：'+err)
    ctx.status = 500
    if(isDev){
      ctx.body = err.message
    }else{
      ctx.body = 'please try again later'
    }
  }
})

app.use(async (ctx, next) => {
  if(ctx.path === '/favicon.ico'){
    await send(ctx, '/favicon.ico', { root: path.join(__dirname, '../') })
  }else{
    await next()
  }
})

app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`);
})



//webpack compiler
/* const Koa = require('koa')
const Router = require('koa-router')
const Vue = require('vue')
const VueServerRender = require('vue-server-renderer')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const axios = require('axios')

const serverConfig = require('../build/webpack.config.server')

const router = new Router()
const koa = new Koa()
const mfs = new MemoryFS()

const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs;

let bundle
serverCompiler.watch({}, (err, stats) => {
  if(err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.log('我是 stats errors in dev-ssr.js:'+err));
  // stats.warnings.forEach(warn => console.warn('我是 stats warnings in dev-ssr.js:'+warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json'
  )

  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))

  console.log('new bundle generated')
})

koa.use(router.routes()).use(router.allowedMethods())

router.get('/(.*)',async (ctx) => {

  const clientManifestResp = await axios.get(
    'http://127.0.0.1:8000/vue-ssr-client-manifest.json'
  )

  const clientManifest = clientManifestResp.data

  const render = VueServerRender.createBundleRenderer(bundle, {
    inject: false,
    clientManifest
  })

  const context = { url: ctx.path }

  const appString = await render.renderToString(context)

  const template = fs.readFileSync(
    path.join(__dirname, './server.template.ejs'),
    'utf-8'
  )

  const html = ejs.render(template,{
    appString,
    style: context.renderStyles(),
    scripts: context.renderScripts(),
  })

  ctx.body = html
})

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

koa.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`);
}) */
