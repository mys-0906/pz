<template>
  <div class="jz">
    <h2 style="text-align: center;">{{ isZc ? '账号注册':'用户登录' }}</h2>
  <van-form @submit="onSubmit">
  <van-cell-group inset>
    <van-field
      v-model="form.phone"
      name="手机号"
      label="手机号"
      placeholder="手机号"
      :rules="[{ pattern, message: '请填写正确的手机号' }]"
    />
    <van-field
      v-model="form.passWord"
      type="password"
      name="密码"
      label="密码"
      placeholder="密码"
      :rules="[{validator, message: '密码为6-16位字符' }]"
    />
    <van-field
    v-if="isZc"
    v-model="form.valiCode"
    center
    clearable
    label="验证码"
    placeholder="短信验证码">
    <template #button>
      <van-button size="small" type="primary" @click="getCode">{{ flag.value ? `${countDown.time}`:`${countDown.validText}` }}</van-button>
    </template>
  </van-field>
  </van-cell-group>
  <div class="flex-box">
    <van-button class="btns" plain type="primary" size="small" @click="toggle">
      {{ isZc ? '返回登录':'注册账号' }}
    </van-button>
  </div>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        {{isZc ? '注册':'登录'}}
      </van-button>
    </div>
  </van-form>
  </div>
</template>

<script setup>
import { showDialog } from 'vant'
import { getverify,getReguser,getLogin } from '../../api/index'
import { ref,reactive } from 'vue';
import { useRouter } from 'vue-router'
const isZc = ref(false)
const router = useRouter()
const code = ref('00351520vfaszc')
const pattern = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
// 密码校验
const validator = (val) => {
  const reg = /^[a-zA-Z0-9_-]{6,16}$/
  return reg.test(val);
}
// 切换
const toggle = () => {
  form.phone = ''
  form.passWord = ''
  form.valiCode = ''
  isZc.value = isZc.value ? false: true
}
// 表单数据
const form = reactive({
  phone: '',
  passWord: '',
  valiCode: ''
})

// 获得验证码
const countDown = reactive({
    validText:'发送',
    time:60
  })
  let flag = ref(false)
const getCode = () => {
  flag.value = true
  getverify(form.phone).then(({data}) => {
    code.value = data.verify
  })
  let timerId = setInterval(()=>{
      if(countDown.time <= 0) {
        countDown.validText = '发送'
        countDown.time = 60
        flag.value == false
        clearInterval(timerId)
      }else {
      countDown.time -= 1
      countDown.validText = `剩余${countDown.time}s`
      }
    },1000)
}
// 表单提交
const onSubmit = () => {
// 验证码验证
  if(isZc.value) {
    if(code.value === form.valiCode) {
      // 注册接口
      getReguser({userName: form.phone,passWord: form.passWord}).then(({data}) => {
        if(data.status !== 0) {
          showDialog({
            message: data.message,
          })
        }else{
          showDialog({
            message: data.message,
          })
        }
      })
    }else {
      showDialog({ message: '验证码错误' });
      return
    }
  }
  // 登录接口
  getLogin({userName: form.phone,passWord: form.passWord}).then(({data}) => {
    if(data.status !== 0) {
      showDialog({
        message: data.message,
      })
    }else{
      localStorage.setItem('c_userInfo',JSON.stringify(data.data))
      localStorage.setItem('c_token',data.token)
      router.push('/home')
    }
  })
}
</script>

<style lang="less" scoped>
.jz{
  display: flex;
  height: 80vh;
  width: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.flex-box {
  display: flex;
  flex-direction: row-reverse;
}
.btns {
  border-style: none;
}
</style>