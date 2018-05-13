// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import {getToken} from '@/utils/auth'

// Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  watch: {
    // 路由变化检查是否登录
    '$route': 'checkLogin'
  },
  created () {
    // 打开页面检查是否登录
    this.checkLogin()
  },
  methods: {
    // 是否需要登录
    needLogin () {
      let excludeCheckLoginPaths = this.$store.state.excludeCheckLoginPaths
      return excludeCheckLoginPaths.indexOf(this.$route.path) === -1
    },
    // 是否已经登录
    isLogin () {
      return getToken()
    },
    // 登录态检查
    checkLogin () {
      if (this.needLogin() && !this.isLogin()) {
        // 未登录转发至登录路由
        this.$router.push('/login')
      }
    }
  }
})
