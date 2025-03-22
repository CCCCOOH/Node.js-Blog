<template>
  <!-- 导航栏 -->
  <ul class="nav">
    <li @click="toHome">首页</li>
    <li v-if="!isLogin" @click="toDashboard">后台</li>
  </ul>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter();
const toDashboard = () => {
  router.push("/login")
}
const toHome = () => {
  router.push("/")
}

// 是否有后台选项
const props = defineProps(['isLogin'])
</script>

<style lang="scss" scoped>
.nav {
  width: 100%;
  padding: 15px 80px;
  display: flex;
  justify-content: start;
  padding-top: 20px;
  font-size: 20px;
  border-bottom: 1px solid rgba(172, 172, 172, 0.296);
  box-shadow: 0 0 5px rgb(191, 191, 191);
  list-style-type: none;

  li {
    margin: 0 15px;
    cursor: pointer;
    transition: all .1s ease;

    &:hover {
      color: green;
      text-decoration: underline;
      text-underline-offset: .5em;
    }
  }
}
</style>