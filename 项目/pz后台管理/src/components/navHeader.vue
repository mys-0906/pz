<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size =25 @click="store.commit('collapseMenu')"><Operation /></el-icon>
      <ul class="flex-box">
        <li v-for="(item,index) in selectMenu"
        :class="{selected: route.path === item.path}"
        :key="item.path"
        class="tap flex-box">
        <el-icon class="flex-box" size =10><component :is="item.icon"></component></el-icon>
        <router-link class="text flex-box" :to="{path: item.path}">
          {{ item.name }}
        </router-link>
        <el-icon class="close" size =10 @click="closeTap(item,index)"><Close /></el-icon>
      </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <p class="user-name">admin</p>
        </div>
        <template #dropdown>
            <el-dropdown-item command="cancel">退出登录</el-dropdown-item>
            <el-dropdown-item command="nicheng">修改昵称</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
  </div>
  <el-dialog
    v-model="dialogFormVisable"
    :before-close="beforeClose"
    title="编辑权限"
    width="500px"
    >
      <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules">
      <el-form-item label="昵称" prop="nicheng">
        <el-input v-model="form.nicheng" placeholder="请输入昵称"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import {useStore} from 'vuex'
import {computed,ref,reactive} from 'vue'
import{useRoute,useRouter} from 'vue-router'
import { setNicheng } from '../api/index'

const router = useRouter()
const route = useRoute()
const store = useStore()
const formRef = ref()
const form = reactive({
  nicheng: ''
})
const dialogFormVisable = ref(false)
const selectMenu = computed(()=>store.state.menu.selectMenu)
const closeTap = (item,index) => {
  store.commit('closeMenu',item)
  // 删除的不是选中页
  if(route.path !==item.path){
    return
  }

  const selectMenuData = selectMenu.value
  // 如果关闭最后一个
  if(index === selectMenuData.length) {
    // 只有一个元素情况
    if(!selectMenuData.length) {
      router.push('/')
    } else{
      router.push({
        path: selectMenuData[index - 1].path
      })
    }
  } else{
    router.push({
      path: selectMenuData[index].path
    })
  }
}
const beforeClose = () => {
    dialogFormVisable.value = false
  }
// 退出登录
const handleClick = (command) => {
    if(command === 'cancel') {
      localStorage.removeItem('pz_token')
      localStorage.removeItem('pz_userInfo')
      window.location.href = window.location.origin + '/login'
    }
    if(command ==='nicheng') {
      dialogFormVisable.value = true
    }
  }
  // 表单校验
  const rules = reactive({
    nicheng:[{required:true,trigger:'blur',message:'请填写昵称'}]
  })
  // 表单提交
  const confirm = async (formEL) => {
    if(!formEL) return
    await formEL.validate((valid,fields) => {
      if(valid) {
        const { nicheng } = form
        const userInfo = localStorage.getItem('pz_userInfo')
        const phone = JSON.parse(userInfo).userName
        setNicheng({nicheng: nicheng,phone: phone}).then(({data}) => {
          if(data.status == 0) {
            dialogFormVisable.value = false
            window.location.reload()
          }
        })
      }else {
        console.log('error submit',fields);
      }
    })
  }
</script>

<style lang="less" scoped>
  .flex-box{
    display: flex;
    align-items: center;
    height: 100%;
  }
  a{
    height: 100%;
    color: #333;
    font-size: 15px;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-left: 5px;
    padding-right: 25px;
    .header-left {
      .icon {
        width: 40px;
        height: 100%;
      }
      .icon:hover{
        background-color: #f5f5f5;
        cursor: pointer;
      }
      .tap{
        padding: 0 10px;
        height: 100%;
        .text{
          margin: 0 5px;
        }
        .close {
          visibility: hidden;
        }
        &.selected{
          color: skyblue;
          background-color: #f5f5f5;
          a{
            color: skyblue;
          }
        }
      }

      .tap:hover{
        background-color: #f5f5f5;
        .close{
          visibility: visible;
          cursor: pointer;
          color: #000;
        }
      }

    }

    .header-right{
      .user-name{
        margin-left: 10px;
      }
  }
}
</style>