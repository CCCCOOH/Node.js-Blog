// 搭建数据库部分
const sqlite3 = require("sqlite3").verbose();
const GenId = require("../utils/SnowFlake");
const path = require("path")

// 创建数据库对象
var db = new sqlite3.Database(path.join(__dirname, "blog.sqlite3"))
const genid = new GenId({
  WorkerId: 1
}); // WorkerId 表示机器码，防止多台服务器部署出错.

// 将db.add封装为一个Promise来优化可读性
db.async = {}

// 数据库查询的封装
db.async.all = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      resolve({
        err,
        rows
      })
    })
  })
}

// 封装数据库的修改和添加
db.async.run = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err, rows) => {
      resolve({
        err,
        rows
      })
    })
  })
}

module.exports = {
  db,
  genid
}