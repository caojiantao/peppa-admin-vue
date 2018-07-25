// import Vue from 'vue'
import VueRouter from 'vue-router'

// Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('@/view/index'),
      children: [
        {path: 'system/security/menus', component: () => import('@/view/system/security/menu')},
        {path: 'system/security/roles', component: () => import('@/view/system/security/role')},
        {path: 'system/security/users', component: () => import('@/view/system/security/user')},
        {path: 'system/dictionary/sets', component: () => import('@/view/system/dictionary/dictSet')},
        {path: 'system/dictionary/values', component: () => import('@/view/system/dictionary/dictValue')},
        {path: '/system/quartz/jobs', component: () => import('@/view/quartz/job')},
        {path: 'spider/kugou/songs', component: () => import('@/view/spider/kugou/song')},
        {path: 'spider/kugou/mvs', component: () => import('@/view/spider/kugou/mv')},
        {path: 'welfare/girls', component: () => import('@/view/spider/welfare/girl')},
        {path: 'resource/qiniu', component: () => import('@/view/resource/qiniu')}
      ]
    },
    {
      path: '/login',
      component: () => import('@/view/login/index')
    },
    {
      path: '/video',
      component: () => import('@/view/video')
    }
  ]
})
