<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Page not found</p>
      <button 
        @click="router.push('/')"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </button>
    </div>
  </div>
</template>