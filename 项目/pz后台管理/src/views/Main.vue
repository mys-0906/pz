<template>
  <div class="common-layout">
    <!-- 左菜单栏 -->
    <el-container>
      <Aside></Aside>
    <el-container>
    <!-- <el-header>Header</el-header> -->
    <el-header>
      <Header></Header>
    </el-header>
    <el-main>
      <RouterView></RouterView>
    </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import Aside from '../components/aside.vue'
import Header from '../components/navHeader.vue'
</script>

<style lang="less" scoped>
 .common-layout{
  height: 100%;
  .el-container {
    height: 100%;
  }
 }
</style>