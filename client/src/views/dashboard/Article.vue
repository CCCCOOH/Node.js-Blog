<template>
  <n-tabs class="tabs" v-model:value="tabValue" justify-content="start" type="line"
    style="width: 100%; height: 100%; overflow: auto;">
    <n-tab-pane name="list" tab="文章列表">
      <n-space vertical>
        <n-space vertical>
          <template v-for="blog in blogListInfo" :key="blog.id">
            <n-card :title="blog.title">
              {{ blog.content }}
              <template #footer>
                <n-space align="center">
                  <span>发布时间:</span>{{ blog.create_time }}
                  <n-button type="tertiary" size="small" @click="toUpdate(blog)">修改</n-button>
                  <n-button type="tertiary" size="small">删除</n-button>
                </n-space>
              </template>
            </n-card>
          </template>
        </n-space>
        <n-space>
          <n-button @click="toPage(page)" v-for="page in pageInfo.pageCount">
              <div :style="'color:'+ (page == pageInfo.page ? 'green' : 'black')">
                {{ page }}
              </div>
          </n-button>
        </n-space>
      </n-space>
    </n-tab-pane>

    <!-- 添加文章 -->
    <n-tab-pane name="add" tab="添加文章">
      <n-form>
        <n-form-item label="文章标题">
          <n-input v-model:value="addArticle.title" @keydown.enter.prevent placeholder="请输入标题..." />
        </n-form-item>
        <n-form-item label="文章分类">
          <n-select v-model:value="addArticle.categoryId" :options="categoryOptions" />
        </n-form-item>
        <n-form-item label="文章内容">
          <div class="editor">
            <RichTextEditor v-model="addArticle.content" />
          </div>
        </n-form-item>
        <n-form-item>
          <n-button @click="add">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
    <!-- 修改文章 -->
    <n-tab-pane name="update" tab="修改文章">
      <n-form>
        <n-form-item label="文章标题">
          <n-input v-model:value="updateArticle.title" @keydown.enter.prevent placeholder="请输入标题..." />
        </n-form-item>
        <n-form-item label="文章分类">
          <n-select v-model:value="updateArticle.categoryId" :options="categoryOptions" />
        </n-form-item>
        <n-form-item label="文章内容">
          <div class="editor">
            <RichTextEditor v-model="updateArticle.content" />
          </div>
        </n-form-item>
        <n-form-item>
          <n-button @click="add">更新</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
   
  </n-tabs>
</template>

<script setup>
import { inject, onMounted, reactive, ref } from 'vue';
import RichTextEditor from '../../components/RichTextEditor.vue';

const message = inject("message")
const axios = inject("axios")

const blogListInfo = ref([])
const addArticle = reactive({
  title: "",
  content: "",
  categoryId: 0
})
const updateArticle = reactive({
  title: "",
  content: "",
  categoryId: 0,
  id: 0
})
const categoryOptions = ref([])
const pageInfo = reactive({
  page: 1,  // 当前页码
  pageSize: 4,  // 每页文章数量
  pageCount: 0, // 总页数
  count: 0  // 文章总数
})
const tabValue = ref('list')

onMounted(() => {
  loadCategories();
  loadBlogs();
})

const toUpdate = async (blog) => {
  tabValue.value = 'update';
  updateArticle.id = blog.id;
  updateArticle.title = blog.title;
  updateArticle.content = blog.content;
  updateArticle.categoryId = blog.categoryId;
}

const toPage = async (pageNum) => {
  pageInfo.page = pageNum;
  loadBlogs();
}

const loadBlogs = async () => {
  let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`);
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

const loadCategories = async () => {
  let res = await axios.get('category/list');
  if (res.data.code == 200) {
    categoryOptions.value = res.data.rows.map(item => ({
      label: item.name,
      value: item.id
    }))
  } else {
    alert("读取分类失败!")
  }
}

const add = async () => {
  const res = await axios.post('blog/_token/add', addArticle)
  if (res.data.code == 200) {
    message.success(res.data.msg)
    addArticle.title = ''
    addArticle.content = ''
    addArticle.id = ''
  } else {
    message.error(res.data.msg)
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  padding: 20px;
}
</style>