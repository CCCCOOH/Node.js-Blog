<template>
    <div class="main-panel">
      <div class="title">SyoOo后台管理系统</div>
      <ul class="menus">
        <li v-for="menu in menus" :key="uuid()" @click="toPage(menu)">
          {{ menu.name }}
        </li>
      </ul>

      <div class="content">
        <router-view></router-view>
      </div>      
    </div>
</template>

<script setup>
import { inject, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter();
const uuid = inject("uuid");


let menus = reactive([
  { name: "文章管理", href: "/dashboard/article" },
  { name: "文章分类", href: "/dashboard/category" },
  { name: "退出", href: "logout" },
])


const toPage = (menu) => {
  if (menu.href == 'logout') {
    // 退出登录
    router.push('/login');
  } else {
    router.push(menu.href);
  }
}
</script>

<style lang="scss" scoped>
.main-panel {
  width: 100vw;
  height: 100vh;
  display: flex;
  .content {
    width: 100%;
    height: 100%;
  }
}

.menus {
  user-select: none;
  transition: width .3s ease;
  list-style: none;
  color: white;
  background-color: #1B1B1F;
  width: 200px;
  display: flex;
  padding-top: 10%;
  justify-content: start;
  gap: 20px;
  align-items: center;
  flex-direction: column;
  li {
    font-size: 20px;
    width: 80%;
    text-align: center;
    display: flex;
    justify-content: center;
    padding:20px;
    border-radius: 5px;
    &:hover {
      background-color: #4d4d4d37;
      cursor: pointer;
    }
  }
}

@media screen and (max-width: 800px) {
  .title {
    visibility: hidden;
  }
  .menus {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// 水印
.title {
  position: absolute;
  color: #a1a1a1cf;
  font-size: 55px;
  font-weight: bold;
  right: 30px;
  bottom: 30px;
  user-select: none;
}

</style>