<template>
  <div id="app" class="layout">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts">

</script>
<style lang="scss">


.layout{
  .el-header{
    height: 60px;
    background:rgba(23, 24, 26, 1);
  }

}
</style>