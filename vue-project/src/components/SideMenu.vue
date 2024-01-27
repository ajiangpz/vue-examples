<template>
  <ElMenu
    :default-active="activeRoute"
    class="el-menu-vertical"
    @select="handleMenuSelect"
  >
    <ElMenuItem v-for="menu in props.menuItems" :index="menu.route">
      <span slot="title">{{ menu.text }}</span>
    </ElMenuItem>
  </ElMenu>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
interface MenuItem {
  text: string;
  route: string;
}
const props = defineProps({
  menuItems: {
    type: Object as PropType<MenuItem[]>,
    default: () => {},
  },
});
const activeRoute = ref("/");

const handleMenuSelect = (index: string) => {
  activeRoute.value = index;
  router.push(index);
};
</script>
<style lang="scss">
.el-menu-vertical {
  width: 200px;
}
</style>
