<!--所有页面都要用到的东西，页面布局，从vant3引入对应的组件-->
<template>
  <!--最上面导航栏-->
  <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
  >
    <!--上面点击右侧按钮之后，让他重定向到搜索页面-->
    <!--上面点击左侧按钮之后，让他回退到上一页面-->
    <template #right>  <!--通过插槽自定义导航栏两侧的内容-->
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <div id="content">
    <router-view/>  <!--根据不同的页面展示不同的内容-->
  </div>
  <!--最下面标签栏，使用监听切换事件-->
  <!--标签栏支持路由模式，用于搭配 vue-router 使用。路由模式下会匹配页面路径和标签的 to 属性，并自动选中对应的标签。详见官网我-->
  <van-tabbar route @change="onChange">
    <!--下面三个标签。点击to会跳转到哪个页面-->
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {ref} from "vue";
import routes from "../config/route";

const router = useRouter();  // 引入router对象，获取router信息
const DEFAULT_TITLE = '伙伴匹配';
const title = ref(DEFAULT_TITLE);

/**
 * 根据路由切换标题
 * router.beforeEach()函数：根据要跳转页面的url路径匹配config/routes配置的title，路径变化就会执行这个函数
 */
router.beforeEach((to, from) => {
  const toPath = to.path; // 找到当前路由的路径
  const route = routes.find((route) => { // 遍历路由数组
    return toPath == route.path;  // 如果遍历到path和我们当前的路由相等，就返回这个route对象
  })
  title.value = route?.title ?? DEFAULT_TITLE; // 对象存在就找到了，取title的值，否则取默认的值
})

const onClickLeft = () => {  // 点击左侧按钮之后，回退到上一页面
  router.back();
};

const onClickRight = () => {  // 点击右侧按钮之后，让他重定向到搜索页面
  router.push('/search')  // 可以用push的方式来传递一个路径和携带的参数
};

</script>

<style scoped>
#content {
  padding-bottom: 50px;
}
</style>
