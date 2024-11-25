<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <button
    class="px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm text-left"
  >
    {{ name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }}
  </button>
</template>