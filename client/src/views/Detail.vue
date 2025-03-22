<template>
  <NavBar />
  <div class="container">
    <n-h1>{{ blogInfo.title }}</n-h1>
    <div class="article-content" v-html="blogInfo.content"></div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import { onMounted, reactive, inject } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
let blogInfo = reactive({})
const axios = inject("axios")

onMounted(async () => {
  const res = await axios.get("blog/detail?id="+route.query.id);
  const resData = res.data.rows[0]
  blogInfo.id = resData.id
  blogInfo.category_id = resData.category_id
  blogInfo.title = resData.title
  blogInfo.content = resData.content
  blogInfo.create_time = resData.create_time
  console.log(blogInfo);  
})
</script>

<style lang="scss" scoped>
.container {
  padding: 50px;
}
</style>