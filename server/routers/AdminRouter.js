const express = require("express")
const router = express.Router();
const {v4:uuidv4} = require("uuid") // node uuid
// 引入数据库和雪花ID
const {db, genid} = require("../db/DbUtils")

router.post("/login", async (req, res) => {
  let { account, password } = req.body
  let { err, rows } = await db.async.all("select * from `admin` where `account` = ? AND `password` = ?", [account, password])

  if (err == null && rows.length > 0) {  // ✅没有空说明没有没有错误
    // 开始生成token

    let login_token = uuidv4();
    let update_token_sql = "UPDATE `admin` SET `token` = ? where `id` = ?";

    await db.async.run(update_token_sql, [login_token, rows[0].id]) // 更新当前用户的登录token

    // 返还给前端的数据
    let admin_info = rows[0]
    admin_info.token = login_token
    admin_info.password = "密码包不让你看的..."
    
    res.send({
      code: 200,
      msg: "登录成功",
      data: admin_info
    })
  } else {  // ❌有错误
    res.send({
      code: 500,
      msg: "登录失败",
    })
  }

})

module.exports = router;