<!--将队伍的卡片抽离成一个组件，方便后续的引用-->
<template>
  <div
      id="teamCardList"
  >
    <van-card
        v-for="team in props.teamList"
        :thumb="team.avatarUrl"
        :desc="team.description"
        :title="`${team.name}`"
    >
      <template #tags>
        <van-tag plain type="danger" style="margin-right: 8px; margin-top: 8px">
          {{
            teamStatusEnum[team.status]
          }}
        </van-tag>
      </template>
      <template #bottom>
        <div>
          {{ `队伍人数: ${team.hasJoinNum}/${team.maxNum}` }}
        </div>
        <div v-if="team.expireTime">
          {{ '过期时间: ' + team.expireTime }}
        </div>
        <div>
          {{ '创建时间: ' + team.createTime }}
        </div>
      </template>
      <template #footer>
        <van-button size="small" type="primary" v-if="team.userId !== currentUser?.id && !team.hasJoin" plain
                    @click="preJoinTeam(team)">  <!--只有不是自己创建的队伍并且该用户没有加入该队伍才可以加入队伍-->
          加入队伍
        </van-button>
        <van-button v-if="team.userId === currentUser?.id" size="small" plain
                    @click="doUpdateTeam(team.id)">更新队伍  <!--只有是自己创建的队伍才可以更新队伍-->
        </van-button>
        <!-- 仅加入队伍可见 -->
        <van-button v-if="team.userId !== currentUser?.id && team.hasJoin" size="small" plain
                    @click="doQuitTeam(team.id)">退出队伍  <!--创建人不可见，创建只需要解散队伍就行，仅已加入队伍的人可见-->
        </van-button>
        <van-button v-if="team.userId === currentUser?.id" size="small" type="danger" plain
                    @click="doDeleteTeam(team.id)">解散队伍  <!--只有是自己创建的队伍才可以解散队伍-->
        </van-button>
      </template>
    </van-card>
    <!--v-model:show="showPasswordDialog"用来确定弹出框是否显示，就是点击加入加密队伍后要求你输入密码的提示框
        点击确认之后调用doJoinTeam函数，点击取消后调用doJoinCancel函数-->
    <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button @confirm="doJoinTeam" @cancel="doJoinCancel">
      <van-field v-model="password" placeholder="请输入密码"/>
    </van-dialog>
  </div>

</template>

<script setup lang="ts">
import {TeamType} from "../models/team";
import {teamStatusEnum} from "../constants/team";
import ikun from '../assets/ikun.png';
import myAxios from "../plugins/myAxios";
import {Dialog, Toast} from "vant";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";
import {useRouter} from "vue-router";

interface TeamCardListProps {
  teamList: TeamType[];
}

const props = withDefaults(defineProps<TeamCardListProps>(), {
  // @ts-ignore
  teamList: [] as TeamType[],
});

const showPasswordDialog = ref(false);
const password = ref('');  // 双向绑定
const joinTeamId = ref(0);
const currentUser = ref();

const router = useRouter();

onMounted(async () => {
  currentUser.value = await getCurrentUser();  // 获取当前用户的信息
})

/**
 * 加入队伍之前判断是公开的队伍还是私密的队伍，如果是公开队伍，直接加入，如果是私密队伍，要弹出密码提示框，输入密码后才可加入
 * @param team
 */
const preJoinTeam = (team: TeamType) => {
  joinTeamId.value = team.id;  // 加入的队伍的id
  if (team.status === 0) {  // 公开队伍，直接加入队伍
    doJoinTeam()
  } else {
    showPasswordDialog.value = true;  // 私密队伍，要弹出输入密码提示框，输入密码后才可加入
  }
}

/**
 * 加入私密队伍时，弹出提示框，点击取消后，取消加入队伍，执行这个函数
 */
const doJoinCancel = () => { //将参数都置空
  joinTeamId.value = 0;
  password.value = '';
}

/**
 * 加入队伍
 */
const doJoinTeam = async () => {
  if (!joinTeamId.value) {
    return;
  }
  const res = await myAxios.post('/team/join', {  // 向后端发送axios请求，传给后端的参数
    teamId: joinTeamId.value,
    password: password.value
  });
  if (res?.code === 0) {
    Toast.success('加入成功');
    doJoinCancel();
  } else {
    Toast.fail('加入失败' + (res.description ? `，${res.description}` : ''));
  }
}

/**
 * 跳转至更新队伍页
 * @param id
 */
const doUpdateTeam = (id: number) => {
  router.push({
    path: '/team/update',
    query: {
      id,
    }
  })
}

/**
 * 退出队伍
 * @param id
 */
const doQuitTeam = async (id: number) => {
  const res = await myAxios.post('/team/quit', {
    teamId: id
  });
  if (res?.code === 0) {
    Toast.success('操作成功');
  } else {
    Toast.fail('操作失败' + (res.description ? `，${res.description}` : ''));
  }
}

/**
 * 解散队伍
 * @param id
 */
const doDeleteTeam = async (id: number) => {
  const res = await myAxios.post('/team/delete', {
    id,
  });
  if (res?.code === 0) {
    Toast.success('操作成功');
  } else {
    Toast.fail('操作失败' + (res.description ? `，${res.description}` : ''));
  }
}

</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  height: 128px;
  object-fit: unset;
}
</style>
