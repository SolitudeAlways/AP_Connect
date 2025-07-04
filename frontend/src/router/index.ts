  import { createRouter, createWebHistory } from 'vue-router'
  import LoginForm from '../components/auth/LoginForm.vue'
  import RegisterForm from '../components/auth/RegisterForm.vue'
  import Dashboard from '../components/Dashboard/Dashboard.vue'


  const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginForm },
    { path: '/register', component: RegisterForm },
    { path: '/dashboard', component: Dashboard }
  ]

  const router = createRouter({
    history: createWebHistory(),
    routes
  })

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token') // или другой способ проверки
  if (to.path === '/dashboard' && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router