import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import './index.css'
const app = createApp(App)
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
    data: {}
})

// 确保 _use_ 路由实例使
// 整个应用支持路由。
app.use(router)

app.use(ElementPlus, { locale })

app.mount('#app')
