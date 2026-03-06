import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '数据看板', icon: 'DataAnalysis' }
      },
      {
        path: 'coaches',
        name: 'Coaches',
        component: () => import('@/views/coach/CoachList.vue'),
        meta: { title: '教练管理', icon: 'User' }
      },
      {
        path: 'students',
        name: 'Students',
        component: () => import('@/views/student/StudentList.vue'),
        meta: { title: '学员管理', icon: 'UserFilled' }
      },
      {
        path: 'courses',
        name: 'Courses',
        component: () => import('@/views/course/CourseList.vue'),
        meta: { title: '课程管理', icon: 'Reading' }
      },
      {
        path: 'leave',
        name: 'Leave',
        component: () => import('@/views/leave/LeaveList.vue'),
        meta: { title: '请假审批', icon: 'DocumentChecked' }
      },
      {
        path: 'financial',
        name: 'Financial',
        component: () => import('@/views/financial/FinancialList.vue'),
        meta: { title: '财务管理', icon: 'Money' }
      },
      {
        path: 'content',
        name: 'Content',
        component: () => import('@/views/content/ContentList.vue'),
        meta: { title: '内容管理', icon: 'Picture' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
