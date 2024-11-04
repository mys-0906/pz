<template>
  <div class="container">
    <div class="header">我的订单</div>
    <van-tabs @click-tab="onClickTab" v-model:active="active">
        <van-tab title="全部" name="0"></van-tab>
        <van-tab title="待支付" name="1"></van-tab>
        <van-tab title="待服务" name="2"></van-tab>
        <van-tab title="已完成" name="3"></van-tab>
        <van-tab title="已取消" name="4"></van-tab>
    </van-tabs>
    <van-row @click="goDetail(item)" v-for="item in order" :key="item.id" class="van-row" style="margin-top: 15px;">
      <van-col span="5"><van-icon name="todo-list-o" size="50px" color="skyblue" /></van-col>
      <van-col span="14">
        <div class="text1">{{ item.serve }}</div>
        <div class="text2">
          <div>{{ item.hospitalsName }}</div>
          <div>预约时间:{{ item.nowTime }}</div>
        </div>
      </van-col>
      <van-col :style="{color: colorMap[item.active]}" span="5">
        <div style="margin-bottom: 6px;">{{ item.info }}</div>
        <span>{{'￥:' + item.price }}</span>
      </van-col>
    </van-row>
    <div class="bottom-text">没有更多了</div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { getDd } from '../../api'; 
const colorMap = {
  '1': '#ffa200',
  '2': '#1da6fd',
  '3': '#21c521'
}
const active = ref('')
const order = ref([])
const getDdInfo = async (active) => {
  const {data:{dd}}  = await getDd({ active })
  order.value = dd
  order.value.forEach(item => {
    if (item.active == 1) {
      item.info = '待支付'
    } else if(item.active == 2){
      item.info = '待服务'
    } else if (item.active == 3) {
      item.info = '已完成'
    }
  })
  console.log(order.value);
  
}
onMounted(() => {
  getDdInfo(0)
})
// 导航栏点击事件
const onClickTab = (item) => {
  getDdInfo(item.name)
}
// 跳转订单详情页面
const goDetail = (item) => {

}
</script>

<style lang="less" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
  }
  .header {
    background-color: #fff;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
  .van-row {
    background-color: #fff;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    .text1 {
      font-size: 16px;
      line-height: 25px;
      font-weight: 600;
    }
    .text2 {
      font-size: 14px;
      line-height: 20px;
      color: #999999;
    }
  }
  .bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
  }
</style>