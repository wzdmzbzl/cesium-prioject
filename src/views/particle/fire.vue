<template>
  <Operate-box>
    <el-button type="primary" @click="onInit">渲染火焰</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </Operate-box>
</template>

<script setup>
import { onUnmounted } from "vue"
import FireEffect from "@/utils/cesiumCtrl/fire.js"
import { useStore } from "vuex"
import * as Cesium from "cesium"
import { sleep } from "@/common/utils"

const store = useStore()
const { viewer } = store.state

let fire;
const onInit = async () => {
  // 将相机从当前位置移动到新位置。
  viewer.camera.flyTo({
    // destination: 摄像机在WGS84（世界）坐标中的最终位置或从上向下视图中可见的矩形。
    // 从以度为单位的经度和纬度值返回笛卡尔3位置
    destination: Cesium.Cartesian3.fromDegrees(120.361, 36.0885, 80),
    // 包含方向和向上属性或航向，俯仰和横滚属性的对象。默认情况下，方向将指向在3D中朝向帧中心，在哥伦布视图中沿负z方向。向上方向将指向3D局部正北哥伦布视图中的y方向。在无限滚动模式下，二维不使用方向。
    orientation: {
      direction: new Cesium.Cartesian3(0.7458181136018, -0.4270255968894706, 0.5112773034515067),
      up: new Cesium.Cartesian3(-0.19274344830978868, 0.5963500021825172, 0.7792410654159365)
    },
    duration: 3, // 飞行时间
  })

  // 飞行时间后向下执行代码
  await sleep(3000)
  fire = new FireEffect(viewer)
}

const onClear = () => {
  fire.remove()
}

onUnmounted(() => {
  if (fire) {
    fire.remove()
  }
})


</script>

<style scoped>

</style>