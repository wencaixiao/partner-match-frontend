/**
 * ts会默认把类型定义在xxx.d.ts文件夹中，这里定义的全部东西都可以被其他页面识别到
 * 用户类别，和之前做的用户中心项目的type.d.ts文件一样
 */
export type UserType = {  // 脱敏后的用户信息：后端向前端应该返回什么类型的数据
    id: number;
    username: string;
    userAccount: string;
    avatarUrl?: string;
    profile?: string;
    gender:number;
    phone: string;
    email: string;
    userStatus: number;
    userRole: number;
    planetCode: string;
    tags: string;
    createTime: Date;
};
