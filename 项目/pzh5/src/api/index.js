import request from '../utils/requset'

// 验证码
export const getverify = (data) => {
  return request.post('/api/verify',data)
}
// 注册
export const getReguser = (data) => {
  return request.post('/api/reguser',data)
}
// 登录
export const getLogin = (data) => {
  return request.post('/api/login',data)
}
// 获取医院列表数据
export const getHospitals = () => {
  return request.get('/other/c/getHospitals')
}
// 获取订单有关数据
export const getOrderInfo = () => {
  return request.get('/other/c/getOrderInfo')
}
// 返回订单数据
export const postDd = (data) => {
  return request.post('/other/c/postDd',data)
}
// 获取订单
export const getDd = (params) => {
  return request.get('/other/c/getDd',{params})
}