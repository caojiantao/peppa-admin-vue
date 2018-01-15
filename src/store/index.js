import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 不用登录拦截地址列表
    excludeCheckLoginPaths: ['/login'],
    tabData: {
      activeTabName: '',
      tabs: []
    },
    user: {}
  },
  mutations: {
    updateUser (state, user) {
      state.user = user
    },
    // 增加tabDate
    addTab (state, tabData) {
      state.tabData.tabs.push(tabData.tabs)
      state.tabData.activeTabName = tabData.activeTabName
    }
  }
})

export default store
