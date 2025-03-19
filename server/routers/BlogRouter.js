const express = require("express")
const router = express.Router();
// 引入数据库和雪花ID
const {
  db,
  genid
} = require("../db/DbUtils")

// 需求分析
/**
 * 添加博客
 * 修改博客
 * 删除博客
 * 查询博客 
 */

// 查询接口
router.get("/search", async (req, res) => {
  /**
   * keyword 关键字
   * categoryId 分类编号
   * 
   * 分页: 
   * page 页码
   * pageSize 分页大小
   */

  let {
    keyword,
    categoryId,
    page,
    pageSize
  } = req.query;

  // 如果没有传入page
  page = page == null ? 1 : page;
  pageSize = pageSize == null ? 10 : pageSize;
  categoryId = categoryId == null ? 0 : categoryId
  keyword = keyword == null ? "" : keyword

  let whereSqls = []
  let params = []
  if (categoryId != 0) {
    // 传入了categoryID ✅
    whereSqls.push(" `category_id` = ? ");
    params.push(categoryId)
  }
  if (keyword != "") {
    // 传入看keyword ✅
    // 增加一个模糊查询的sql命令
    whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?) ")
    params.push("%" + keyword + "%")
    params.push("%" + keyword + "%")
  }

  // 根据模糊查询得到的条件来决定where语句
  let whereSqlStr = ""
  if (whereSqls.length > 0) {
    whereSqlStr = " WHERE " + whereSqls.join(" AND ");
  }

  
  // 查询分页数据
  let searchSql = " SELECT * FROM `blog` " + whereSqlStr + " ORDER BY `create_time` DESC LIMIT ?,?"
  let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize]) // 根据每页存放的文章数来决定取哪些
  
  // 查询数据总数
  let searchCount = " SELECT count(*) AS count FROM `blog` " + whereSqlStr;
  let searchCountParams = params
  
  let searchResult = await db.async.all(searchSql, searchSqlParams)
  let countResult = await db.async.all(searchCount, searchCountParams)


  if (searchResult.err == null && countResult.err == null) {
    return res.send({
      code: 200,
      msg: "查询成功",
      data: {
        keyword,
        categoryId,
        page,
        pageSize,
        rows: searchResult.rows,
        count: countResult.rows[0].count
      }
    })
  } else {
    return res.send({
      code: 500,
      msg: "查询失败"
    })
  }

})

// 添加博客
router.post("/add", async (req, res) => {
  let {
    title,
    categoryId,
    content
  } = req.body
  let id = genid.NextId();
  let create_time = new Date().getTime();

  const insert_sql = "INSERT INTO `blog` (`id`, `title`, `category_id`, `content`, `create_time`) VALUES (?,?,?,?,?)"
  let params = [id, title, categoryId, content, create_time]
  const {
    err,
    rows
  } = await db.async.run(insert_sql, params)

  if (err == null) {
    // 如果没有错误，表示正确✅
    res.send({
      code: 200,
      msg: "添加成功",
    })
  } else {
    // 有错误❌
    res.send({
      code: 500,
      msg: "添加失败"
    })
  }
})

// 修改博客
router.put("/update", async (req, res) => {
  let {
    title,
    categoryId,
    content,
    id
  } = req.body

  const update_sql = "UPDATE `blog` SET `title` = ?, `content` = ?, `category_id` = ? WHERE `id` = ?"
  let params = [title, content, categoryId, id]
  const {
    err,
    rows
  } = await db.async.run(update_sql, params)

  if (err == null) {
    // 如果没有错误，表示正确✅
    res.send({
      code: 200,
      msg: "修改成功",
    })
  } else {
    // 有错误❌
    res.send({
      code: 500,
      msg: "修改失败"
    })
  }
})

// 删除接口 传入 id
router.delete("/delete", async (req, res) => {
  let id = req.query.id // 直接写URL：category/delete?id=xxx
  const delete_sql = "DELETE FROM `blog` WHERE `id` = ?"
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