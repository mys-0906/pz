const express = require('express')
const cors = require('cors')
const expressJWT = require('express-jwt')
const userRouter = require('./router/user.js')
const config = require('./schema/config')
const otherRouter = require('./router/other.js')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
//封装一个失败的模板
app.use((req,res,next)=>{
    res.cc = function (err,status = 1){
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

app.use(expressJWT({secret: config.jwtSecreKey}).unless({path: [/^\/api/]}))
app.use((err,req,res,next) => {
  if(err.name === 'UnauthorizedError') {
    return res.send({status:-1,message: 'token错误或者token过期'})
    }
  res.cc(err)
})
// 使用路由
app.use('/api', userRouter)
app.use('/other',otherRouter)
app.listen(9000, () => {
  console.log('启动成功', 'http://127.0.0.1:9000');
})