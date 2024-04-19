import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('../views/home/index.vue'),
    name: 'Home'
  },
  {
    path: '/three-demo',
    component: () => import('../views/three-demo/index.vue'),
    name: 'ThreeDemo'
  },
  {
    path: '/three',
    component: () => import('../views/three/index.vue'),
    name: 'Three'
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    console.log('savedPosition', from, savedPosition);
    if (from.name && savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, top: 0 };
    }
  }
});

export default router;