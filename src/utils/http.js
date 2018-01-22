/**
 * http接口访问工具，主要是针对一些外部爬虫http接口，例如酷狗歌曲
 */
import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_HTTP,
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
    Promise.reject(error)
  }
)

export default service
