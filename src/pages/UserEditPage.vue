<template>
  <van-form @submit="onSubmit">  <!--onSubmit表示点击提交之后会做哪些事-->
    <!--传入到表单中的对象-->
      <van-field
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          :label="editUser.editName"
          :placeholder="`请输入${editUser.editName}`"
      />
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">  // 用ts
import {useRoute, useRouter} from "vue-router";
import { ref } from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

const route = useRoute();
const router = useRouter();

const editUser = ref({  // 我们要传入到表单里面的对象
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  editName: route.query.editName,
})

const onSubmit = async () => {  // 把editKey currentValue editName提交到后台
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    Toast.fail('用户未登录');
    return;
  }

  console.log(currentUser, '当前用户')
  // 向后端发送post请求，函数执行完之后后端会返回数据给res
  const res = await myAxios.post('/user/update', {  // data是要向后端发送的参数
    'id': currentUser.id,  // 要修改的用户id
    [editUser.value.editKey as string]: editUser.value.currentValue,  // key和value
  })
  console.log(res, '更新请求');
  if (res.code === 0 && res.data > 0) {  // 从后端返回的数据可以判断这是修改成功
    Toast.success('修改成功');
    router.back();
  } else {  // 修改失败
    Toast.fail('修改错误');
  }
};

</script>

<style scoped>

</style>
