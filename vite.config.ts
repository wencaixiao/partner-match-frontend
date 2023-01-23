// vite构建工具的配置文件，可以在这个配置文件中整合其他框架或定义vite构建的行为
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport, {VantResolve} from 'vite-plugin-style-import';  // 这个插件能够让vite支持按需引入样式

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), styleImport({  // 引入一个我们刚刚 npm i vite-plugin-style-import@1.4.1 -D 安装的这个插件
        resolves: [VantResolve()],
    }),]
})
