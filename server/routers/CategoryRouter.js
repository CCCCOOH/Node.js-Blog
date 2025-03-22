const express = require("express")
const router = express.Router();
// 引入数据库和雪花ID
const {
  db,
  genid
} = require("../db/DbUtils")

// 需求分析
/**
 * 添加接口
 * 修改接口
 * 删除接口
 * 列表接口
 */

// 列表接口
router.get("/list", async (req, res) => {
  let search_sql = "SELECT * FROM `category`"
  
  let {
    err,
    rows
  } = await db.async.all(search_sql, [])

  if (err == null) {
    // 没有错误 ✅
    res.send({
      code: 200,
      msg: "查询成功",
      rows
    })
  } else {
    // 报大错 ❌
    res.send({
      code: 500,
      msg: "查询失败"
    })
  }
})

// 添加接口 传入 name
router.post("/_token/add", async (req, res) => {
  let {
    name
  } = req.body;
  const id = genid.NextId();
  const inser_sql = "INSERT INTO `category` (`id`, `name`) VALUES (?, ?)";
  const { err } = await db.async.run(inser_sql, [id, name])

  if (err == null) {
    // 执行成功✅
    res.send({
      code: 200,
      msg: "添加成功"
    })
  } else {
    // 执行失败❌
    res.send({
      code: 500,
      msg: "添加失败"
    })
  }
})

// 修改接口 传入 id, name
router.put("/_token/update", async (req, res) => {
  // let { token } = req.headers;

  // let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?";
  // let adminResult = await db.async.all(admin_token_sql, [token])
  // if (adminResult.err != null || adminResult.rows.length == 0) {
  //   return res.send({
  //     code: 403,
  //     msg: "请先登录"
  //   })
  // }
  
  let { id,name } = req.body

  const update_sql = "UPDATE `category` SET `name` = ? WHERE `id` = ?"
  let {
    err,
    rows
  } = await db.async.run(update_sql, [name, id])
  
  if (err == null) {
    // ✅
    res.send({
      code: 200,
      msg: "修改成功"
    })
  } else {
    // ❌
    res.send({
      code: 500,
      msg: "修改失败"
    })
  }
})

// 删除接口 传入 id
router.delete("/_token/delete", async (req, res) => {
  let id = req.query.id // 直接写URL：category/delete?id=xxx
  const delete_sql = "DELETE FROM `category` WHERE `id` = ?"
  let {
    err,
    rows
  } = await db.async.run(delete_sql, [id])

  if (err == null) {
    // ✅
    res.send({
      code: 200,
      msg: "删除成功"
    })
  } else {
    // ❌
    res.send({
      code: 500,
      msg: "删除失败"
    })
  }
})


module.exports = router;