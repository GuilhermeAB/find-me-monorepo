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
    path: '/about',
    name: 'About',
    component: () => import('@/views/about/About.vue'),
  },
  {
    path: '/alert/:id',
    name: 'Alert',
    component: () => import('@/views/alert/Alert.vue'),
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('@/views/authentication/Authentication.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/Profile.vue'),
  },
  {
    path: '/verification/:code?',
    name: 'Verification',
    component: () => import('@/views/account-verification/AccountVerification.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
