const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/user')
// 权限管理
router.get('/auth/admin',userHandler.authAdmin)
// 菜单管理
router.post('/auth/group',userHandler.menuList)
// 权限列表
router.get('/auth/list',userHandler.list)
// 获取权限列表
router.get('/auth/getList',userHandler.getList)
// 修改用户权限列表
router.post('/auth/updateUser',userHandler.setUserList)
// 用户权限实现
router.post('/auth/login',userHandler.userLogin)
// 仅修改用户昵称
router.post('/auth/nicheng',userHandler.nicheng)
// 新增陪诊师
router.post('/vppz/staff',userHandler.addPzs)
// 查询陪诊师列表
router.get('/vppz/getPzs',userHandler.getPzsList)
// 修改陪诊师信息
router.post('/vppz/setPzs',userHandler.setPzs)
// 删除陪诊师列表
router.post('/vppz/delePzs',userHandler.deletePzs)
// 获得医院列表
router.get('/c/getHospitals',userHandler.getHospitals)
// 获取下订单有关数据
router.get('/c/getOrderInfo', userHandler.getOrderInfo)
// 新增订单数据
router.post('/c/postDd',userHandler.postDd)
// 查询订单
router.get('/c/getDd',userHandler.getDd)


module.exports = router
