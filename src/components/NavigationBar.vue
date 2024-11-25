<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { 
  Squares2X2Icon as ViewGridIcon,
  ChartBarSquareIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  CogIcon,
  BoltIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const route = useRoute()

const isActive = (path: string): boolean => route.path === path
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-transparent transition-transform duration-300">
    <div class="container mx-auto max-w-lg px-4 py-4">
      <div class="flex items-center justify-between px-8 py-3 bg-[#0a0b1e]/90 backdrop-blur-lg rounded-full shadow-lg">
        <button @click="router.push('/')" 
                :class="isActive('/') ? 'text-[#ff7eb6] scale-110' : 'text-gray-400'"
                class="p-2 transition-all duration-200 hover:scale-110 active:scale-95">
          <ViewGridIcon class="h-5 w-5" />
        </button>
        
        <button @click="router.push('/signals')"
                :class="isActive('/signals') ? 'text-[#ff7eb6] scale-110' : 'text-gray-400'"
                class="p-2 transition-all duration-200 hover:scale-110 active:scale-95">
          <ChartBarSquareIcon class="h-5 w-5" />
        </button>
        
        <button @click="router.push('/analytics')"
                :class="isActive('/analytics') ? 'text-[#ff7eb6] scale-110' : 'text-gray-400'"
                class="p-2 transition-all duration-200 hover:scale-110 active:scale-95">
          <ChartPieIcon class="h-5 w-5" />
        </button>
        
        <button @click="router.push('/auto-trading')"
                :class="isActive('/auto-trading') ? 'text-[#ff7eb6] scale-110' : 'text-gray-400'"
                class="p-2 transition-all duration-200 hover:scale-110 active:scale-95">
          <BoltIcon class="h-5 w-5" />
        </button>
        
        <button @click="router.push('/portfolio')"
                :class="isActive('/portfolio') ? 'text-[#ff7eb6] scale-110' : 'text-gray-400'"
                class="p-2 transition-all duration-200 hover:scale-110 active:scale-95">
          <CurrencyDollarIcon class="h-5 w-5" />
        </button>
        
        <button @click="router.push('/settings')"
                :class="isActive('/settings') ? 'text-[#ff7eb6] scale-110' : 'text-gray-400'"
                class="p-2 transition-all duration-200 hover:scale-110 active:scale-95">
          <CogIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </nav>
</template>