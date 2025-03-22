import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import { createPinia } from 'pinia'
import { router } from "./common/router"
import axios from 'axios'
import { AdminStore } from './stores/AdminStore'
import { v4 as uuidv4 } from 'uuid';
import { createDiscreteApi, darkTheme, lightTheme } from "naive-ui";
/**
 * 模块：
 * axios
 * pinia
 * sass
 * >> 下方的可能有版本区别
 * vue-router
 * naive-ui
 * wang-editor
 */
const app = createApp(App)

// 全局安装UI组件，请别把插件的代码写use这个插件之前
app.use(naive)
app.use(createPinia())
app.use(router)

const { message, notification, dialog } = createDiscreteApi(["message", "dialog", "notification"]);

const adminStore = AdminStore();

// 请求头拦截器: 每一个请求都会先执行这个请求头的设置
axios.interceptors.request.use((config) => {
  config.headers.token = adminStore.token;
  return config;
})


// 将message注入全局

app.provide("axios", axios)
app.provide("uuid", uuidv4)
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)


// 配置全局URL
axios.defaults.baseURL = "http://localhost:8080"

app.mount('#app')
