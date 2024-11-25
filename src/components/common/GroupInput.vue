<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'

interface Option {
  value: string
  label: string
  description: string
  icon: any
}

const props = defineProps<{
  modelValue: number
  options: Option[]
  selectedOption: string
  prefix?: string
  suffix?: string
  min?: number
  step?: number
  disabled?: boolean
  showSelect?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'update:selectedOption'])
const isOpen = ref(false)
const selectButtonRef = ref<HTMLElement | null>(null)

const selectedOptionData = computed(() => 
  props.options.find(opt => opt.value === props.selectedOption)
)

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectOption = (value: string) => {
  emit('update:selectedOption', value)
  isOpen.value = false
}

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = parseFloat(target.value)
  
  if (props.min !== undefined) {
    value = Math.max(props.min, value)
  }
  
  emit('update:modelValue', value)
}

const handleClickOutside = (event: MouseEvent) => {
  if (selectButtonRef.value && !selectButtonRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative">
    <div class="flex">
      <!-- Select Button -->
      <div v-if="showSelect" class="relative flex-shrink-0" ref="selectButtonRef">
        <button
          type="button"
          @click="toggleDropdown"
          :disabled="disabled"
          class="h-11 px-4 flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div v-if="selectedOptionData?.icon" class="w-4 h-4 relative">
            <component 
              :is="selectedOptionData.icon"
              class="w-4 h-4 text-gray-600 dark:text-gray-300"
            />
          </div>
          <span class="text-sm whitespace-nowrap">
            {{ selectedOptionData?.label }}
          </span>
          <ChevronDownIcon 
            class="w-4 h-4 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
          />
        </button>
        
        <!-- Dropdown -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div v-if="isOpen"
               class="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10"
          >
            <div class="p-2 space-y-1">
              <button
                v-for="option in options"
                :key="option.value"
                @click="selectOption(option.value)"
                class="w-full px-3 py-2 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                :class="[
                  option.value === selectedOption 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : ''
                ]"
              >
                <div class="flex items-center gap-3">
                  <div 
                    class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    :class="[
                      option.value === selectedOption 
                        ? 'bg-white/20' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    ]"
                  >
                    <component 
                      :is="option.icon"
                      class="w-4 h-4"
                      :class="[
                        option.value === selectedOption 
                          ? 'text-white' 
                          : 'text-gray-400 dark:text-gray-500'
                      ]"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-medium" :class="[
                      option.value === selectedOption 
                        ? 'text-white' 
                        : 'text-gray-900 dark:text-gray-100'
                    ]">
                      {{ option.label }}
                    </p>
                    <p class="text-xs" :class="[
                      option.value === selectedOption 
                        ? 'text-white/80' 
                        : 'text-gray-500 dark:text-gray-400'
                    ]">
                      {{ option.description }}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Input -->
      <div class="flex-1 relative">
        <input
          :value="modelValue"
          @input="updateValue"
          type="number"
          :min="min"
          :step="step"
          :disabled="disabled"
          :class="[
            'w-full h-11 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            showSelect ? 'rounded-r-lg' : 'rounded-lg'
          ]"
        />

        <!-- Prefix -->
        <div v-if="prefix" class="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
          <span class="text-gray-500 dark:text-gray-400">{{ prefix }}</span>
        </div>

        <!-- Suffix -->
        <div v-if="suffix" class="absolute right-0 inset-y-0 flex items-center pr-3 pointer-events-none">
          <span class="text-gray-500 dark:text-gray-400">{{ suffix }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="number"] {
  -moz-appearance: textfield;
  padding-left: 2.5rem;
  padding-right: 2rem;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>