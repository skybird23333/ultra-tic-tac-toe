import { createRouter, createWebHistory } from 'vue-router'
import SPView from '../views/SinglePlayerView.vue'
import HomeView from '@/views/HomeView.vue'
import MPView from '@/views/MultiPlayerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game',
      name: 'sp',
      component: SPView
    },
    {
      path: '/game-mp',
      name: 'mp',
      component: MPView
    }
  ]
})

export default router
