<!--队伍页面-->
<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch" />
    <!--标签页，用来区分公开和加密的队伍-->
    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab title="公开" name="public" />
      <van-tab title="加密" name="private" />
    </van-tabs>
    <div style="margin-bottom: 16px" />
    <!--添加队伍的按钮-->
    <van-button class="add-button" type="primary" icon="plus" @click="toAddTeam" />
    <team-card-list :teamList="teamList" />  <!--队伍的卡片列表-->
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>  <!--如果没有数据展示数据为空-->
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

const active = ref('public')
const router = useRouter();
const searchText = ref('');  // 和上面的v-model双向绑定

/**
 * 切换查询状态
 * @param name
 */
const onTabChange = (name) => {
  // 查公开
  if (name === 'public') {
    listTeam(searchText.value, 0);
  } else {
    // 查加密
    listTeam(searchText.value, 2);
  }
}

// 跳转到创建队伍页
const toAddTeam = () => {
  router.push({
    path: "/team/add"
  })
}

const teamList = ref([]);  // 用来接收后端返回来的值

/**
 * 搜索队伍
 * @param val
 * @param status
 * @returns {Promise<void>}
 */
const listTeam = async (val = '', status = 0) => {
  const res = await myAxios.get("/team/list", {  // 向后端发送axios请求
    params: {  // 传给后端的数据
      searchText: val, // 搜索的文本，默认为空
      pageNum: 1, // 第几页
      status, // 是私密还是公开
    },
  });
  if (res?.code === 0) {  // 查询成功
    teamList.value = res.data;
  } else {  //查询失败
    Toast.fail('加载队伍失败，请刷新重试');
  }
}

// 页面加载时只触发一次
onMounted( () => {
  listTeam();
})

const onSearch = (val) => {
  listTeam(val);
};

</script>

<style scoped>
#teamPage {

}
</style>
