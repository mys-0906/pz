import { createApp } from 'vue'
import './style.css'
import { userLogin } from './api/index.js'
import { ElMessage } from 'element-plus';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store/index.js'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 前置全局守卫
router.beforeEach((to,from,next) => {
  let arr = []
  let phone
  const token = localStorage.getItem('pz_token')
  const userInfo = localStorage.getItem('pz_userInfo')
  if(userInfo) {
    phone = JSON.parse(userInfo).userName
      // 调用接口
    userLogin({phone}).then(({data}) => {
      arr = data            
  })
  }
  setTimeout(a,200)
  function a() {
    // 权限判断
    if(to.path === '/dashboard' && !arr.includes(1)){ 
      ElMessage({
        message: '权限不足' ,
        type:'',
        grouping:true,
        showClose:true
      })
      next('/')
    }
    if(to.path === '/auth/admin' && !arr.includes(21)){ 
      ElMessage({
        message: '权限不足' ,
        type:'',
        grouping:true,
        showClose:true
      })
      next('/')
    }
    if(to.path === '/auth/group' && !arr.includes(22)){ 
      ElMessage({
        message: '权限不足' ,
        type:'',
        grouping:true,
        showClose:true
      })
      next('/')
    }
    if(to.path === '/vppz/staff' && !arr.includes(31)){ 
      ElMessage({
        message: '权限不足' ,
        type:'',
        grouping:true,
        showClose:true
      })
      next('/')
    }
    if(to.path === '/vppz/order' && !arr.includes(32)){ 
      ElMessage({
        message: '权限不足' ,
        type:'',
        grouping:true,
        showClose:true
      })
      next('/')
    }

    // 判断token
    if(!token && to.path !== '/login' ) {
    next('/login')
    }
    next()
  }
})
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')