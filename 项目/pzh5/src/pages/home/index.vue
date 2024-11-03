<template>
  <div class="header">
    <div class="header-left">
      当前地区
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="search">
      <van-search
        @update:model-value="onUpdate"
        v-model= "searchValue"
        shape="round"
        placeholder="请输入医院名称"
      />
    </div>
  </div>
  <div class="box">
    <van-swipe class="swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>
        <van-image
          src="/public/1.jpg"
          radius="8"
          width="100%"
        />
      </van-swipe-item>
      <van-swipe-item>
        <van-image
          src="/public/2.jpg"
          radius="8"
          width="100%"
        />
      </van-swipe-item>
      <van-swipe-item>
        <van-image
          src="/public/3.jpg"
          radius="8"
          width="100%"
        />
      </van-swipe-item>
    </van-swipe>
  </div>
  <van-row style="margin-top: 8px;">
    <div class="twoSpan">
      <span style="width: 45%;">
        <van-image
          style="width: 100%;"
          src="/public/nav1.jpg"
          radius="5"
          @click="goOrderone()"
        />
      </span>
      <span class="rightSpan">
        <van-image
        style="width: 100%;"
        src="/public/nav2.jpg"
        radius="5"
        @click="goOrdertwo()"
      />
      </span>
    </div>
  </van-row>

  <!-- 下方为列表 -->
  <van-row
    @click="goOrder(item)"
    class="yy-list"
    justify="space-around"
    v-for="(item) in homeData.hospitals" :key="item.id">
      <van-col span="6">
        <van-image
          width="100"
          height="90"
          :src="item.img"
          radius="5"
        />
    </van-col>
    <van-col class="yy" span="14">
      <div class="yy-name">{{ item.name }}</div>
      <div class="yy-type">
        <span>{{ item.rank }}</span>
        &nbsp;
        <span>{{ item.label }}</span>
      </div>
      <div class="yy-text">
        <van-text-ellipsis
          rows="2"
          :content="item.intro"
        />
</div>
    </van-col>
  </van-row>
</template>

<script setup>
import { ref,reactive,onMounted } from 'vue';
import { getHospitals } from '../../api/index'
import { useRouter } from 'vue-router';
const searchValue = ref('')
const router = useRouter()
const homeData = reactive({
  hospitals: [],
  now: '',
})
onMounted(() => {
  getHospitals().then(({ data }) => {
    homeData.hospitals = data.list
  })
})
// 快捷入口
const goOrderone = () => {
  router.push('/createOrder')
}
const goOrdertwo= () => {
  router.push('/createOrder')
}
const goOrder = (item) => {
  router.push({path:`/createOrder`,query:{id: item.id}})
}
// 搜索框实现功能
const onUpdate = async (val) => {
  const arr = ref([])
    await getHospitals().then(({ data }) => {
      homeData.hospitals = data.list
    })
  if (val) {
    // 过滤出符合搜索的
    arr.value = homeData.hospitals.filter((item) => {
    if (item.name.includes(val)) {
      return item
    } else {
      return
    }
    })
    homeData.hospitals = arr.value
  } else {
    getHospitals().then(({ data }) => {
      homeData.hospitals = data.list
    })
  }
}
</script>

<style lang="less" scoped>
  .header {
      display: flex;
      height: 5vh;
      justify-content: space-between;
      margin: 5px;
      line-height: 46px;
      .header-left {
        padding-left:30px;
        background: url('/public/OIP-C.jpeg') no-repeat #ffffff left center ;
        background-size: 25px;
        font-size: 20px;
        font-weight: bold;
        color: #666666;
      }
      .search{
        width: 60%;
      }
    }
  .box{
    width: 100vm;
    display: flex;
    justify-content: center;
    align-items: center;
    .swipe{
      width: 95%;
    }
  }
  .twoSpan{
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    width: 95%;
    .rightSpan{
      width: 45%;
    }
  }
  .yy-list {
    padding-bottom: 10px;
    margin: 20px 0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04), 0 1px 6px 0 rgba(0, 0, 0, 0.04);
    .yy {
      .yy-name {
        font-size: 20px;
        line-height: 30px;
        font-weight: 600;
      }
      .yy-type {
        font-weight: 700;
        line-height: 25px;
        font-size: 15px;
        color: #0ca7ae;
      }
      .yy-text {
        font-size: 14px;
        color: #999999;
      }
    }
  }
  .bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
  }
</style>