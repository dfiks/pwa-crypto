<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

const props = defineProps<{
  isOpen: boolean
  title: string
}>()

const emit = defineEmits(['close'])
const contentRef = ref<HTMLElement | null>(null)
let ps: PerfectScrollbar | null = null

const initScrollbar = () => {
  if (!contentRef.value || ps) return
  
  ps = new PerfectScrollbar(contentRef.value, {
    wheelSpeed: 1,
    wheelPropagation: false,
    minScrollbarLength: 20
  })
}

const destroyScrollbar = () => {
  if (ps) {
    ps.destroy()
    ps = null
  }
}

watch(() => props.isOpen, (isOpen) => {
  nextTick(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      initScrollbar()
    } else {
      document.body.style.overflow = ''
      destroyScrollbar()
    }
  })
})

onMounted(() => {
  if (props.isOpen) {
    document.body.style.overflow = 'hidden'
    initScrollbar()
  }
})

onUnmounted(() => {
  destroyScrollbar()
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[999] overflow-y-auto">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
           @click="emit('close')">
      </div>

      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative w-full max-w-2xl transform rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-left shadow-xl transition-all">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ title }}
            </h3>
            <button 
              @click="emit('close')"
              class="rounded-lg p-1.5 sm:p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <!-- Content -->
          <div ref="contentRef" class="max-h-[calc(100vh-12rem)] overflow-hidden">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

:deep(.ps) {
  position: relative;
}

:deep(.ps__rail-y) {
  background-color: transparent !important;
  width: 10px !important;
  z-index: 80;
  opacity: 0;
  transition: opacity 0.3s ease, background-color 0.2s ease !important;
}

:deep(.ps__rail-y:hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.dark :deep(.ps__rail-y:hover) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

:deep(.ps--active-y:hover) .ps__rail-y,
:deep(.ps--active-y.ps--scrolling-y) .ps__rail-y {
  opacity: 1;
}

:deep(.ps__thumb-y) {
  background-color: rgba(156, 163, 175, 0.3) !important;
  border-radius: 5px !important;
  width: 6px !important;
  transition: background-color 0.2s ease, width 0.2s ease !important;
}

:deep(.ps__rail-y:hover) .ps__thumb-y {
  background-color: rgba(156, 163, 175, 0.5) !important;
  width: 8px !important;
}

.dark :deep(.ps__thumb-y) {
  background-color: rgba(156, 163, 175, 0.2) !important;
}

.dark :deep(.ps__rail-y:hover) .ps__thumb-y {
  background-color: rgba(156, 163, 175, 0.4) !important;
}
</style>