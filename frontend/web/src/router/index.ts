/* eslint-disable @typescript-eslint/explicit-function-return-type */

// Composables
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/alert/:id',
    name: 'Alert',
    component: () => import('@/views/alert/Alert.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
