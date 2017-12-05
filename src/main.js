// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'

import Cookie from 'js-cookie'

Vue.use(ElementUI)

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
    // 登录态检查
    checkLogin () {
      // 不用登录拦截地址列表
      const exclude = ['/login']
      if (exclude.indexOf(this.$route.path) === -1) {
        // 未登录转发至登录路由
        if (!Cookie.get('JSESSIONID')) {
          this.$router.push('/login')
        }
      }
    }
  }
})
