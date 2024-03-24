<template>
  <div class="resource-list">{{ type }}</div>
</template>

<script setup lang="ts">
defineProps({
  type: String,
});
</script>

<style scoped></style>
