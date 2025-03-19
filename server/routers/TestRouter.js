const express = require("express")
const router = express.Router();
// 引入数据库和雪花ID
const {db, genid} = require("../db/DbUtils")

router.get("/test", async (req, res) => {
  let out = await db.async.all("select * from `admin`", [])

  res.send({
    id:genid.NextId(),
    out
  })
})

module.exports = router;