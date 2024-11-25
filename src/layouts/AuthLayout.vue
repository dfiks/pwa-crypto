<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useI18n } from '@/i18n'
import { 
  SunIcon, 
  MoonIcon, 
  LanguageIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'
import AnimatedBackground from '@/components/Register/AnimatedBackground.vue'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

const props = defineProps<{
  showBackButton?: boolean
}>()

const emit = defineEmits(['back'])

const contentRef = ref<HTMLElement | null>(null)
let ps: PerfectScrollbar | null = null

const themeStore = useThemeStore()
const { locale, setLocale } = useI18n()
const showLanguageSelect = ref(false)

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' }
]

// Initialize perfect scrollbar
onMounted(() => {
  if (contentRef.value) {
    ps = new PerfectScrollbar(contentRef.value, {
      wheelSpeed: 1,
      wheelPropagation: false,
      minScrollbarLength: 20
    })
  }
})

onUnmounted(() => {
  if (ps) {
    ps.destroy()
    ps = null
  }
})
</script>

<template>
  <div class="min-h-screen w-full flex">
    <!-- Left Side - Animated Background -->
    <AnimatedBackground />
    
    <!-- Right Side - Auth Form -->
    <div class="w-full lg:w-[30%] flex flex-col bg-white dark:bg-gray-900">
      <!-- Theme and Language Controls -->
      <div class="flex-shrink-0 px-4 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
        <div class="flex items-center justify-between">
          <!-- Back Button -->
          <button 
            v-if="showBackButton"
            @click="emit('back')"
            class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <div v-else class="w-8"></div>

          <div class="flex items-center gap-3">
            <!-- Language Selector -->
            <div class="relative">
              <button 
                @click="showLanguageSelect = !showLanguageSelect"
                class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LanguageIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {{ languages.find(l => l.value === locale)?.label }}
                </span>
              </button>

              <!-- Language Dropdown -->
              <div v-if="showLanguageSelect"
                   class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                <button
                  v-for="lang in languages"
                  :key="lang.value"
                  @click="() => { setLocale(lang.value); showLanguageSelect = false }"
                  class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  :class="[
                    lang.value === locale 
                      ? 'text-blue-600 dark:text-blue-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300'
                  ]"
                >
                  {{ lang.label }}
                </button>
              </div>
            </div>

            <!-- Theme Toggle -->
            <button 
              @click="themeStore.toggleTheme"
              class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <SunIcon v-if="themeStore.theme === 'dark'" class="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <MoonIcon v-else class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div ref="contentRef" class="flex-1 overflow-hidden">
        <div class="h-full flex items-center justify-center">
          <div class="w-full max-w-md px-8">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Perfect Scrollbar styles */
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