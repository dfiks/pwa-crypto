import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VMoney3 } from 'v-money3'
import Vue3Toastify from 'vue3-toastify'
import { createRouter, createWebHistory } from 'vue-router'
import 'vue3-toastify/dist/index.css'
import './style.css'
import App from './App.vue'

// Import all page components
const pages = import.meta.glob('./pages/**/*.vue')

// Generate routes from pages
const routes = Object.entries(pages).map(([path, component]) => {
  // Convert file path to route path
  const routePath = path
    .replace('./pages', '')
    .replace('.vue', '')
    .replace('/index', '')
    .replace(/\[(\w+)\]/g, ':$1')
    || '/'

  return {
    path: routePath,
    component
  }
})

// Add register route
routes.push({
  path: '/register',
  component: () => import('./pages/register/index.vue')
})

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create pinia instance
const pinia = createPinia()

// Initialize app
const initApp = async () => {
  const app = createApp(App)
  
  // Setup MSW in development
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start()
  }
  
  app.use(pinia)
  app.use(router)
  app.use(Vue3Toastify, { autoClose: 3000 })
  app.directive('money3', VMoney3)
  
  app.mount('#app')
}

initApp()