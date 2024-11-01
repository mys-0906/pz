import { createApp } from 'vue'
import 'vant/lib/index.css';
import App from './App.vue'
import router from './router/index'
import { Button,Dialog, } from 'vant';
const app = createApp(App)
// 前置全局守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem('c_token')
  if (!token && to.path !== '/login') {
    return '/login'
  }
  
})
app.use(router)
app.use(Dialog,Button);
app.mount('#app')
