import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('../views/ResultView.vue'),
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('../views/ResumeView.vue'),
    },
      {
    path: '/selfpr',
    name: 'selfpr',
    component: () => import('../views/SelfPRView.vue'),
  },
  {
    path: '/summary',
    name: 'summary',
    component: () => import('../views/SummaryView.vue'),
  },
  ],
})

export default router
