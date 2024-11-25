<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

const props = defineProps({
  isOpen: Boolean,
  title: String
})

const emit = defineEmits(['update:isOpen', 'scroll-end'])

const sheet = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const handleRef = ref<HTMLElement | null>(null)
let ps: PerfectScrollbar | null = null
const minHeight = 300
const maxHeight = window.innerHeight - 20
const sheetVisible = ref(false)
const isDragging = ref(false)
const isFullyExpanded = ref(false)
let initialY = 0
let initialHeight = 0
let startTime = 0
let startY = 0

const handlePsScroll = () => {
  if (!contentRef.value || !isFullyExpanded.value || !ps) return
  
  const container = contentRef.value
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight
  
  if (scrollHeight - (scrollTop + clientHeight) < 50) {
    emit('scroll-end')
  }
}

const updateScrollbar = () => {
  if (!contentRef.value || !isFullyExpanded.value) {
    if (ps) {
      ps.destroy()
      ps = null
    }
    return
  }
  
  if (!ps && contentRef.value) {
    ps = new PerfectScrollbar(contentRef.value, {
      wheelSpeed: 1,
      wheelPropagation: false,
      minScrollbarLength: 20,
      suppressScrollX: true
    })
    contentRef.value.addEventListener('ps-scroll-y', handlePsScroll)
  } else if (ps) {
    ps.update()
  }
}

const expandSheet = () => {
  if (!sheet.value) return
  sheet.value.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  sheet.value.style.height = `${maxHeight}px`
  isFullyExpanded.value = true
  setTimeout(() => {
    updateScrollbar()
    if (contentRef.value) {
      contentRef.value.style.overflowY = 'auto'
    }
  }, 300)
}

const collapseSheet = () => {
  if (!sheet.value) return
  sheet.value.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  sheet.value.style.height = `${minHeight}px`
  isFullyExpanded.value = false
  if (contentRef.value) {
    contentRef.value.style.overflowY = 'hidden'
    contentRef.value.removeEventListener('ps-scroll-y', handlePsScroll)
  }
  if (ps) {
    ps.destroy()
    ps = null
  }
}

const handleStart = (y: number, target: HTMLElement) => {
  if (!sheet.value) return
  
  const isHandle = target === handleRef.value || target.closest('.sheet-handle')
  
  if (!isHandle && isFullyExpanded.value && contentRef.value?.scrollTop !== 0) {
    return
  }
  
  initialY = y
  startY = y
  startTime = Date.now()
  isDragging.value = true
  initialHeight = sheet.value.getBoundingClientRect().height
  sheet.value.style.transition = 'none'
}

const handleMove = (e: TouchEvent | MouseEvent) => {
  if (!sheet.value || !isDragging.value) return
  
  const y = 'touches' in e ? e.touches[0].clientY : e.clientY
  const deltaY = initialY - y
  
  if (isFullyExpanded.value && contentRef.value) {
    if (contentRef.value.scrollTop > 0 && deltaY > 0) return
  }
  
  const newHeight = Math.max(minHeight, Math.min(maxHeight, initialHeight + deltaY))
  sheet.value.style.height = `${newHeight}px`
}

const handleEnd = (y: number) => {
  if (!sheet.value || !isDragging.value) return
  
  isDragging.value = false
  const endTime = Date.now()
  const velocity = Math.abs(startY - y) / (endTime - startTime)
  const currentHeight = sheet.value.getBoundingClientRect().height
  const deltaY = initialY - y
  
  sheet.value.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  
  if (deltaY < -50 && currentHeight <= minHeight * 1.2) {
    emit('update:isOpen', false)
  } else if (currentHeight > (maxHeight + minHeight) / 2 || (deltaY > 0 && velocity > 0.5)) {
    expandSheet()
  } else {
    collapseSheet()
  }
}

const handleTouchStart = (e: TouchEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('.ps__rail-y')) return
  handleStart(e.touches[0].clientY, target)
}

const handleTouchMove = (e: TouchEvent) => {
  handleMove(e)
}

const handleTouchEnd = (e: TouchEvent) => {
  handleEnd(e.changedTouches[0].clientY)
}

const handleMouseDown = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('.ps__rail-y')) return
  handleStart(e.clientY, target)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  handleMove(e)
}

const handleMouseUp = (e: MouseEvent) => {
  handleEnd(e.clientY)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

onMounted(() => {
  window.addEventListener('resize', updateScrollbar)
})

onUnmounted(() => {
  if (ps) {
    ps.destroy()
    ps = null
  }
  if (contentRef.value) {
    contentRef.value.removeEventListener('ps-scroll-y', handlePsScroll)
  }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('resize', updateScrollbar)
})

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    sheetVisible.value = true
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => {
      if (sheet.value) {
        sheet.value.style.transform = 'translateY(0)'
        sheet.value.style.height = `${minHeight}px`
      }
    })
  } else {
    if (sheet.value) {
      sheet.value.style.transform = 'translateY(100%)'
    }
    setTimeout(() => {
      sheetVisible.value = false
      document.body.style.overflow = ''
      isFullyExpanded.value = false
      if (ps) {
        ps.destroy()
        ps = null
      }
    }, 300)
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="sheetVisible" 
         class="bottom-sheet-backdrop fixed inset-0 bg-black/50 dark:bg-black/70 z-[998]"
         @click="emit('update:isOpen', false)">
    </div>
  </Transition>
  
  <div v-if="sheetVisible"
       ref="sheet"
       class="bottom-sheet fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-t-[28px] z-[999] transform translate-y-full touch-none"
       :class="{ 'transition-none': isDragging }"
       :style="{ 
         height: `${minHeight}px`,
         ...(isFullyExpanded ? { height: `${maxHeight}px` } : {})
       }">
    <!-- Handle -->
    <div ref="handleRef"
         class="sheet-handle sticky top-0 w-full h-7 flex items-center justify-center cursor-grab active:cursor-grabbing bg-white dark:bg-gray-800 z-10 rounded-t-[28px] touch-none"
         @mousedown="handleMouseDown"
         @touchstart.prevent="handleTouchStart"
         @touchmove.prevent="handleTouchMove"
         @touchend.prevent="handleTouchEnd">
      <div class="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
    </div>
    
    <!-- Header -->
    <div class="px-4 pb-2">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h2>
    </div>
    
    <!-- Content -->
    <div ref="contentRef" 
         class="px-4 py-2 h-[calc(100%-4rem)] overflow-hidden touch-auto">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
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
  background-color: rgba(156, 163, 175, 0.5) !important;
  border-radius: 5px !important;
  width: 8px !important;
  transition: background-color 0.2s ease, width 0.2s ease !important;
}

.dark :deep(.ps__thumb-y) {
  background-color: rgba(156, 163, 175, 0.3) !important;
}

:deep(.ps__rail-y:hover) .ps__thumb-y {
  background-color: rgba(156, 163, 175, 0.8) !important;
}

.dark :deep(.ps__rail-y:hover) .ps__thumb-y {
  background-color: rgba(156, 163, 175, 0.5) !important;
}

.bottom-sheet {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
}

.dark .bottom-sheet {
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
}

.sheet-handle {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>