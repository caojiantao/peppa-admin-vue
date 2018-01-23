// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import ajax from '@/utils/ajax'

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
  mounted () {
    // 获取用户信息
    // this.getUser()
  },
  methods: {
    // 是否需要登录
    needLogin () {
      let excludeCheckLoginPaths = this.$store.state.excludeCheckLoginPaths
      return excludeCheckLoginPaths.indexOf(this.$route.path) === -1
    },
    // 是否已经登录
    isLogin () {
      let token = window.localStorage.getItem('token')
      if (!token) {
        token = window.sessionStorage.getItem('token')
      }
      return token
    },
    // 登录态检查
    checkLogin () {
      if (this.needLogin() && !this.isLogin()) {
        // 未登录转发至登录路由
        this.$router.push('/login')
      }
    },
    getUser () {
      if (this.needLogin() && this.isLogin()) {
        let username = window.sessionStorage.getItem('username')
        if (!username) {
          username = window.localStorage.getItem('username')
        }
        let promise = ajax({
          method: 'get',
          url: '/users',
          params: {
            username: username
          }
        })
        promise.then(value => {
          let data = value.data
          this.$store.commit('updateUser', data)
          console.log(data)
        }, error => {
          let response = error.response
          this.$message({
            message: response.data
          })
        })
      }
    }
  }
})
