<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { XMarkIcon, BeakerIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

import AutoTradingDebug from './pages/AutoTradingDebug.vue'

const route = useRoute()
const isPanelVisible = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const toggleButtonRef = ref<HTMLElement | null>(null)
let ps: PerfectScrollbar | null = null

// Dragging state
const isDragging = ref(false)
const position = ref({ x: 20, y: window.innerHeight / 2 })
const dragStart = ref({ x: 0, y: 0 })

const currentPage = computed(() => {
  const path = route.path
  if (path.startsWith('/auto-trading')) return 'auto-trading'
  return null
})

const buttonStyle = computed(() => ({
  transform: `translate(${position.value.x}px, ${position.value.y}px)`,
  cursor: isDragging.value ? 'grabbing' : 'grab'
}))

const togglePanel = () => {
  if (!isDragging.value) {
    isPanelVisible.value = !isPanelVisible.value
  }
}

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

const handleMouseDown = (e: MouseEvent) => {
  if (!toggleButtonRef.value) return
  
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  const maxX = window.innerWidth - (toggleButtonRef.value?.offsetWidth || 0)
  const maxY = window.innerHeight - (toggleButtonRef.value?.offsetHeight || 0)
  
  position.value = {
    x: Math.min(Math.max(0, e.clientX - dragStart.value.x), maxX),
    y: Math.min(Math.max(0, e.clientY - dragStart.value.y), maxY)
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

// Touch events for mobile
const handleTouchStart = (e: TouchEvent) => {
  if (!toggleButtonRef.value) return
  
  isDragging.value = true
  dragStart.value = {
    x: e.touches[0].clientX - position.value.x,
    y: e.touches[0].clientY - position.value.y
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  
  const maxX = window.innerWidth - (toggleButtonRef.value?.offsetWidth || 0)
  const maxY = window.innerHeight - (toggleButtonRef.value?.offsetHeight || 0)
  
  position.value = {
    x: Math.min(Math.max(0, e.touches[0].clientX - dragStart.value.x), maxX),
    y: Math.min(Math.max(0, e.touches[0].clientY - dragStart.value.y), maxY)
  }
  
  e.preventDefault()
}

const handleTouchEnd = () => {
  isDragging.value = false
}

const handleResize = () => {
  const maxX = window.innerWidth - (toggleButtonRef.value?.offsetWidth || 0)
  const maxY = window.innerHeight - (toggleButtonRef.value?.offsetHeight || 0)
  
  position.value = {
    x: Math.min(position.value.x, maxX),
    y: Math.min(position.value.y, maxY)
  }
}

watch(() => isPanelVisible.value, (isVisible) => {
  if (isVisible) {
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      initScrollbar()
    })
  } else {
    document.body.style.overflow = ''
    destroyScrollbar()
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  destroyScrollbar()
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="currentPage" class="fixed inset-0 pointer-events-none z-[1000]">
    <div class="relative w-full h-full">
      <!-- Toggle Button -->
      <button
        ref="toggleButtonRef"
        @click="togglePanel"
        @mousedown="handleMouseDown"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        class="absolute bg-gray-900 dark:bg-gray-800 text-white p-2 rounded-lg shadow-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors pointer-events-auto"
        :style="buttonStyle"
      >
        <BeakerIcon class="w-5 h-5" />
      </button>

      <!-- Debug Panel -->
      <div
        v-if="isPanelVisible"
        class="fixed right-0 top-0 bottom-0 w-80 bg-gray-900 dark:bg-gray-800 shadow-xl pointer-events-auto"
      >
        <!-- Header -->
        <div class="p-4 border-b border-gray-800 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">Debug Panel</h3>
            <button
              @click="togglePanel"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div ref="contentRef" class="h-[calc(100vh-64px)] overflow-hidden">
          <div class="p-4">
            <component 
              :is="currentPage === 'auto-trading' ? AutoTradingDebug : null"
              v-bind="$attrs"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>