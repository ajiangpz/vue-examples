<template>
  <div class="wrapper">
    <el-menu :default-active="resourceType" class="el-menu" :collapse="true" @select="handleTypeChange">
      <el-menu-item v-for="(item) in showMenuData" :index="item.key">
        <el-icon>
          <component :is="item.icon"> </component>
        </el-icon>
        <el-icon> </el-icon>
        <template #title>{{ item.key }}</template>
      </el-menu-item>
    </el-menu>
    <ResourceItemList :resource-type="resourceType"></ResourceItemList>
  </div>
</template>
<script setup lang="ts">
import ResourceItemList from './ResourceItemList.vue';
import { ref, computed } from 'vue';
import { menuData } from '@/data/baseMenu';
const resourceType = ref('video');
const handleTypeChange = (val: string) => {
  resourceType.value = val;
};
const showMenuData = computed(() => {
  return menuData.map((item) => {
    item.active = item.key === resourceType.value;
    return item;
  });
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;

  .el-menu {
    margin-right: 8px;
  }
}
</style>
