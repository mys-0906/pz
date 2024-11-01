<template>
  <div class="bgi">
    <el-row class="login-container" justify="center" align="middle">
      <el-card style="max-width: 480px;">
        <template #header>
          <div class="card-header">
            <img :src="imgURL" alt="">
          </div>
        </template>
        <div class="jump-link">
          <el-link type="primary" @click="handleCharge">{{ formType ? '返回登陆' : '注册账号' }}</el-link>
        </div>
        <!-- 表单 -->
        <el-form
          ref="loginFormref"
          :model="loginForm"
          style="max-width: 600px;"
          class="demo-ruleForm"
          :rules="rules">
          <el-form-item prop="userName">
              <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="UserFilled"></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input v-model="loginForm.passWord" type="password" placeholder="密码" :prefix-icon="Lock" show-password> </el-input>
          </el-form-item>
          <el-form-item v-if="formType" prop="valiCode">
            <el-input v-model="loginForm.valiCode" placeholder="验证码" :prefix-icon="Grid">
              <template #append>
                <span @click="countDownChange">{{ countDown.validText }}</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :style="{width:'100%'}" @click="submitForm(loginFormref)">
              {{ formType ? '注册账号' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<script setup>
import { UserFilled,Grid,Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref,reactive } from 'vue'
import { getverify,getReguser,getLogin } from '../../api/index'
import { useRouter } from 'vue-router'
const router = useRouter()
  const imgURL = new URL('../../../public/login-head.png',import.meta.url).href
  const loginForm = reactive({
    userName:'',
    passWord:'',
    valiCode:''
  })
  // 切换表单(0,1) 
  const formType = ref(0)
  // 登录注册切换
  const handleCharge = () => {
    formType.value = formType.value ? 0 : 1
    loginForm.userName = ''
    loginForm.passWord= ''
    loginForm.valiCode = ''
  }
  // 账号校验
  const validateUser = (rule,value,callback) => {
    if(value ==='') {
      callback(new Error('账号不能为空'))
    }else {
      const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      phoneReg.test(value) ? callback() : callback(new Error('手机号格式错误,请输入正确手机号')) 
    }
  }
  // 密码校验
  const validatePass = (rule,value,callback) => {
    if(value ==='') {
      callback(new Error('密码不能为空'))
    }else {
      const reg = /^[a-zA-Z0-9_-]{6,16}$/
      reg.test(value) ? callback() : callback(new Error('密码格式错误,密码长度6-16位字符'))
    }
  }
  // 表单规则校验

const rules = reactive({
  userName:[{ validator: validateUser,trigger: 'blur'}],
  passWord:[{ validator: validatePass,trigger: 'blur' }]
})
  let code = ''
  // 发送短信
  const countDown = reactive({
    validText:'获取验证码',
    time:60
  })
  let flag = false
  // 获取验证码时
  const countDownChange = () => {
    if (flag) return
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if(!loginForm.userName || !phoneReg.test(loginForm.userName)) {
      return ElMessage({
        message:'请检查手机号是否正确',
        type:'',
        grouping:true,
        showClose:true
      })
    }
    let timerId = setInterval(()=>{
      if(countDown.time <= 0) {
        countDown.validText = '获取验证码'
        countDown.time = 60
        flag == false
        clearInterval(timerId)
      } else {
      countDown.time -= 1
      countDown.validText = `剩余${countDown.time}s`
      }
    },1000)
    flag = true
    getverify({code: loginForm.userName}).then(({data}) => {
      code = data.verify
    })
  }
  const loginFormref = ref()
  // 表单提交
  const submitForm = async (formEl) => {
    // 校验表单
    if(!formEl) return
    await formEl.validate((valid,fields) => {
      if(valid) {
         // 注册
        if(formType.value) {
        // 验证码校验
            if(code === '') {
            return ElMessage({
              message:'请获取并输入验证码',
              type:'',
              grouping:true,
              showClose:true
            })
            }else if(loginForm.valiCode != code) {
              return ElMessage({
                message:'验证码错误',
                type:'',
                grouping:true,
                showClose:true
              })
            }
          getReguser({userName: loginForm.userName,passWord: loginForm.passWord,verify: loginForm.valiCode}).then(({data}) => {
            if (data.status ===1) {
              ElMessage({
              message: data.message ,
              type:'',
              grouping:true,
              showClose:true
              })
            }
              // 格式化数据
            if(data.status === 0) {
              ElMessage.success('注册成功请登录')
              formType.value = formType.value ? 0 : 1
              loginForm.userName = ''
              loginForm.passWord = ''
              loginForm.valiCode = ''
            }
          })
        }else {
          // 登录接口
          getLogin({userName: loginForm.userName,passWord: loginForm.passWord,verify: loginForm.valiCode}).then(({data}) => {
            // 登录失败
            if (data.status ===1) {
              ElMessage({
              message: data.message ,
              type:'',
              grouping:true,
              showClose:true
              })
            }
            // 登录成功
            if(data.status === 0) {
              console.log(data);
              ElMessage.success('登录成功')
              // 缓存用户信息
              localStorage.setItem('pz_userInfo',JSON.stringify(data.data))
              localStorage.setItem('pz_token',data.token)
              
              router.push('/')
            }
          })
        }
      }else {
      console.log('error submit!',fields);
      }
    })
  }
</script>

<style lang="less" scoped>
  span:hover {
    cursor:pointer;
  }
  .bgi {
    height: 100%;
    width: 100%;
    background-image: url('../../../public/R-C.png');
    background-repeat: no-repeat;
    background-position: center;
      .login-container {
      height: 100%;
      .card-header{
        background-color: #899fe1;
        img {
          width: 430px;
        }
      }
      .jump-link {
        text-align: right;
        margin-bottom: 10px;
      }
    }
  }
</style>