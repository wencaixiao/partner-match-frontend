import {UserType} from "../models/user";

let currentUser: UserType;

// 设置当前用户的状态
const setCurrentUserState = (user: UserType) => {
    currentUser = user;
}

// 获取当前用户的状态
const getCurrentUserState = () : UserType => {
    return currentUser;
}

export {
    setCurrentUserState,
    getCurrentUserState,
}