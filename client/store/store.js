import Vuex from 'vuex'
import defaultState from './state/state'
import getters from './getters/getters'
import mutations from './mutations/mutations'
import actions from './actions/actions'

export default () => {
  const store = new Vuex.Store({
    state: defaultState,
    getters,
    mutations,
    actions,
    plugins: []
  })

  if(module.hot){
    module.hot.accept([
      './state/state.js',
      './getters/getters.js',
      './mutations/mutations.js',
      './actions/actions.js'
    ], () => {
      const newState = require('./state/state').default //这里加.default是因为state.js中用到export default
      const newGetters = require('./getters/getters').default
      const newMutations = require('./mutations/mutations').default
      const newActions = require('./actions/actions').default

      store.hotUpdate({
        state: newState,
        getters: newGetters,
        mutations: newMutations,
        actions: newActions
      })

    })
  }

  store.watch(state => state.count + 1, newVal => {
    console.log(newVal)
  })

  store.subscribe((mutation,state) => {
    console.log(mutation.type)
    console.log(mutation.payload);
  })

  return store
}
