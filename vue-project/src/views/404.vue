<template>
  <div class="404">当前路由：{{ router.path }}</div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
const router = useRoute();
</script>
