<template>
<div></div>
</template>

<script setup>
import { ref } from "vue"
import { useStore } from "vuex"
import * as Cesium from "cesium"

const store = useStore()
const { viewer } = store.state;

viewer.camera.flyTo({
  // 从以度为单位的经度和纬度值返回笛卡尔三维坐标
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
  orientation: {
    heading: Cesium.Math.toRadians(0.0), // 正东, 默认北
    pitch: Cesium.Math.toRadians(-90), // 向正下方看
    roll: 0.0 // 左右
  },
  duration: 3, // 飞行时间
})


</script>

<style scoped>

</style>