<template>
  <ElContainer class="layout">
    <ElHeader class="header">header</ElHeader>
    <ElContainer>
      <el-aside width="200px">
        <Resource></Resource>
      </el-aside>
      <!-- 展示资源组件 -->

      <ElMain><RouterView></RouterView></ElMain>
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
    height: 60px;
    background: rgba(23, 24, 26, 1);
    color: white;
  }
}
</style>
