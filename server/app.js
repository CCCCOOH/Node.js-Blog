const express = require("express")
const multer = require("multer")  // 上传
const path = require("path")

// 创建后端应用实例
const app = express()
app.use(express.json())
const port = 8080;  // 端口
// multer, sqlite3, uuid 三者是需要安装的模块...

// 开放/处理跨域请求
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS")
    // 跨域允许的请求方法
    if (req.method == "OPTIONS") res.sendStatus(200);
    else next();
})

// 指定上传的临时目录
const update = multer({
  dest:"./public/upload/temp"
})
app.use(update.any())
// 指定静态文件路径
app.use(express.static(path.join(__dirname, "public")))

// 注册路由
app.use("/test", require("./routers/TestRouter"))
app.use("/admin", require("./routers/AdminRouter"))
app.use("/category", require("./routers/CategoryRouter"))
app.use("/blog", require("./routers/BlogRouter"))
app.use("/upload", require("./routers/UploadRouter"))

// 路由
app.get("/", (req, res) => {
  res.send("Hello World!");
})

// 回调为运行成功后执行的函数...
app.listen(port, () => {
  console.log(`启动成功：http:localhost:${port}`);
})