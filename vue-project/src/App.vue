<template>
  <ElContainer>
    <ElHeader></ElHeader>
    <ElContainer>
      <SideMenu :menuItems="menuItems"></SideMenu>
      <ElMain><RouterView></RouterView></ElMain>
    </ElContainer>
  </ElContainer>
</template>
<script setup lang="ts">
import SideMenu from '@/components/SideMenu.vue';
import { RouterView } from 'vue-router';
const menuItems = [
  { text: '首页', route: '/' },
  { text: '视频编辑', route: '/video-edit' },
  { text: '菜单项2', route: '/menu2' },
  { text: '菜单项3', route: '/menu3' },
];
</script>
<style lang="scss">
.layout {
  .el-header {
    height: 60px;
    background: rgba(23, 24, 26, 1);
  }
}
</style>
