<template>
  <div class="container">
    <div class="header">
      <van-icon @click="goBack" name="arrow-left" class="header-left" size="20" />
      <span>请完善订单</span>
    </div>
    <statusBar item="0" />
    <van-form @submit="onSubmit">
    <van-cell-group inset class="cell">
      <van-cell style="height:64px;">
        <template #title>
          <van-icon name="list-switching" size="20" />
          <van-field
            :rules="[{ required: true, message: '请选择服务' }]"
            v-model="form.serve"
            is-link
            readonly
            label="服务"
            placeholder="选择服务"
            @click="showPicker = true"
          />
          <van-popup v-model:show="showPicker" round position="bottom">
            <van-picker
              :columns="columns"
              @cancel="showPicker = false"
              @confirm="onConfirm"
            />
          </van-popup>
        </template>
      </van-cell>
    </van-cell-group>

  <van-cell-group inset class="cell">
    <van-cell>
      <template #title>
        <van-field
            v-model="form.hospitalsName"
            :rules="[{ required: true, message: '请选择医院' }]"
            is-link
            label="就诊医院"
            placeholder="请选择医院"
            @click="showYy = true"
          />
          <van-popup v-model:show="showYy" round position="bottom">
            <van-picker
              :columns="hospitalsList"
              @cancel="showYy = false"
              @confirm="confirmYy"
            />
          </van-popup>
      </template>
    </van-cell>
    <van-cell>
      <template #title>
        <van-field
            v-model="form.nowTime"
            is-link
            label="就诊时间"
            placeholder="选择时间"
            :rules="[{ required: true, message: '请选择就诊日期' }]"
            @click="showTime = true"
          />
          <van-popup v-model:show="showTime" round position="bottom">
            <van-date-picker
              @cancel="showTime = false"
              title="选择日期"
              :min-date="minDate"
              @confirm="confirmTime"
            />
        </van-popup>
      </template>
    </van-cell>
    <van-cell>
      <template #title>
        <van-field
            v-model="form.pzs"
            is-link
            label="陪诊师"
            :rules="[{ required: true, message: '请选择陪诊师' }]"
            placeholder="请选择陪诊师"
            @click="showPzs = true"
          />
          <van-popup v-model:show="showPzs" round position="bottom">
            <van-picker
              :columns="pzs_list"
              @cancel="showPzs = false"
              @confirm="confirmPzs"
            />
          </van-popup>
      </template>
    </van-cell>
    <van-cell>
      <template #title>
        <van-field
            v-model="form.dz"
            :rules="[{ required: true, message: '请填写地址' }]"
            label="接送地址"
            placeholder="请填写地址"
          />
      </template>
    </van-cell>
    <van-cell>
      <template #title>
        <van-field
          v-model="form.phone"
          label="联系电话"
          placeholder="请填写手机号"
          :rules="[{ pattern, message: '请填写正确的手机号' }]"
        />
      </template>
    </van-cell>
  </van-cell-group>

  <van-cell-group inset title="服务需求" class="cell">
    <template #title>
      <van-field
        v-model="form.beizhu"
        type="textarea"
        autosize
        rows="2"
        label="备注"
        placeholder="请填写备注"
        maxlength="125"
        show-word-limit
      />
    </template>
  </van-cell-group>
  <van-button round block type="primary" native-type="submit">
      提交订单
    </van-button>
</van-form>
  </div>
</template>

<script setup>
import statusBar from '../../components/statusBar.vue';
import { getOrderInfo,postDd } from '../../api/index'
import { reactive, onMounted, ref, computed } from 'vue';
import { useRouter,useRoute } from 'vue-router';
const router = useRouter()
const pattern = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
const route = useRoute()
// 医院陪诊师数据
const createInfo = reactive({
  pzs_list: [],
  hospitals: [],
  serviceName: '就医陪诊',
})
// 表单数据
const form = reactive({
  beizhu: '',
  phone: '',
  // 地址
  dz: '',
  pzs: '',
  nowTime: '',
  hospitalsName: '',
  serve: '',
})
const hospitalsId = ref(null)

// 服务相关
const columns = reactive([
  { text: '就医陪诊',value: 0},
  { text: '诊前约号',value: 1},
  { text: '代办买药',value: 2},
  { text: '院内陪护',value: 3},
  { text: '术后陪护',value: 4},
  { text: '产后陪护',value: 5},
])
let hospitalsList = reactive([])
// 弹出层初始状态
const showPicker = ref(false);
const showPzs = ref(false);
const showTime = ref(false)
const showYy = ref(false);
const pzs_list = reactive([])
async function fun() {
  await getOrderInfo()
  createInfo.pzs_list.forEach((item,index) => {
    pzs_list[index] = {text: item.name,value: item.id} 
  })
}
// 最小日期
const minDate = ref(new Date())

// 列表提交
const confirmPzs = ({selectedOptions}) => {
  form.pzs = selectedOptions[0].text
  showPzs.value = false;
};
const confirmTime = ({selectedOptions}) => {
  form.nowTime = selectedOptions[0].value + '-' + selectedOptions[1].value + '-' + selectedOptions[2].value
  showTime.value = false;
};
const onConfirm = ({selectedOptions}) => {
  showPicker.value = false;
  form.serve = selectedOptions[0].text 
};
const confirmYy = ({selectedOptions}) => {
  showYy.value = false;
  form.hospitalsName = selectedOptions[0].text
}

onMounted(() => {
  hospitalsId.value = route.query.id
    getOrderInfo().then(({data}) => {
      if(data.status == 1) return
      hospitalsList = data.list
      Object.assign(createInfo,data.data)
      if(!hospitalsId.value) return
      // 只获得医院名称
      createInfo.hospitals.forEach(item => {
        if(hospitalsId.value == item.id) {
          form.hospitalsName = item.name
        }
      })
    })
    fun()
})
// 返回按钮
const goBack = () => {
  router.go(-1)
}
// 提交订单
const onSubmit = () => {
  
  postDd(form).then(({ data }) => {
    if(data.status !== 0) {
      showDialog({
        message: data.message,
      })
    } else {
      showDialog({
        message: data.message,
      })
      router.push('/order')
    }
  })
}

</script>

<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  padding: 10px 0;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  .header-left {
    float: left;
  }
}

.cell {
  width: 96%;
  margin: 10px auto;
  background-color: #fff;
  ::v-deep(.van-field__control) {
    color: var(--van-cell-value-color);
  }
  ::v-deep(.van-cell__title) {
	display: flex;
	align-items: center;
  }
}

.sumbit {
  position: absolute;
  bottom: 0;
}
::v-deep(.van-dialog__content) {
  text-align: center;
  padding: 20px;
  .close {
    position: absolute;
    left: 20px;
  }
}
</style>