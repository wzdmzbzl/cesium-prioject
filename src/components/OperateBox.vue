
<script setup>
</script>
<template>
  <div class="container">
    <slot></slot>
  </div>
</template>
<style lang='less' scoped>
.container {
  position: absolute;
  z-index: 100;
  // width: 300px;
  // left: 0;
  // top: 0;
  // bottom: 0;
  // background: rgba(0, 0, 0, 0.8);
}
</style>