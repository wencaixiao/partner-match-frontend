<!--用户个人页面-->
<template>
  <template v-if="user">  <!--用户存在才需要展示-->
    <!--cell单元格，设置 is-link 属性后会在单元格右侧显示箭头，并且可以通过 arrow-direction 属性控制箭头方向，to表示跳转到哪个页面，-->
    <van-cell title="当前用户" :value="user?.username" />
    <van-cell title="修改信息" is-link to="/user/update" />
    <van-cell title="我创建的队伍" is-link to="/user/team/create" />
    <van-cell title="我加入的队伍" is-link to="/user/team/join" />
  </template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

// const user = {  // 这些数据是要从后端传入过来的
//   id: 1,
//   username: 'xiaowc',
//   userAccount: 'catxiaowc',
//   avatarUrl: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/logo.png',
//   gender: '男',
//   phone: '123112312',
//   email: '12345@qq.com',
//   planetCode: '1234',
//   createTime: new Date(),
// }

const user = ref();

const router = useRouter();

// 表示函数会在当前页面首次加载的时候去执行
onMounted(async () => {
  user.value = await getCurrentUser();  // 获取当前用户的信息
})

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',  // 要跳转的页面
    query: {
      editKey,  // 要编辑的值
      editName,
      currentValue,  // 当前的值
    }
  })
}
</script>

<style scoped>

</style>
