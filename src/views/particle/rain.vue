<template>
  <div class="container">
    <el-button type="primary" @click="start">开始</el-button>
    <el-button type="primary" @click="hide">停止</el-button>
  </div>
</template>

<script setup>
import RainEffect from "@/utils/cesiumCtrl/rain.js"
import { useStore } from "vuex"
import { onUnmounted } from "vue"

const store = useStore()
const instance = new RainEffect(store.state.viewer, {
  tiltAngle: -0.2,
  rainSize: 1.0,
  rainSpeed: 120.0
})

const hide = () => {
  instance.show(false)
}
const start = () => {
  instance.show(true)
}

onUnmounted(() => {
  instance.destroy()
})

</script>

<style scoped>
.container {
  position: absolute;
  z-index: 100;
}
</style>