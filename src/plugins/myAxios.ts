// 发送一个axios请求
import axios, {AxiosInstance} from "axios";

const isDev = process.env.NODE_ENV === 'development';

// 先区分多环境：前端区分开发和线上接口，后端prod改为用线上公网可访问的数据库
const myAxios: AxiosInstance = axios.create({
    baseURL: isDev ? 'http://localhost:8080/api' : '线上地址',  // 定义我们要向哪个地方发送axios请求
});

// 表示向后端发送请求的时候要带上请求的凭证(cookie)
myAxios.defaults.withCredentials = true; // 配置为true

// Add a request interceptor 全局请求拦截器，发送请求之前执行，可以用来做一些判断，不符合就不让他往后端发请求
myAxios.interceptors.request.use(function (config) {
    console.log('我要发请求啦', config)
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor 全局响应拦截器，每次接收到后端的数据之后做一些事情
// 当用户未登录时强制登录，自动跳转到登录页？
//  解决：axios全局配置响应拦截、并且添加重定向
myAxios.interceptors.response.use(function (response) {
    console.log('我收到你的响应啦', response)
    // 未登录则跳转到登录页
    if (response?.data?.code === 40100) {  // 加?表明这个变量如果是空对象也不会出现异常
        const redirectUrl = window.location.href;
        window.location.href = `/user/login?redirect=${redirectUrl}`;  // 重新登录后重定向跳转到之前要访问的这个页面
    }
    // Do something with response data
    // 这一层data是response层面对axios层面做的封装，还有第二层是axios层面对后端返回来的数据做的封装
    return response.data;  // 因为有两层data，这里返回一层data，后面就只需要考虑一层data就行了，后面这层data就是后端返回的数据
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

export default myAxios;
