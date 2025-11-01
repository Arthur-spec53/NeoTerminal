import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // 公开页面
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPassword.vue')
  },
  
  // 需要认证的页面
  {
    path: '/',
    component: () => import('@/components/layout/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      // 仪表盘
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      
      // 使用文档
      {
        path: 'docs',
        name: 'Docs',
        component: () => import('@/views/Docs.vue')
      },
      
      // 订阅模块
      {
        path: 'subscription',
        children: [
          {
            path: 'plans',
            name: 'Plans',
            component: () => import('@/views/subscription/Plans.vue')
          }
        ]
      },
      
      // 节点
      {
        path: 'nodes',
        name: 'Nodes',
        component: () => import('@/views/Nodes.vue')
      },
      
      // 财务模块
      {
        path: 'billing',
        children: [
          {
            path: 'orders',
            name: 'Orders',
            component: () => import('@/views/billing/Orders.vue')
          },
          {
            path: 'invite',
            name: 'Invite',
            component: () => import('@/views/billing/Invite.vue')
          },
          {
            path: 'create-order',
            name: 'CreateOrder',
            component: () => import('@/views/billing/CreateOrder.vue')
          }
        ]
      },
      
      // 用户模块
      {
        path: 'user',
        children: [
          {
            path: 'profile',
            name: 'Profile',
            component: () => import('@/views/user/Profile.vue')
          },
          {
            path: 'tickets',
            name: 'Tickets',
            component: () => import('@/views/user/Tickets.vue')
          },
          {
            path: 'tickets/:id',
            name: 'TicketDetails',
            component: () => import('@/views/user/Ticket.vue')
          },
          {
            path: 'traffic',
            name: 'Traffic',
            component: () => import('@/views/user/Traffic.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
