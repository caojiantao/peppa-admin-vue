import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,     // api的base_url
  timeout: 60000                     // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
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
    console.log(error)
  }
)

export default service
