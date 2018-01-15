import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login/index'
import index from '@/view/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: index
    },
    {
      path: '/login',
      component: login
    }
  ]
})
