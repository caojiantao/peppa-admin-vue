import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 60000,
  // axios默认原生ajax请求request payload，贼难解析，通过修改content-type，并且转换data达到要求
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
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
  config.headers['X-Token'] = window.localStorage.getItem('token')
  return config
}, error => {
  console.log(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 统一api异常处理，记得抛出error，让各自的promise处理
    if (error.response.status === 401) {
      window.localStorage.clear()
    }
    throw error
  }
)

export default service
