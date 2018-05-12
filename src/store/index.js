import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 不用登录拦截地址列表
    excludeCheckLoginPaths: ['/login', '/video', '/audio'],
    // 面包屑
    breadcrumbs: {}
  },
  mutations: {
    setBreadcrumbs (state, breadcrumbs) {
      state.breadcrumbs = breadcrumbs
    }
  }
})

export default store
