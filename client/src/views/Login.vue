<template>
    <NavBar isLogin="true"/>
    <div class="login-panel">
      <n-card title="登录后台" :segmented="{
        content: true,
        footer: 'soft'
      }">

        <n-form :rules="rules" :model="admin">
          <n-form-item path="account" label="账号">
            <n-input placeholder="请输入账号..." v-model:value="admin.account"></n-input>
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input type="password" placeholder="请输入密码..." v-model:value="admin.password"></n-input>
          </n-form-item>
        </n-form>
        
        <template #footer>
          <n-checkbox label="记住我" v-model:checked="admin.rember"></n-checkbox>
          <n-button @click="login">登录</n-button>
        </template>

      </n-card>
    </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { AdminStore } from '../stores/AdminStore';
import NavBar from '../components/NavBar.vue';

// 引入路由
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const axios = inject("axios");
const message = inject("message")
const adminStore = AdminStore();



let rules = {
  account: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 12, message: "账号长度在 3 到 12 个字符范围", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度在 3 到 12 个字符范围", trigger: "blur" }
  ]
}
const admin = reactive({
  account: localStorage.account && localStorage.rember === "true" ? localStorage.account : "",
  password: localStorage.password && localStorage.rember === "true" ? localStorage.password : "",
  rember: localStorage.rember === 'true'
})



async function login() {
  const account = admin.account;
  const password = admin.password;

  const result = await axios.post("admin/login", { account, password })

  if (result.data.code == 500) {
    message.error("请输入正确的账号密码...");
  } else if (result.data.code == 200) {
    adminStore.account = result.data.data.account;
    adminStore.token = result.data.data.token;
    adminStore.id = result.data.data.id;
    message.info("登录成功, 祝你有美好的一天！")

    if (admin.rember) {
      localStorage.account = admin.account;
      localStorage.password = admin.password;
    }
    localStorage.rember = admin.rember; // 无论是否记住都判断，否则会导致在不记住的时候不更新该状态
    router.push("/dashboard/article")
  }

}
</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>