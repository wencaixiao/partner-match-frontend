<!--将用户的卡片抽离成一个组件，方便后续的引用-->
<template>
  <!--页面搜索的结果组件-->
  <!--user in props.userList表示从父标签获取userList并且遍历-->
  <!--:loading="props.loading"表示加载数据的时候会出现一个加载数据的页面(骨架屏特效)，如果加载慢的话可以看到，
      loading为true表示开启这个加载页面的动态过程，加载数据之前，将loading置为true，加载完数据之后，将loading置为false-->
  <van-skeleton title avatar :row="3" :loading="props.loading" v-for="user in props.userList">
    <!--用户的描述、标题和头像-->
    <van-card
        :desc="user.profile"
        :title="`${user.username}（${user.planetCode}）`"
        :thumb="user.avatarUrl"
    >
      <template #tags>
        <!--遍历用户的所有标签-->
        <van-tag plain type="danger" v-for="tag in user.tags" style="margin-right: 8px; margin-top: 8px">
          {{ tag }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="mini">联系我</van-button>
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";

interface UserCardListProps {
  // 定义属性类型
  loading: boolean;
  userList: UserType[];
}

// withDefaults方法就是给属性加一个默认值
const props = withDefaults(defineProps<UserCardListProps>(), {
  loading: true,  // 加一个默认值，是true，表示开启加载组件
  // @ts-ignore
  userList: [] as UserType[],  // 加一个默认值，是一个空数组
});

</script>

<style scoped>

</style>
