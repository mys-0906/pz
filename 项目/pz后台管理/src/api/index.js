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
// 权限管理
export const authAdmin = (params) => {
  return request.get('/other/auth/admin',{ params })
}
// 新增权限
export const authGroup = (data) => {
  return request.post('/other/auth/group',data)
}
// 权限列表
export const menuList = (params) => {
  return request.get('/other/auth/list',{ params })
}
//  获得权限列表
export const getList = () => {
  return request.get('/other/auth/getList')
}
// 用户数据修改
export const userSetMenu = (data) => {
  return request.post('/other/auth/updateUser',data)
}
// 用户权限实现
export const userLogin = (data) => {
  return request.post('/other/auth/login',data)
}
// 仅修改昵称
export const setNicheng = (data) => {
  return request.post('/other/auth/nicheng',data)
}
// 仅修改昵称
export const addPzs = (data) => {
  return request.post('/other/vppz/staff',data)
}
// 获取陪诊师列表
export const getPzs = (params) => {
  return request.get('/other/vppz/getPzs',{ params })
}
// 修改陪诊师信息
export const updataPzs = (data) => {
  return request.post('/other/vppz/setPzs',data)
}
// 删除陪诊师列表
export const deletePzs = (data) => {
  return request.post('/other/vppz/delePzs',data)
}
