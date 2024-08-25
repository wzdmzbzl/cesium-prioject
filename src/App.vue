<template>
  <el-container>
    <el-aside>
      <Menu></Menu>
    </el-aside>
    <el-container>
      <el-main>
        <div id="cesiumContainer"></div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>


<script setup>
import { onMounted } from "vue"
import store from "@/store/store.js"
import * as Cesium from "cesium"

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYWE5M2QzNy1hNGFjLTQ3YzItYmU0ZS05MDkyODc1MzVhNzAiLCJpZCI6MTE1MDQwLCJpYXQiOjE2Njg1OTA2NDh9.oW-_utGumUSPqYzlWGjhG8hbda-b4UxZdL0_2t4ASig";

onMounted(() => {
  init()
})

const init = () => {
  const viewer = new Cesium.Viewer('cesiumContainer', {
    infoBox: false, // 用于显示信息或描述的小部件。
    timeline: false,// 是否显示时间线控件
    // 显示图像
    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    }), // 提供由 ArcGIS MapServer 托管的切片图像。默认情况下，使用服务器的预缓存切片
    // 椭圆体的表面提供地形或其他几何图形
    terrainProvider: new Cesium.CesiumTerrainProvider({
      url: "http://data.marsgis.cn/terrain", // Cesium 地形服务器的 URL
    })
  })
  // 不显示底图
  // viewer.imageryLayers.get(0).show = false

  // 去除logo
  viewer.cesiumWidget.creditContainer.style.display = "none"
  // 显示帧率
  viewer.scene.debugShowFramesPerSecond = true;
  // 开启或者关闭深度检测，默认是关闭的
  viewer.scene.globe.depthTestAgainstTerrain = true

  store.commit('initViewer', viewer)
  // 外天空盒
  viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
      positiveX: "/images/Standard-Cube-Map/px1.png",
      negativeX: "/images/Standard-Cube-Map/nx1.png",
      positiveY: "/images/Standard-Cube-Map/pz.png",
      negativeY: "/images/Standard-Cube-Map/nz1.png",
      positiveZ: "/images/Standard-Cube-Map/py.png",
      negativeZ: "/images/Standard-Cube-Map/ny1.png",
    }
  })

  // 调试使用,将实例挂载到window上
  window.viewer = viewer

  // 监听点击事件. 拾取坐标
  // 通过Cesium.ScreenSpaceEventHandler的实例化对象的setInputAction方法绑定鼠标事件
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
// setInputAction的第一个参数是当事件触发时的回调，第二个参数是绑定的事件类型。
  handler.setInputAction((e) => {
    // 获取世界坐标（Cartesian3）
    const clickPosition = viewer.scene.camera.pickEllipsoid(e.position)
    // Cartesian3 笛卡尔坐标，又叫世界坐标，是一个三维空间中的点 ，具有xyz
    // Cartesian2 是二维空间中的点，通常是屏幕坐标
    // cartographic 和Cartesian3一样是三维空间中的点，但是单位是弧度，通常也叫椭球坐标
    // 经纬度 Cesium中没有具体的经纬度对象，要得到经纬度首先需要计算为弧度，再进行转换
    const randiansPos = Cesium.Cartographic.fromCartesian(clickPosition); // 通过笛卡尔坐标获取椭球坐标

    // 弧度转换为经纬度
    console.log("经度:" + Cesium.Math.toDegrees(randiansPos.longitude)+ ", 纬度:" +Cesium.Math.toDegrees(randiansPos.latitude));

  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}
</script>

<style scoped>
#cesiumContainer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.el-header {
  height: 30px;
}
.el-container {
  height: 100vh;
}
.el-main {
  padding: 0 !important;
  position: relative;
}
.el-aside {
  width: auto;
}
</style>