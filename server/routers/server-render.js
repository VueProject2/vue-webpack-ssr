const ejs = require('ejs')

module.exports = async (ctx, renderer, template) => {

  ctx.headers['Content-type'] = 'text/html'

  //服务端渲染的时候，把这个context传入到vue-server-renderer，
  //vue-server-renderer渲染完成之后，在context里插入一堆的属性，
  //包括：title、description、客户端js文件路径、css文件路径等信息，
  //如果没有把vue文件里的css单独提取到css文件里面，那么它会在里面生成一个style标签，style标签中是当前路由下用到的css代码，如下
  //<link href=''>
  //<script src=""></script>
  //<style type="text/css">.{}</style>
  //我们可以用context去渲染html。
  const context = { url: ctx.path }

  try{

    /* renderer.renderToString(context).then(res => {
      console.log(res)
    }).catch(rej => {
      console.log(rej)
    }) */
    const appString = await renderer.renderToString(context)

    //ejs渲染，第一个参数是template，第二个参数是渲染template所需的变量
    const html = ejs.render(template,{
      appString,
      //带有style标签的整个css代码字符串
      style: context.renderStyles(),
      scripts: context.renderScripts(),
    })
    ctx.body = html
  }catch(err){
    console.log('我是 server-render.js:'+err)
    throw err
  }
}
