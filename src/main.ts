// 是前端vue项目的入口
import {createApp} from 'vue'  // 从vue中引入createApp来创建一个App的组件
import App from './App.vue'
// vue-router其实就是帮助你根据不同的url来展示不同的页面(组件)，不用自己写if/else
import * as VueRouter from 'vue-router';  // 引入vue-router组件
import routes from "./config/route";  // 引入在config里面定义的一些路由
import Vant from 'vant';  // 我们这里不使用按需引入，按需引入有点麻烦，使用全部引入
import 'vant/lib/index.css';  // 引入css
import '../global.css';

const app = createApp(App);  // 创建一个App组件
app.use(Vant);  // 全部引入

// 创建一个router实例
const router = VueRouter.createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHistory(),
    routes, // `routes: routes` 的缩写
})

// 在App上挂载使用，引用这个router组件
app.use(router);

// 把App.vue这个组件挂载到index.html中的#app上
app.mount('#app')  // 并且将App.vue文件和index文件中的#app联合起来
