<template>
  <div class="container">
    <div ref="threeRef" class="three-container"></div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, ref } from "vue";
import floor from "@/assets/images/test.png";

const threeRef = ref();
onMounted(() => {
  // 1. 创建渲染器,指定渲染的分辨率和尺寸,然后添加到body中
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.pixelRatio = window.devicePixelRatio;
  renderer.setSize(window.innerWidth, window.innerHeight);
  threeRef.value.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;
  camera.position.set(5, 5, 10);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  // 4. 创建物体
  const axis = new THREE.AxesHelper(5);
  scene.add(axis);

  // 添加立方体
  const geometry = new THREE.BoxGeometry(4, 4, 4);
  const material = new THREE.MeshStandardMaterial({ color: 'lightcyan' });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.rotation.y = Math.PI / 4;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime(); // 返回已经过去的时间, 以秒为单位
    cube.rotation.y = elapsedTime * Math.PI; // 两秒自转一圈

    renderer.render(scene, camera);
  }

  animate();
});
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: lightblue;
  .three-container {
    width: 100%;
    height: 100%;
  }
}
</style>
