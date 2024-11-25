<script setup lang="ts">
defineProps<{
  active: boolean
  icon?: any
}>()
</script>

<template>
  <button
    class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
    :class="[
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    ]"
  >
    <component 
      v-if="icon" 
      :is="icon" 
      class="w-5 h-5"
    />
    <slot />
  </button>
</template>