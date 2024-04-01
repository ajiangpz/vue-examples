<template>
  <div class="resource-list">
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in result" :label="item.title" :name="index">{{ item.title }}</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { getdata } from "@/api/mock";
import { useRequest } from 'vue-hooks-plus';
import { ref } from "vue";
const props = defineProps({
  resourceType: {
    type: [String, Number],
    default: "video"
  }
});
const activeName = ref(0)
const { data: result } = useRequest(() => getdata(props.resourceType));
console.log(result)

const handleClick = (data: number) => {
  console.log(data);
}

</script>

<style scoped></style>
