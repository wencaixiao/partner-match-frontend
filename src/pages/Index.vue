<!--主页-->
<template>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" size="24" />  <!--v-model="isMatchMode"表示这个开关由isMatchMode这个变量控制的-->
    </template>
  </van-cell>
  <!--在vue中组件的驼峰式命名，在用的时候可以写成短-的形式来引用-->
  <user-card-list :user-list="userList" :loading="loading"/>
  <van-empty v-if="!userList || userList.length < 1" description="数据为空"/>
</template>

<script setup lang="ts">  // 开启ts
import { ref, watchEffect } from 'vue';
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";

const isMatchMode = ref<boolean>(false);  // 定义一个匹配模式变量，后续根据他来进行普通模式和心动模式的切换

const userList = ref([]);
const loading = ref(true);

/**
 * 加载数据，分页显示
 * 如果是普通模式，直接分页查询用户
 * 如果是心动模式，直接根据标签匹配用户
 */
const loadData = async () => {
  let userListData;
  loading.value = true;  // 加载数据前把loading值改为true
  // 心动模式，根据标签匹配用户
  if (isMatchMode.value) {
    const num = 10; // 对应后台的num参数
    userListData = await myAxios.get('/user/match', { // 向后端发axios请求
      params: { // 向后端携带的参数
        num,
      },
    })
        .then(function (response) {
          console.log('/user/match succeed', response);
          return response?.data; // 成功之后返回列表
        })
        .catch(function (error) {
          console.error('/user/match error', error);
          Toast.fail('请求失败');
        })
  } else {
    // 普通模式，直接分页查询用户
    userListData = await myAxios.get('/user/recommend', {  // 向后端发axios请求
      params: {
        pageSize: 8,  // 分页，每页8条
        pageNum: 1,  // 分页，当前是第一页
      },
    })
        .then(function (response) {  // 请求成功
          console.log('/user/recommend succeed', response);
          return response?.data?.records;  // 因为后端用了分页对象来封装了，所以要去records
        })
        .catch(function (error) {  // 请求失败
          console.error('/user/recommend error', error);
          Toast.fail('请求失败');
        })
  }
  if (userListData) {
    userListData.forEach((user: UserType) => {
      if (user.tags) {  // 对标签进行解析转换，将json标签字符串转换成对象
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData; // 将userListData传给userList，更新响应时变量
  }
  loading.value = false;  // 加载完数据之后，把loading改为false
}

// 这个函数可以用来监听变量的变化，在这里监听isMatchMode的变化，每次变化都会执行这个函数
watchEffect(() => {
  loadData();
})

</script>

<style scoped>

</style>
