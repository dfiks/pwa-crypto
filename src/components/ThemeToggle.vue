<script setup lang="ts">
import { useThemeStore } from '../stores/theme'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const themeStore = useThemeStore()
</script>

<template>
  <button 
    @click="themeStore.toggleTheme"
    class="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
    :title="themeStore.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
  >
    <SunIcon v-if="themeStore.theme === 'dark'" class="w-5 h-5 text-gray-600 dark:text-gray-300" />
    <MoonIcon v-else class="w-5 h-5 text-gray-600 dark:text-gray-300" />
  </button>
</template>