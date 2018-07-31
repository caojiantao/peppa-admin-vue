/**
 * 后台restFul接口请求工具，例如登录校验，菜单权限
 */
import axios from 'axios'
import qs from 'qs'
import store from '@/store/index'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 60000,
  // axios默认原生ajax请求request payload，贼难解析，通过修改content-type，并且转换data达到要求
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  let token = window.localStorage.getItem('token')
  if (!token) {
    token = window.sessionStorage.getItem('token')
  }
  if (token) {
    config.headers['X-Token'] = token
  }
  if (config.method === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8') {
    // 需要转换数据格式，注意allowDots使用小数点形式，方便后台接收
    config.data = qs.stringify(config.data, {allowDots: true})
  }
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    let response = error.response
    switch (response.status) {
      case 401:
        store.commit('logout')
        break
      default:
        break
    }
    // 抛给下级处理
    throw error
  }
)

export default service
