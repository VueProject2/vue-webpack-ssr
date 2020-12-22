import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './app.vue'
import createRouter from './config/router'
import createStore from './store/store'

import './assets/styles/globel.less'

Vue.use(VueRouter)
Vue.use(Vuex)

const router = createRouter()
const store = createStore()

store.registerModule('c',{
  state: {
    text: 3
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#root')
