import Router from 'vue-router'

import routes from './routes'

//这里导出是一个函数，而不是Router实例，是因为服务端渲染，如果导出的是一个Router实例，可能会导致内存溢出
export default () => {
  return new Router({
    routes,
    mode: 'history',
    // base: '/base/',//设置基础路径，设置之后访问app页面的地址变成localhost: 8000/base/app
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link',
    scrollBehavior(to, from, savedPosition){//页面跳转的时候，页面要不要滚动
      //to：跳转到哪个路由；from: 从哪个路由过来；savadPosition: 记录滚动条的位置
      if(savedPosition){
        return savedPosition
      }else{
        return {x:0,y:0}
      }
    },
    /* parseQuery(query){

    },
    stringifyQuery(obj){

    }, */
    fallback: true
  })
}
