import myAxios from "../plugins/myAxios";
import { setCurrentUserState } from "../states/user";

// 获取当前用户信息
export const getCurrentUser = async () => {
    // const currentUser = getCurrentUserState();
    // if (currentUser) {
    //     return currentUser;
    // }
    // 不存在则从远程获取
    const res = await myAxios.get('/user/current');
    if (res.code === 0) {
        setCurrentUserState(res.data);  // 将从后端返回的数据赋值给CurrentUser
        return res.data;
    }
    return null;
}

