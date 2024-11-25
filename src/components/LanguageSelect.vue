<script setup>
import BottomSheet from './BottomSheet.vue'
import { CheckIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  isOpen: Boolean,
  selected: String,
  options: Array
})

const emit = defineEmits(['update:is-open', 'select'])

const selectOption = (value) => {
  emit('select', value)
}

const updateIsOpen = (value) => {
  emit('update:is-open', value)
}
</script>

<template>
  <BottomSheet
    :is-open="isOpen"
    @update:is-open="updateIsOpen"
    title="Select Language"
  >
    <div class="space-y-2">
      <button
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option.value)"
        class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span class="text-gray-900 dark:text-gray-100">{{ option.label }}</span>
        <CheckIcon 
          v-if="option.value === selected"
          class="w-5 h-5 text-blue-600 dark:text-blue-400" 
        />
      </button>
    </div>
  </BottomSheet>
</template>