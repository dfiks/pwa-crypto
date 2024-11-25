<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  modelValue: string
  options: Array<{ value: string, label: string }>
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref<HTMLDivElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const selectOption = (value: string) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

const getSelectedLabel = () => {
  return props.options.find(option => option.value === props.modelValue)?.label
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="selectRef" class="relative">
    <button
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      <span>{{ getSelectedLabel() }}</span>
      <ChevronDownIcon 
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 animate-in fade-in slide-in-from-top-2"
    >
      <button
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option.value)"
        class="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        :class="[
          option.value === modelValue 
            ? 'text-blue-600 dark:text-blue-400 font-medium' 
            : 'text-gray-700 dark:text-gray-200'
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-in {
  animation: animate-in 0.2s ease-out;
}

.fade-in {
  opacity: 0;
  animation: fade-in 0.2s ease-out forwards;
}

.slide-in-from-top-2 {
  transform: translateY(-0.5rem);
  animation: slide-in-from-top 0.2s ease-out forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in-from-top {
  from {
    transform: translateY(-0.5rem);
  }
  to {
    transform: translateY(0);
  }
}
</style>