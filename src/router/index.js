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
      children: [
        {path: 'system/security/menus', component: resolve => require(['@/view/security/menu'], resolve)},
        {path: 'system/security/roles', component: resolve => require(['@/view/security/role'], resolve)},
        {path: 'system/security/users', component: resolve => require(['@/view/security/user'], resolve)},
        {path: 'system/dictionary/sets', component: resolve => require(['@/view/system/dictionary/dictSet'], resolve)},
        {path: 'system/dictionary/values', component: resolve => require(['@/view/system/dictionary/dictValue'], resolve)},
        {path: 'system/quartz/jobs', component: resolve => require(['@/view/quartz/job'], resolve)},
        {path: 'spider/kugou/songs', component: resolve => require(['@/view/spider/kugou/song'], resolve)},
        {path: 'spider/kugou/mvs', component: resolve => require(['@/view/spider/kugou/mv'], resolve)},
        {path: 'welfare/girls', component: resolve => require(['@/view/spider/welfare/girl'], resolve)},
        {path: 'resource/qiniu', component: resolve => require(['@/view/resource/qiniu'], resolve)}
      ]
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
