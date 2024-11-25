<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="space-y-2">
    <h4 class="text-sm font-medium text-gray-400">{{ title }}</h4>
    <slot></slot>
  </div>
</template>