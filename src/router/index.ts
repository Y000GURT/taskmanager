import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import UpcomingTodos from '@/components/UpcomingTodos.vue'
import ArchiveTodos from '@/components/ArchiveTodos.vue'
import TodayTodos from '@/components/TodayTodos.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: LoginForm
  },
  {
    path: '/upcomingtodos',
    component: UpcomingTodos,
  },
  {
    path: '/archive',
    component: ArchiveTodos,
  },
  {
    path: '/today',
    component: TodayTodos,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
