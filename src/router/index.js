import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login/index'
import index from '@/view/index'
import videoHome from '@/view/simulation/welfare/videoHome'
import videoPlay from '@/view/simulation/welfare/videoPlay'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: index,
      children: [{
        path: '',
        component: videoHome
      }, {
        name: 'videoPlay',
        path: 'videoPlay',
        component: videoPlay
      }]
    },
    {
      path: '/login',
      component: login
    }
  ]
})
