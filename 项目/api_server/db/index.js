const mysql2 = require('mysql2')

const db = mysql2.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'ma100395',
  database:'my_db_01'
})

module.exports = db