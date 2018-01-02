import axios from 'axios'

axios.defaults.withCredentials = true

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 60000,
  // axios默认原生ajax请求request payload，贼难解析，通过修改content-type，并且转换data达到要求
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  withCredentials: false,
  transformRequest: [data => {
    let result = ''
    for (let it in data) {
      result += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return result.substr(0, result.length - 1)
  }]
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
    // 统一api异常处理，记得抛出error，让各自的promise处理
    window.localStorage.clear()
    window.sessionStorage.clear()
    throw error
  }
)

export default service
