// import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router/index'

// Vue.use(Vuex)

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
    },
    logout () {
      window.localStorage.clear()
      window.sessionStorage.clear()
      router.push('/login')
    }
  }
})

export default store
