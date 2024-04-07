<template>
  <div class="resource-list">
    <el-select v-model="activeNames" @change="handleChange" style="width: 208px;margin-bottom: 16px;">
      <el-option v-for="(item, idx) in result" :label="item.title" :value="idx"></el-option>
    </el-select>
    <div class="item-content">
      <ResourceItem :type="resourceType" :data="resourceItem"
        v-for="(resourceItem, index) in result && result[activeNames].items" :key="index"></ResourceItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getdata } from "@/api/mock";
import { useRequest } from 'vue-hooks-plus';
import { ref, watchEffect } from "vue";
import ResourceItem from "./ResourceItem.vue";
const activeNames = ref(0);
const props = defineProps({
  resourceType: {
    type: [String],
    default: "video"
  }
});

const { data: result, refresh } = useRequest(() => getdata(props.resourceType));
const handleChange = (val: string[]) => {
  console.log(val);
}
watchEffect(() => {
  activeNames.value = 0;
  refresh();
})

</script>

<style scoped lang="scss">
.resource-list {
  max-width: 220px;
  overflow: hidden;
  margin-top: 8px;
}

.item-title {
  margin-bottom: 8px;
}

.item-content {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;

  .cover {
    margin-right: 8px;
    border-radius: 4px;
  }

  .resource-item {
    display: flex;
    flex-direction: column;
    align-items: center
  }
}
</style>
