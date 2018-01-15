import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 不用登录拦截地址列表
    excludeCheckLoginPaths: ['/login'],
    tabData: {
      activeTabName: 'welcome',
      tabs: [{
        title: '欢迎',
        name: 'welcome',
        content: 'Welcome',
        closable: false
      }]
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
      this.commit('updateActiveTabName', tabData.activeTabName)
    },
    // 移除一个tab
    removeTab (state, name) {
      state.tabData.tabs.forEach((tab, index) => {
        if (name === tab.name) {
          // 注意splice函数用法
          state.tabData.tabs.splice(index, 1)
        }
      })
    },
    // 改变激活tab
    updateActiveTabName (state, name) {
      state.tabData.activeTabName = name
    }
  }
})

export default store
