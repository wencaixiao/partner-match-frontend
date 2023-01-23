<!-- 搜索页面 -->
<template>
  <form action="/">

    <!--v-model 用于控制搜索框中的文字，background 可以自定义搜索框外部背景色。-->
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入要搜索的标签"
        @search="onSearch"
        @cancel="onCancel"
    />
    <!--onSearch点击搜索之后执行的事件，下面都定义了对应的函数-->
    <!--onCancel点击取消之后执行的事件，下面都定义了对应的函数-->
  </form>

  <!--分割线-->
  <van-divider content-position="left">已选标签</van-divider>

  <div v-if="activeIds.length === 0">请选择标签</div>  <!--activeIds没有内容才展示出来-->

  <!--有点像表格工具-->
  <van-row gutter="16" style="padding: 0 16px">  <!--activeIds标签内容挤在一起不好看，添加行间距-->
    <van-col v-for="tag in activeIds">  <!--将activeIds遍历展示出来-->
      <van-tag closeable size="small" type="primary" @close="doClose(tag)">  <!--点x就会调用这个方法移除这个标签-->
        {{ tag }}
      </van-tag>
    </van-col>
  </van-row>

  <!--分割线-->
  <van-divider content-position="left">选择标签</van-divider>

  <!--TreeSelect 分类选择，用于从一组相关联的数据集合中进行选择-->
  <!--active-id表示右侧选中项的id，支持传入数组-->
  <!--main-active-index表示左侧选中项的索引-->
  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
  />

  <!--搜索按钮，type表示按钮的类型-->
  <div style="padding: 12px">
    <!--doSearchResult给搜索按钮绑定一个事件，点击这个按钮就会执行这个函数-->
    <van-button block type="primary" @click="doSearchResult">搜索</van-button>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from "vue-router";

const router = useRouter()

const searchText = ref('');

// 这个其实是我们要从后台获取的
const originTagList = [
  {
    text: '方向',
    children: [
      {text: 'Java', id: 'Java'},
      {text: 'Python', id: 'Python'},
      {text: 'Python3', id: 'Python3'},
      {text: 'C', id: 'C'},
      {text: 'C++', id: 'C++'},
      {text: 'Go', id: 'Go'},
      {text: 'JavaScript', id: 'JavaScript'},
      {text: 'TypeScript', id: 'TypeScript'},
      {text: 'Scala', id: 'Scala'},
      {text: 'Kotlin', id: 'Kotlin'},
      {text: 'PHP', id: 'PHP'},
      {text: 'Swift', id: 'Swift'},
      {text: 'Ruby', id: 'Ruby'},
    ],
  },
  {
    text: '目标',
    children: [
      {text: '考研', id: '考研'},
      {text: '春招', id: '春招'},
      {text: '秋招', id: '秋招'},
      {text: '社招', id: '社招'},
      {text: '考公', id: '考公'},
      {text: '竞赛', id: '竞赛'},
      {text: '转行', id: '转行'},
      {text: '跳槽', id: '跳槽'},
    ],
  },
  {
    text: '身份',
    children: [
      {text: '小学', id: '小学'},
      {text: '初中', id: '初中'},
      {text: '高中', id: '高中'},
      {text: '大一', id: '大一'},
      {text: '大二', id: '大二'},
      {text: '大三', id: '大三'},
      {text: '大四', id: '大四'},
      {text: '研一', id: '研一'},
      {text: '研二', id: '研二'},
      {text: '研三', id: '研三'},
      {text: '待业', id: '待业'},
      {text: '工作', id: '工作'},
    ],
  },
  {
    text: '段位',
    children: [
      {text: '初级', id: '初级'},
      {text: '中级', id: '中级'},
      {text: '高级', id: '高级'},
      {text: '王者', id: '王者'},
    ],
  },
  {
  text: '性别',
  children: [
    {text: '男', id: '男'},
    {text: '女', id: '女'},
  ],
  },
  {
    text: '状态',
    children: [
      {text: '乐观', id: '乐观'},
      {text: '一般', id: '一般'},
      {text: '悲观', id: '悲观'},
      {text: '单身', id: '单身'},
      {text: '有对象', id: '有对象'},
      {text: '已婚', id: '已婚'},
    ],
  },
]

// 标签列表
let tagList = ref(originTagList);

/**
 * 搜索过滤
 * @param val
 */
const onSearch = (val) => {  // 点击搜索之后，从标签列表originTagList中进行过滤
  tagList.value = originTagList.map(parentTag => {  // 遍历originTagList的每个对象
    const tempChildren = [...parentTag.children];  // 取对象中的children属性
    const tempParentTag = {...parentTag};  // 取每一个对象
    // 再遍历一下parentTag.children，因为他是一个数组，过滤：如果每一项parentTag.children的text中包含了searchText.value就保留，否则就过滤掉
    tempParentTag.children = tempChildren.filter(item => item.text.includes(searchText.value));
    return tempParentTag;
  });

}
const onCancel = () => {
  searchText.value = '';
  tagList.value = originTagList;
};

// 已选中的标签
const activeIds = ref([]);
const activeIndex = ref(0);

// 移除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter(item => {
    return item !== tag;
  })
}

/**
 * 执行搜索
 * 点击搜索按钮后执行这个函数
 *
 * 前端页面跳转传值
 *  1.query -> url searchParams，url后附加参数，传递的值长度优先
 *  2.vuex(全局状态管理)，搜索页将关键词塞到状态中，搜索结果页从状态取值
 */
const doSearchResult = () => {
  router.push({  // 导航到新的路由
    path: '/user/list',
    query: {  // 跳转后传值，带查询参数，结果是/user/list?tags=activeIds.value
      tags: activeIds.value
    }
  })
}

</script>

<style scoped>

</style>
