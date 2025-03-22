<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
      />
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
        @customAlert="customAlert"
        @onChange="handleChange"
      />
    </div>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { onBeforeUnmount, ref, shallowRef, defineComponent, inject } from 'vue';

const editorRef = shallowRef();
defineComponent(['Editor', 'Toolbar'])
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

// 上传图片
const server_url = inject("server_url")
const editorConfig = { placeholder: '请输入内容...' };
editorConfig.MENU_CONF = {};
editorConfig.MENU_CONF['uploadImage'] = {
  server: server_url + '/upload/rich_editor_upload',
  // 小于该值就插入 base64 格式（而不上传），默认为 0
  base64LimitSize: 10 * 1024, // 5kb
}


// 插入图片
editorConfig.MENU_CONF['insertImage'] = {
  parseImageSrc: (src) => {
    console.log(src);
    if (src.indexOf("http") !== 0) {
      return `${server_url}/${src}`
    }
    return src;
  }
}

const mode = ref("default")
const emit = defineEmits(['update:modelValue'])


// 内容 HTML
const valueHtml = ref('');

const toolbarConfig = {};
// 删除上传视频功能
toolbarConfig.excludeKeys = [
  'uploadVideo',
]


// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const customAlert = (info, type) => {
  alert(`【自定义提示】${type} - ${info}`);
};

const handleChange = (editor) => {
  emit('update:modelValue', valueHtml.value)
}
</script>
