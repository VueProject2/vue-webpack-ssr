import createApp from './create-app'

//这个方法接收的context 就是server-render.js中renderer.renderToString(context)传入的context
export default context => {
  return new Promise((resolve, reject) => {
    const {app, router} = createApp()

    router.push(context.url)

    //当执行了router.push()，该路由所有的异步操作都做完之后，再执行onReady
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if(!matchedComponents.length){
        return reject(new Error('no component matched'))
      }
      resolve(app)
    })
  })
}
