<template>
  <user-card-list :user-list="userList" :loading="loading"/>
  <van-empty v-if="!userList || userList.length < 1" description="搜索结果为空" />
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute} from "vue-router";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import qs from 'qs';
import UserCardList from "../components/UserCardList.vue";  // 加载搜索结果的这个页面

const route = useRoute();
const {tags} = route.query;  // 从SearchPage.vue页面中点击搜索按钮后，把前端的值tags传过来，这里接收前端页面传过来的那个参数

const userList = ref([]);  // 给userList设置一个值，默认为空数组
const loading = ref(true);

onMounted(async () => {  // 钩子函数，当页面加载好之后，可以执行这个钩子函数
  loading.value = true;  // 加载数据前把loading值改为true
  // userListData是让axios请求结束返回数据后才拿到这个userListData
  const userListData = await myAxios.get('/user/search/tags', {  // url表示后端的请求地址
    params: {
      tagNameList: tags  // 向后端传入的参数
    },
    paramsSerializer: params => {  // 将请求参数做了序列化
      return qs.stringify(params, {indices: false})
    }
  })
      .then(function (response) {  // 响应成功，返回response这个数据
        console.log('/user/search/tags succeed', response);
        return response?.data;  // 这里只需要取一次data是可以了，因为之前myAxios.ts取了一次data
      })
      .catch(function (error) {  // 响应失败
        console.error('/user/search/tags error', error);
        Toast.fail('请求失败');
      })
  console.log(userListData)
  if (userListData) {
    userListData.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);  // 将返回过来的JSON解析成数组
      }
    })
    userList.value = userListData;
  }
  loading.value = false;  // 加载完数据之后，把loading改为false
})


// const mockUser = {
//   id: 12345,
//   username: 'xiaowc',
//   userAccount: '12314',
//   profile: '一名精神小伙，目前还有头发，谢谢大家，阿爸爸阿爸爸阿巴阿巴阿巴',
//   avatarUrl: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/logo.png',
//   gender: 0,
//   phone: '13113113111',
//   email: '592342843721987@xzcxzczxcz.com',
//   userRole: 0,
//   planetCode: '1234',
//   tags: ['java', 'emo', '打工中', 'emo', '打工中'],
//   createTime: new Date(),
// }


</script>

<style scoped>

</style>
