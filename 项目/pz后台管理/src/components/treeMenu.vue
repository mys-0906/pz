<template>
  <template v-for="(item, index) in props.menuData" :key="index">
    <!-- 没有子组件情况 -->
    <el-menu-item
      @click="handleClick(item,`${props.index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length == 0"
      :index="`${props.index}-${item.meta.id}`"
      :key="`${props.index}-${item.meta.id}`">
      <el-icon size="20">
        <!-- 动态组件方式添加图标 -->
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
    <!-- 有子组件情况 -->
    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
          <!-- 动态组件方式添加图标 -->
          <component :is="item.meta.icon"></component>
        </el-icon>
      <span>{{ item.meta.name }}</span>
      <!-- 递归出来子组件 -->
    </template>
      <tree-menu 
      :index="`${props.index}-${item.meta.id}`" 
      :menuData="item.children"/>
    </el-sub-menu>
  </template>

</template>

<script setup>
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
// 拿到router实例
const router = useRouter()
const props = defineProps(["menuData","index"]);
const store = useStore()
// 点击事件
const handleClick = (item,active) => {
  
  store.commit('addMenu',item.meta)
  router.push(item.meta.path)
}
</script>

<style>
</style>