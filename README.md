# Vue+Express框架搭建的前后端分离博客平台

> 如需本地部署请自行npm install补全依赖，并在`server/db`下添加`blog.sqlite3`数据库文件。

## 项目功能：
- 首页文章查询
- 分页功能以及实现
- 后台分类、文章的管理功能（包含增删改查）
- 登录鉴权功能
- 通过后端接受关键词API实现用户文章的模糊查询
- 支持图片上传（由WangEditor项目提供技术支持）

## 项目预览：
- 首页 URL：`/`

![20250323013815](https://ccccooh.oss-cn-hangzhou.aliyuncs.com/img/20250323013815.png)

- 登录页面 `/login`

![20250323013841](https://ccccooh.oss-cn-hangzhou.aliyuncs.com/img/20250323013841.png)

- 后台面板/文章列表视图 `/dashboard/article`

![20250323013901](https://ccccooh.oss-cn-hangzhou.aliyuncs.com/img/20250323013901.png)

- 后台面板/添加文章视图 `/dashboard/article`

![20250323013947](https://ccccooh.oss-cn-hangzhou.aliyuncs.com/img/20250323013947.png)

> 修改文章类似

- 文章分类列表视图 `/dashboard/category`

![20250323014016](https://ccccooh.oss-cn-hangzhou.aliyuncs.com/img/20250323014016.png)

- 文章详细页视图 `detail`
![20250323014040](https://ccccooh.oss-cn-hangzhou.aliyuncs.com/img/20250323014040.png)

## 运行方式：

通过`git clone xxx`拉取本仓库代码，分别进入`server`、`client`文件夹通过`npm install`安装依赖文件。

服务端启动方式：在`server`目录：
```sh
node app.js
```

客户端启动方式：在`client`目录：
```sh
npm run dev
```

## 项目技术结构：

前端：
```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@wangeditor/editor-for-vue": "^5.1.12",
    "axios": "^1.8.4",
    "pinia": "^3.0.1",
    "sass": "^1.86.0",
    "uuid": "^11.1.0",
    "vue": "^3.5.13",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "naive-ui": "^2.41.0",
    "vfonts": "^0.0.3",
    "vite": "^6.2.0"
  }
}
```

后端：
```json
{
  "dependencies": {
    "express": "^4.21.2",
    "multer": "^1.4.5-lts.1",
    "sqlite3": "^5.1.7",
    "uuid": "^11.1.0"
  }
}
```

除此之外还用到了❄️雪花ID的源代码，位于`server/utils/SnowFlake.js`中。

该仓库的地址在Gitee可以搜到：[多语言雪花算法❄️](https://gitee.com/yitter/idgenerator)。