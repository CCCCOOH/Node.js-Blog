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
router.post("/add", async (req, res) => {
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
router.put("/update", async (req, res) => {
  let {
    id,
    name
  } = req.body
  const update_sql = "UPDATE `category` SET `name` = ? WHERE `id` = ?"
  let {
    err,
    rows
  } = await db.async.run(update_sql, [name, id])
  console.log("修改category收到的id,name: ", id, name);
  
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
router.delete("/delete", async (req, res) => {
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