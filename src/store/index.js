import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 不用登录拦截地址列表
    excludeCheckLoginPaths: ['/login'],
    user: {}
  },
  mutations: {
    updateUser (state, user) {
      state.user = user
    }
  }
})

export default store
