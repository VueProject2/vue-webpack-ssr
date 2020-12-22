//每一次服务端渲染，都渲染一个新的app，不能用上一次渲染过的app的对象再去进行下一次渲染，因为这个app对象已经包含了上一次渲染的状态,
//会影响下一次渲染的内容，所以每次都要创建一个新的app

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import App from  './app.vue'
import createStore from './store/store'
import createRouter from './config/router'

import './assets/styles/globel.less'

Vue.use(VueRouter)
Vue.use(Vuex)

export default () => {
  const router = createRouter()
  const store = createStore()

  const app = new Vue({
    router,
    store,
    render: (h) => h(App)
  })

  return {app, router, store}
}
