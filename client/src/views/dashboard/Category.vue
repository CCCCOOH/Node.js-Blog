<template>
  <div class="main">
    <n-button @click="showAddModal = true">添加分类</n-button>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>分类ID</th>
          <th>分类名</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="uuid()">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>
            <n-space>
              <n-button @click="prepareUpdate(category)">修改</n-button>
              <n-button @click="deleteCategory(category)">删除</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>

    <!-- 添加分类模态框 -->
    <n-modal v-model:show="showAddModal">
      <n-card style="width: 600px" title="添加 Category" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-input placeholder="输入待添加的分类..." type="text" v-model:value="newCategory"></n-input>
        <template #action>
          <n-button @click="add">提交</n-button>
        </template>
      </n-card>
    </n-modal>  
    <!-- 修改分类模态框 -->
    <n-modal v-model:show="showUpdateModal">
      <n-card style="width: 600px" title="修改分类" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-input placeholder="输入新的分类名..." type="text" v-model:value="updateCategoryObj.name"></n-input>
        <template #action>
          <n-button @click="updateCategory()">提交</n-button>
        </template>
      </n-card>
    </n-modal>  
  </div>
</template>

<script setup>
import { inject, onMounted, reactive, ref } from 'vue';
import { AdminStore } from '../../stores/AdminStore'

const adminStore = AdminStore();

const axios = inject("axios")
const uuid = inject("uuid")
const message = inject("message")
const dialog = inject("dialog")
const categories = ref([])
const showAddModal = ref(false);
const showUpdateModal = ref(false);
const newCategory = ref("")
const updateCategoryObj = reactive({
  id: null,
  name: ''
})

// 重新请求和刷新数据
const loadDatas = async () => {
  let res = await axios.get('category/list');
  if (res.data.code == 200) {
    categories.value = res.data.rows;
  } else {
    message.error(res.data.msg)
  }
}

// 加载视图时加载数据
onMounted(async () => {
  loadDatas();
})

// 准备修改分类
function prepareUpdate(category) {
  showUpdateModal.value = true;
  updateCategoryObj.id = category.id;
  updateCategoryObj.name = category.name;
}

// 修改分类
async function updateCategory() {
  const res = await axios.put("category/_token/update", {
    id: updateCategoryObj.id,
    name: updateCategoryObj.name
  })
  if (res.data.code == 200) {
    // ✅请求成功
    message.success(res.data.msg)
  } else {
    // 请求失败
    message.error(res.data.msg)
  }
  updateCategoryObj.name = ''
  showUpdateModal.value = false
  loadDatas()
}

// 添加分类
async function add() {
  const res = await axios.post('category/_token/add', { name: newCategory.value })
  if (res.data.code == 200) {
    message.success(res.data.msg)
    loadDatas();
  } else {
    message.error(res.data.msg)
  }

  showAddModal.value = false
  newCategory.value = '';
}

// 删除分类
const deleteCategory = async (category) => {
  await dialog.warning({
    title: '警告',
    content: '你确定要删除该分类吗?',
    positiveText: '确定',
    negativeText: '不确定',
    draggable: true,
    onPositiveClick: async () => {
      const res = await axios.delete(`category/_token/delete?id=${category.id}`)
      if (res.data.code == 200) {
        message.success(res.data.msg)
        loadDatas();
      } else {
        message.error(res.data.msg)
      }
    },
  })

}

</script>

<style lang="scss" scoped>
.main {
  padding: 5px;
  height: 100%;
  overflow: auto;
}
</style>