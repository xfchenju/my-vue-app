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

  // 2. 创建场景
  const scene = new THREE.Scene();

  // 3. 创建相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(5, 5, 10);

  camera.lookAt(0, 0, 0);

  // 4. 创建物体
  const axis = new THREE.AxesHelper(5);
  scene.add(axis);

  // // 2. 初始化纹理加载器
  const textloader = new THREE.TextureLoader();

  // 添加立方体
  const geometry = new THREE.BoxGeometry(4, 4, 4);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  // const material = [
  //   new THREE.MeshBasicMaterial({
  //     map: textloader.load(floor),
  //   }),
  //   new THREE.MeshBasicMaterial({
  //     map: textloader.load(floor),
  //   }),
  //   new THREE.MeshBasicMaterial({
  //     map: textloader.load(floor),
  //   }),
  //   new THREE.MeshBasicMaterial({
  //     map: textloader.load(floor),
  //   }),
  //   new THREE.MeshBasicMaterial({
  //     map: textloader.load(floor),
  //   }),
  //   new THREE.MeshBasicMaterial({
  //     map: textloader.load(floor),
  //   }),
  // ]
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.rotation.y = Math.PI / 4;

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime(); // 返回已经过去的时间, 以秒为单位
    cube.rotation.y = elapsedTime * Math.PI; // 两秒自转一圈

    renderer.render(scene, camera);
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // 2.
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // 3.
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  // 1. 渲染器能够渲染阴影效果
  renderer.shadowMap.enabled = true;

  // 2. 该方向会投射阴影效果
  directionalLight.castShadow = true;

  // 3.
  cube.castShadow = true;

  // 4.
  const planeGeometry = new THREE.PlaneGeometry(20, 20);

  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.rotation.x = -0.5 * Math.PI;
  planeMesh.position.set(0, -3, 0);
  planeMesh.receiveShadow = true;
  scene.add(planeMesh);

  // // 3. 给地板加载纹理
  const planeMaterialLeft = new THREE.MeshStandardMaterial({
    map: textloader.load(floor),
  });
  const planeMeshLeft = new THREE.Mesh(planeGeometry, planeMaterialLeft);
  planeMeshLeft.rotation.x = -0.25 * Math.PI;
  planeMeshLeft.position.set(0, -6, 0);
  planeMeshLeft.receiveShadow = true;
  scene.add(planeMeshLeft);

  // 5. 方向光的辅助线
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
  );
  scene.add(directionalLightHelper); // 辅助线\

  // 5. 渲染
  // renderer.render(scene, camera);
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
