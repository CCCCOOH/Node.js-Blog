<template>
  <div class="container">
    <!-- 导航栏 -->
    <NavBar />
    <!-- 查询框 -->
     <n-space justify="center" class="search">
      <n-input style="min-width: 400px;" round  v-model:value="pageInfo.keyword"></n-input>
      <n-button round ghost @click="loadBlogs(0)">搜索</n-button>
     </n-space>
    <!-- 文章内容 -->
    <div class="article-list">
      <!-- 文章列表模块 -->
      <n-space vertical>
        <n-space vertical>
          <n-space vertical>
            <template v-for="blog in blogListInfo" :key="blog.id">
              <n-card :title="blog.title" @click="toDetail(blog)" hoverable style="cursor: pointer">
                {{ blog.content }}
                <template #footer>
                  <n-space align="center">
                    <span>发布时间:</span>{{ blog.create_time }}
                  </n-space>
                </template>
              </n-card>
            </template>
          </n-space>
        </n-space>
        <!-- 分页模块 -->
        <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />
      </n-space>
    </div>
   
  </div>
</template>








<script setup>
import { inject, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue';
const router = useRouter();

const blogListInfo = ref([])
const axios = inject("axios")
const pageInfo = reactive({
  page: 1,  // 当前页码
  pageSize: 4,  // 每页文章数量
  pageCount: 0, // 总页数
  count: 0,  // 文章总数
  keyword: ''
})

onMounted(() => {
  loadBlogs();
})

// 刷新文章
const loadBlogs = async (page = 0) => {
  if (page != 0) {
    pageInfo.page = page
  }
  
  let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&keyword=${pageInfo.keyword}`);
  const tem_rows = res.data.data.rows
  for (let row of tem_rows) {
    row.content += '...'
    let time = new Date(row.create_time)

    row.create_time = `${time.getFullYear()}年${time.getMonth()}月${time.getDate()}日`
  }
  blogListInfo.value = tem_rows
  pageInfo.count = res.data.data.count
  pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize)
}

// 跳转到特定的文章
const toDetail = async (blog) => {
  router.push({path: "/detail", query: {
    id: blog.id
  }})
}
</script>













<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
.article-list {
  padding: 20px;
}

.search {
  margin-top: 30px;
}
</style>