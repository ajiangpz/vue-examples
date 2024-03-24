<template>
  <div class="wrapper">
    <el-menu
      :default-active="resourceType"
      class="el-menu-vertical-demo"
      :collapse="true"
      @select="handleTypeChange"
    >
      <el-menu-item index="Video">
        <el-icon><icon-menu /></el-icon>
        <template #title>Video</template>
      </el-menu-item>
      <el-menu-item index="Audio">
        <el-icon><document /></el-icon>
        <template #title>Audio</template>
      </el-menu-item>
      <el-menu-item index="Text">
        <el-icon><setting /></el-icon>
        <template #title>Text</template>
      </el-menu-item>
    </el-menu>
    <ResourceItemList :type="resourceType"></ResourceItemList>
  </div>
</template>
<script setup lang="ts">
import { Document, Menu as IconMenu, Setting } from '@element-plus/icons-vue';
import ResourceItemList from './ResourceItemList.vue';
import { ref } from 'vue';
const resourceType = ref('Video');
const handleTypeChange = (val: string) => {
  resourceType.value = val;
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
}
</style>
