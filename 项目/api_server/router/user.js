const express = require('express')
const userHandler = require('../router_handler/user')
const router = express.Router()
// 注册
router.post('/reguser', userHandler.regUser)
// 登录
router.post('/login', userHandler.login)
// 验证码
router.post('/verify',userHandler.verify)

module.exports = router