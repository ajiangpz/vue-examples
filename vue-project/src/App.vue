<template>
  <ElContainer class="layout">
    <ElHeader class="header">header</ElHeader>
    <ElContainer class="container">
      <el-aside width="300px">
        <Resource></Resource>
      </el-aside>
      <!-- 展示资源组件 -->

      <ElMain>
        <RouterView></RouterView>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import Resource from '@/components/Resource.vue';
</script>
<style lang="scss">
.layout {
  .el-header {
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    /* 阴影 */
  }

  .el-container {
    margin-top: 6px;
  }
}
</style>
