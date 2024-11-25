<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  title: string
  icon?: any
  defaultOpen?: boolean
}>()

const isOpen = ref(props.defaultOpen || false)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Header -->
    <button 
      @click="toggle"
      class="w-full flex items-center justify-between p-4 text-left"
    >
      <div class="flex items-center gap-3">
        <div 
          v-if="icon"
          class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
        >
          <component 
            :is="icon" 
            class="w-4 h-4 text-blue-600 dark:text-blue-400"
          />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
          {{ title }}
        </h3>
      </div>
      <ChevronDownIcon 
        class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Content -->
    <div
      v-show="isOpen"
      class="p-4 pt-0"
    >
      <div class="border-t border-gray-100 dark:border-gray-700 pt-4">
        <slot />
      </div>
    </div>
  </div>
</template>