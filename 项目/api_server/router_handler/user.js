const db = require('../db/index.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../schema/config.js')
const { json } = require('express')
// 注册
exports.regUser = (req, res) => {
  const userinfo = req.body
  //查询语句
  const sql = 'SELECT * FROM ev_users WHERE userName = ?'
  //插入语句
  const insertSql = 'insert into ev_users set ?'
  if (!userinfo.userName || !userinfo.passWord) {
    const err = '用户名密码不能为空'
    return res.cc(err)
  }
  //查询是否重名
  db.query(sql, userinfo.userName, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length > 0) {
      return res.cc('用户名已被占用')
    }
    //加密密码
    userinfo.passWord=bcrypt.hashSync(userinfo.passWord,10)
    // console.log(userinfo.passWord);
    //插入模块
    db.query(insertSql,{userName:userinfo.userName,passWord:userinfo.passWord},(err,results)=>{
      if(err){
        return res.cc(err)
      }
      if(results.affectedRows !==1){
        return res.cc('插入失败')
      }
      res.send({status:0,message:'注册成功'})
    })
    // res.send('reguser ok')
  })
}
// 登录
exports.login = (req, res) => {
  // 拿到传入数据
  const userinfo = req.body
  // sql语句
  const sql = `select * from ev_users where userName=?`
  db.query(sql,userinfo.userName,(err,results) => {
    if(err) return res.cc(err)
    // 如果执行成功
    if(results.length !==1) return res.cc('登录失败,用户名错误')
    // 判断密码
    const compareResult = bcrypt.compareSync(userinfo.passWord,results[0].passWord)
    if(!compareResult) return res.cc('登录失败,密码错误')
    // 生存Token
    const user = {...results[0]}
    const tokenStr = jwt.sign(user,config.jwtSecreKey,{ expiresIn: config.expiresIn })
    res.send({
      status:0,
      message:'登录成功',
      data:{
        userName: results[0].userName,
        passWord: results[0].passWord
      },
      token: 'Bearer ' + tokenStr
    })
  })
}
// 验证码
exports.verify = (req,res) => {
  const info = req.body
  res.send({status:0,verify:'1234',phone:info.code})
}
// 权限管理
exports.authAdmin = (req,res) => {
  const inFo = req.query
  const num = inFo.pageNum - 1
  let countSql = ``
  const data = {}
  let sql = ``
  if(!num) {
    sql = `SELECT * FROM userlist limit ${inFo.pageSize} ;`
    countSql = `SELECT count(id) AS total FROM userlist;`
  }else {
    sql = `SELECT * FROM userlist limit ${num * 10 - 1},${inFo.pageSize} ;`
    countSql = `SELECT count(id) AS total FROM userlist;`
  }
  db.query(countSql,(err,results) => {
    if(err) return res.cc(err)
    data.total = results[0].total
  })
  // 如果不设置定时器有可能total无法挂载上原因可能为异步任务且统计数量sql语句执行较慢
  function a() {
    db.query(sql,(err,results) => {
      if (err) return res.cc(err)
      data.list = results
      res.send(data)
    })
  }
setTimeout(a,5)
}
// 新增权限
exports.menuList = (req,res) => {
  // 获取传入数据
  const menuInfo = req.body
  // 插入语句
  const insertSql = 'insert into menu set ?'
  if(!menuInfo.permissions) return res.cc('无法接收到权限ID')
  if(!menuInfo.name) return res.cc('无法接收到名称')
  if(!menuInfo.permissionsName) return res.cc('无法接收权限名称')
    // 拿到时间戳
  let time = Date.now()
  db.query(insertSql,{permissions: menuInfo.permissions,name: menuInfo.name,permissionsName: menuInfo.permissionsName,time: time},(err,results) => {
    if(err) return res.cc(err)
      if(results.affectedRows !==1){
        return res.cc('插入失败')
      }
      res.send({status:0,message:'插入成功'})
  })
}
// 查询权限
exports.list = (req,res) => {
  const inFo = req.query
  const num = inFo.pageNum - 1
  let countSql = ``
  const data = {}
  let sql = ``
  if(!num) {
    sql = `SELECT * FROM menu limit ${inFo.pageSize} ;`
    countSql = `SELECT count(id) AS total FROM menu;`
  }else {
    sql = `SELECT * FROM menu limit ${num * 10 - 1},${inFo.pageSize} ;`
    countSql = `SELECT count(id) AS total FROM menu;`
  }
  db.query(countSql,(err,results) => {
    if(err) return res.cc(err)
    data.total = results[0].total
  })
  // 如果不设置定时器有可能total无法挂载上原因可能为异步任务且统计数量sql语句执行较慢
  function a() {
    db.query(sql,(err,results) => {
      if (err) return res.cc(err)
      data.list = results
      res.send(data)
    })
  }
setTimeout(a,5)
}
// 获得权限列表
exports.getList = (req,res) => {
  const sql = 'select id,name from menu'
  db.query(sql,(err,results) => {
    if (err) return res.cc(err)
    const data = {}
    data.list = results
    res.send(data)
  })
}
// 修改用户昵称以及权限
exports.setUserList = (req,res) => {
  const userinfo = req.body
  let time = Date.now()
  const insert = 'insert into userlist set ?'
  const sql = 'update userlist set nicheng = ?,name = ?,time = ? where id = ?;'
  if (userinfo.insert) {
    db.query(insert, { nicheng: userinfo.nicheng, name: userinfo.name, phone: userinfo.phone,time: time }, (err, results) => {
      if (err) return res.cc(err)
        if(results.affectedRows !==1){
          return res.cc('插入失败')
        }
        res.send({status:0,message:'插入成功'})
    })
  } else {
    db.query(sql,[userinfo.nicheng,userinfo.name,time,userinfo.id],(err,results) => {
      if (err) return res.cc(err)
      if(results.affectedRows !==1){
        return res.cc('插入失败')
      }
      res.send({status:0,message:'插入成功'})
    })
  }
}
// 用户权限实现
exports.userLogin = (req,res) => {
  const userinfo = req.body
  const sql = 'select name from userlist where phone = ?'
  // 获取权限名称
  db.query(sql,userinfo.phone,(err,results) => {
    if(err) return res.cc(err)
    let [{name}] = results
    const sql_2 = 'select permissions from menu where name = ?'
// 根据权限名称获取权限
    db.query(sql_2,name,(err,results) => {
      if(err) return res.cc(err)
      const permissions = JSON.parse(results[0].permissions)
      res.send(permissions)
    })
  })
}
// 仅修改昵称
exports.nicheng = (req,res) => {
  const userinfo = req.body
  const sql = 'update userlist set nicheng = ? where phone = ?;'
  db.query(sql,[userinfo.nicheng,userinfo.phone],(err,results) => {
    if(err) return res.cc(err)
    if(results.affectedRows == 1) {
      res.send({status:0,message: '修改成功'})
    }else {
      res.send({status:1,message: '修改失败'})
    }
  })
}
// 新增陪诊师
exports.addPzs = (req,res) => {
  const userinfo = req.body
  const insertSql = 'insert into pzs_list set ?'
  db.query(insertSql,{ phone: userinfo.phone,name: userinfo.name,sex: userinfo.sex,age: userinfo.age,avatar: userinfo.avatar,active: userinfo.active },
    (err,results) => {
      if(err) return res.cc(err)
      if(results.affectedRows !==1){
        return res.cc('插入失败')
      }
      res.send({status:0,message:'插入成功'})
    }
  )
}
// 查询陪诊师列表
exports.getPzsList = (req,res) => {
  const inFo = req.query
  const num = inFo.pageNum - 1
  let countSql = ``
  const data = {}
  let sql = ``
  if(!num) {
    sql = `SELECT * FROM pzs_list limit ${inFo.pageSize} ;`
    countSql = `SELECT count(id) AS total FROM pzs_list;`
  }else {
    sql = `SELECT * FROM pzs_list limit ${num * 10 - 1},${inFo.pageSize} ;`
    countSql = `SELECT count(id) AS total FROM pzs_list;`
  }
  db.query(countSql,(err,results) => {
    if(err) return res.cc(err)
    data.total = results[0].total
  })
  // 如果不设置定时器有可能total无法挂载上原因可能为异步任务且统计数量sql语句执行较慢
  function a() {
    db.query(sql,(err,results) => {
      if (err) return res.cc(err)
      data.list = results
      res.send(data)
    })
  }
setTimeout(a,5)
}
// 更新陪诊师信息
exports.setPzs = (req,res) => {
  const userinfo = req.body
  const sql = 'update pzs_list set phone = ?,name = ?, sex = ?,age = ?,avatar = ?,active =? where id = ?;'
  db.query(sql,[userinfo.phone,userinfo.name,userinfo.sex,userinfo.age,userinfo.avatar,userinfo.active,userinfo.id],(err,results) => {
    if(err) return res.cc(err)
    if(results.affectedRows == 1) {
      res.send({status:0,message: '修改成功'})
    }else {
      res.send({status:1,message: '修改失败'})
    }
  })
}
// 删除所选内容
exports.deletePzs = (req,res) => {
  const userinfo = req.body
  const id = userinfo.id.join()
  const sql = 'delete from pzs_list where id in (?)'
  db.query(sql,id,(err,results) => {
    if(err) return res.cc(err)
    if(results.affectedRows == 1) {
      res.send({status:0,message: '删除成功'})
    }else {
      res.send({status:1,message: '删除失败'})
    }
  })
}
// 获取医院列表
exports.getHospitals = (req,res) => {
  const sql = 'select * from hospitals'
  db.query(sql,(err,results) => {
    if(err) return res.cc(err)
    const data = {}
    data.list = results
    res.send(data)
  })
}
// 获取订单有关数据
exports.getOrderInfo = (req,res) => {
  const sqlHospitals = 'select * from hospitals'
  const sqlPzs = 'select id,name from pzs_list where active = 1'
  const data = {}
  let list = []
  // 获取医院数据
    db.query(sqlHospitals,(err,results) => {
      if(err) return res.cc(err)
      data.hospitals = results
    })
    db.query('select name as text,id as value from hospitals',(err,results) => {
      if(err) return res.cc(err)
      list = results
    })
    function fun() {
      db.query(sqlPzs,(err,results) => {
        if(err) return res.cc(err)
        data.pzs_list = results
        res.send({status: 0,data,list})
      })
    }
    setTimeout(fun,15)
  
}
// 新增订单数据
exports.postDd = (req, res) => {
  const ddinfo = req.body
  console.log(ddinfo);
  const sql = 'insert into dd set ?'
  db.query(sql, { serve: ddinfo.serve, hospitalsName: ddinfo.hospitalsName, phone: ddinfo.phone, dz: ddinfo.dz, pzs: ddinfo.pzs, nowTime: ddinfo.nowTime, beizhu: ddinfo.beizhu,price: ddinfo.price }, (err, results) => {
    if (err) return res.cc(err)
    if(results.affectedRows !==1){
      return res.cc('新增失败')
    }
    res.send({status:0,message:'新增成功'})
  })
}
// 查询订单数据
exports.getDd = (req, res) => {
  const active = req.query.active
  const sql = 'select * from dd where active = ?'
  const sqlAll = 'select * from dd where active !=4 order by active'
  if (active == '0') {
    db.query(sqlAll, (err, results) => {
      if (err) return res.cc(err)
      res.send({status: 0, dd: results})
    })
  }else if (active > 0 && active <= 4) {
    db.query(sql, active, (err, results) => {
      if (err) return res.cc(err)
      res.send({status: 0, dd: results})
    })
  } else {
    res.cc('查询失败')
  }
}