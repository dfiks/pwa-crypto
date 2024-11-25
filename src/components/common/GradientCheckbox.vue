<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  modelValue: boolean
  label?: string
}>()

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label class="inline-flex items-center cursor-pointer group">
    <div class="relative flex items-center justify-center">
      <input
        type="checkbox"
        class="peer sr-only"
        :checked="modelValue"
        @change="toggle"
      />
      
      <div
        class="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400"
      >
        <CheckIcon 
          class="w-3.5 h-3.5 text-white transform transition-transform duration-200"
          :class="modelValue ? 'scale-100' : 'scale-0'"
        />
      </div>
    </div>
    
    <span 
      v-if="label"
      class="ml-2 text-sm text-gray-600 dark:text-gray-400"
    >
      {{ label }}
    </span>
  </label>
</template>