import axios from 'axios'

const http = axios.create({
  baseURL:'http://127.0.0.1:9000',
  timeout:10000,
  headers: {"terminal" : "h5"}
})

http.interceptors.request.use(function (config) {
  const token = localStorage.getItem('c_token')
  // 不需要添加token的api
  const whiteUrl = ['/api/verify','/api/reguser','/api/login']
  if(token && !whiteUrl.includes(config.url)) {
    config.headers['Authorization'] = token
  }
  return config
},function(error) {
  return Promise.reject(error)
})

http.interceptors.response.use(function (response) {
  if(response.data.status === -1) {
    localStorage.removeItem('c_token')
    localStorage.removeItem('c_userInfo')
    alert('登录过期')
  }
  return response
},function (error) {
  return Promise.reject(error)
})
export default http