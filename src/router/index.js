import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login/index'
import index from '@/view/index'
import Dictionary from '@/view/Dictionary/index'
import Songs from '@/view/simulation/kugou/songs'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: index,
      children: [
        {
          path: '/management/dictionary',
          component: Dictionary
        },
        {
          path: '/simulation/kugou/songs',
          component: Songs
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
