<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { XMarkIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  isOpen: boolean
  type: 'percentage' | 'investment' | 'number'
  currentValue: number
  isEditing: boolean
  targetElement: HTMLElement | null
}>()

const emit = defineEmits(['close', 'update:value', 'edit', 'stop-edit'])
const popoverRef = ref<HTMLElement | null>(null)

const updatePosition = async () => {
  await nextTick()
  if (!popoverRef.value || !props.targetElement) return

  const targetRect = props.targetElement.getBoundingClientRect()
  const popoverRect = popoverRef.value.getBoundingClientRect()
  const padding = 8

  // Match input width
  const width = targetRect.width
  if (popoverRef.value) {
    popoverRef.value.style.width = `${width}px`
  }

  // Calculate position
  const spaceBelow = window.innerHeight - targetRect.bottom
  const spaceAbove = targetRect.top

  let left = targetRect.left
  let top

  if (spaceBelow >= popoverRect.height + padding) {
    top = targetRect.bottom + padding
  } else if (spaceAbove >= popoverRect.height + padding) {
    top = targetRect.top - popoverRect.height - padding
  } else {
    top = Math.max(padding, (window.innerHeight - popoverRect.height) / 2)
  }

  if (popoverRef.value) {
    popoverRef.value.style.top = `${top}px`
    popoverRef.value.style.left = `${left}px`
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (popoverRef.value && !popoverRef.value.contains(event.target as Node)) {
    emit('close')
  }
}

const getQuickActions = () => {
  if (props.type === 'investment') {
    return {
      multiply: [
        { label: '×2', value: props.currentValue * 2 },
        { label: '×4', value: props.currentValue * 4 },
        { label: '×8', value: props.currentValue * 8 },
        { label: '×10', value: props.currentValue * 10 }
      ],
      divide: [
        { label: '÷2', value: props.currentValue / 2 },
        { label: '÷4', value: props.currentValue / 4 },
        { label: '÷8', value: props.currentValue / 8 },
        { label: '÷10', value: props.currentValue / 10 }
      ],
      presets: [
        { label: '$10', value: 10 },
        { label: '$50', value: 50 },
        { label: '$100', value: 100 },
        { label: '$300', value: 300 },
        { label: '$500', value: 500 },
        { label: '$1000', value: 1000 }
      ]
    }
  }
  
  if (props.type === 'percentage') {
    return {
      multiply: [
        { label: '×2', value: Math.min(props.currentValue * 2, 100) },
        { label: '×3', value: Math.min(props.currentValue * 3, 100) },
        { label: '×4', value: Math.min(props.currentValue * 4, 100) },
        { label: '×5', value: Math.min(props.currentValue * 5, 100) }
      ],
      divide: [
        { label: '÷2', value: props.currentValue / 2 },
        { label: '÷3', value: props.currentValue / 3 },
        { label: '÷4', value: props.currentValue / 4 },
        { label: '÷5', value: props.currentValue / 5 }
      ],
      presets: [
        { label: '10%', value: 10 },
        { label: '25%', value: 25 },
        { label: '50%', value: 50 },
        { label: '75%', value: 75 },
        { label: '100%', value: 100 }
      ]
    }
  }

  return {
    multiply: [
      { label: '×2', value: props.currentValue * 2 },
      { label: '×5', value: props.currentValue * 5 },
      { label: '×10', value: props.currentValue * 10 }
    ],
    divide: [
      { label: '÷2', value: props.currentValue / 2 },
      { label: '÷5', value: props.currentValue / 5 },
      { label: '÷10', value: props.currentValue / 10 }
    ],
    presets: [
      { label: '10', value: 10 },
      { label: '50', value: 50 },
      { label: '100', value: 100 },
      { label: '500', value: 500 },
      { label: '1000', value: 1000 }
    ]
  }
}

const updateValue = (value: number) => {
  emit('update:value', value)
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition)
  updatePosition()
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition)
})

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    updatePosition()
  }
})
</script>

<template>
  <div ref="popoverRef"
       class="fixed z-[999] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
        Quick Actions
      </h3>
      <button 
        @click="emit('close')"
        class="p-1.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Value Modifiers -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Multiply Actions -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-green-600 dark:text-green-400">
          Multiply
        </h4>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="action in getQuickActions().multiply"
            :key="action.label"
            @click="updateValue(action.value)"
            class="px-3 py-2 text-sm font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            {{ action.label }}
          </button>
        </div>
      </div>

      <!-- Divide Actions -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-red-600 dark:text-red-400">
          Divide
        </h4>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="action in getQuickActions().divide"
            :key="action.label"
            @click="updateValue(action.value)"
            class="px-3 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Preset Values -->
    <div class="space-y-2">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
        Preset Values
      </h4>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="preset in getQuickActions().presets"
          :key="preset.label"
          @click="updateValue(preset.value)"
          class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- Manual Edit -->
    <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="props.isEditing ? emit('stop-edit') : emit('edit')"
        class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="[
          props.isEditing
            ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50'
            : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50'
        ]"
      >
        <PencilSquareIcon class="w-4 h-4" />
        {{ props.isEditing ? 'Stop Manual Edit' : 'Manual Edit' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.dark .shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
}

.dark .shadow-xl {
  --tw-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.5);
  --tw-shadow-colored: 0 8px 25px -5px var(--tw-shadow-color);
}
</style>