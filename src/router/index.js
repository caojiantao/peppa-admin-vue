import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login/index'
import index from '@/view/index'
import video from '@/view/video'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: index,
      children: []
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/video',
      component: video
    }
  ]
})
