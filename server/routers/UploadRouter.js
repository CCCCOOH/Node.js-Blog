const express = require("express")
const router = express.Router();
// 引入数据库和雪花ID
const fs = require("fs")
const {
  db,
  genid
} = require("../db/DbUtils");

router.post("/rich_editor_upload", async (req, res) => {
  if (!req.files) {
    return res.send({
      "errno": 1, // 只要不等于 0 就行
      "message": "失败信息"
    })
  }
  
  let files = req.files;
  let ret_files = [];

  for (let file of files) {
    // 获取文件名字后缀
    let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1); // 找到第一个.裁剪
    // 新起的名字
    let file_name = genid.NextId() + "." + file_ext
    console.log(file, file_name);
    
    // 修改名字加移动文件 process.cwd()为程序运行的路径
    fs.renameSync(
      process.cwd() + "/public/upload/temp/" + file.filename,
      process.cwd() + "/public/upload/" + file_name
    )
    ret_files.push(file_name)
  }
  res.send({
    "errno": 0, // 注意：值是数字，不能是字符串
    "data": {
      "url": ret_files[0], // 图片 src ，必须 返回的路径为服务端能访问的路径
    }
  })
})

module.exports = router;