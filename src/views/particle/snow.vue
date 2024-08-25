<template>
  <div class="container">
    <el-button type="primary" @click="start">开始</el-button>
    <el-button type="primary" @click="hide">停止</el-button>
  </div>
</template>
<script setup>
import SnowEffect from "@/utils/cesiumCtrl/snow.js"
import { useStore } from "vuex"
import { onUnmounted } from "vue"

onUnmounted(() => {
  snow.destroy()
})

const store = useStore()
const snow = new SnowEffect(store.state.viewer, {
  snowSize: 0.02,
  snowSpeed: 60.0
})

const hide = () => snow.show(false)

const start = () => snow.show(true)

</script>
<style scoped>
.container {
  position: absolute;
  z-index: 100;
}
</style>