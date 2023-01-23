<template>
  <van-form @submit="onSubmit">  <!--点击提交之后会触发onSubmit事件-->
    <!--用户登录的表单-->
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

const router = useRouter();
const route = useRoute();

const userAccount = ref('');
const userPassword = ref('');

const onSubmit = async () => {  // 点击提交之后会触发这个事件，向后端发送axios请求
  // data表示前端向后端传入的数据，res表示这个函数执行后后端向前端返回的数据
  const res = await myAxios.post('/user/login', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
  })
  console.log(res, '用户登录');
  if (res.code === 0 && res.data) {  // 正确返回，表示登录成功
    Toast.success('登录成功');
    // 登录成功之后，跳转到之前的页面
    const redirectUrl = route.query?.redirect as string ?? '/'; // ??表示如果前面的值存在的话就取前面的值，否则取后面的值
    window.location.href = redirectUrl;
  } else {  // 登录失败
    Toast.fail('登录失败');
  }
};

</script>

<style scoped>

</style>
