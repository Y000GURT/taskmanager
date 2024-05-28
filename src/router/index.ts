import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import UpcomingTodos from '@/components/UpcomingTodos.vue'
import ArchiveTodos from '@/components/ArchiveTodos.vue'
import TodayTodos from '@/components/TodayTodos.vue'
import store from '../store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: LoginForm,
  },
  {
    path: '/upcomingtodos',
    component: UpcomingTodos,
    meta: {
      page: true
    },
  },
  {
    path: '/archive',
    component: ArchiveTodos,
    meta: {
      page: true
    }
  },
  {
    path: '/today',
    component: TodayTodos,
    meta: {
      page: true
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  if (to.meta.page && !store.getters.firstName) {
    return '/'
  }
  return true
}) 


export default router
