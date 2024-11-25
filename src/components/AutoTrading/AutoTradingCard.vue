<script setup lang="ts">
import { ref, watch } from 'vue'
import { VMoney3 } from 'v-money3'
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
import InputPopover from '../common/InputPopover.vue'

const props = defineProps<{
  modelValue: number
  title: string
  subtitle: string
  prefix?: string
  suffix?: string
  step?: number | string
  min?: number
  max?: number
  money?: boolean
  icon?: any
  tooltip?: string
}>()

const emit = defineEmits(['update:modelValue', 'change'])
const showTooltip = ref(false)
const showPopover = ref(false)
const isEditing = ref(false)
const inputRef = ref<HTMLElement | null>(null)

const moneyConfig = {
  prefix: props.prefix || '',
  suffix: props.suffix || '',
  precision: typeof props.step === 'string' ? props.step.split('.')[1]?.length || 0 : 2,
  decimal: '.',
  thousands: ',',
  masked: false
}

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

const updateValue = (event: Event) => {
  if (!isEditing.value) {
    event.preventDefault()
    return
  }
  
  const target = event.target as HTMLInputElement
  let value = props.money ? parseFloat(target.value.replace(/[^0-9.-]/g, '')) : parseFloat(target.value)
  
  if (props.min !== undefined) value = Math.max(props.min, value)
  if (props.max !== undefined) value = Math.min(props.max, value)
  
  localValue.value = value
  emit('update:modelValue', value)
  emit('change')
}

const handleInputClick = (event: Event) => {
  event.preventDefault()
  if (!isEditing.value) {
    showPopover.value = true
  }
}

const getInputType = () => {
  if (props.suffix === '%') return 'percentage'
  if (props.money) return 'investment'
  return 'number'
}

const startEditing = () => {
  isEditing.value = true
  showPopover.value = false
  // Focus the input on next tick after enabling editing
  setTimeout(() => {
    const input = document.querySelector(`#input-${props.title}`) as HTMLInputElement
    if (input) {
      input.focus()
    }
  }, 0)
}

const stopEditing = () => {
  isEditing.value = false
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start gap-4 mb-4">
      <!-- Icon -->
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
        <component 
          :is="icon" 
          class="w-5 h-5 text-blue-600 dark:text-blue-400"
        />
      </div>

      <!-- Title and Subtitle -->
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
            {{ title }}
          </h3>
          <div v-if="tooltip" class="relative">
            <button
              @mouseenter="showTooltip = true"
              @mouseleave="showTooltip = false"
              @focus="showTooltip = true"
              @blur="showTooltip = false"
              class="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <QuestionMarkCircleIcon class="w-3 h-3 text-gray-500 dark:text-gray-400" />
            </button>
            
            <!-- Tooltip -->
            <div
              v-show="showTooltip"
              class="absolute z-10 right-0 mt-2 w-64 transform -translate-y-1 transition-all duration-200"
            >
              <div class="relative bg-gray-900 dark:bg-gray-800 rounded-lg shadow-xl">
                <div class="absolute -top-2 right-2 w-4 h-4 bg-gray-900 dark:bg-gray-800 transform rotate-45"></div>
                <div class="relative p-4 rounded-lg bg-gray-900 dark:bg-gray-800">
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <component 
                        :is="icon" 
                        class="w-4 h-4 text-blue-400"
                      />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-white mb-1">{{ title }}</p>
                      <p class="text-sm text-gray-300">{{ tooltip }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Input -->
    <div class="relative">
      <input
        :id="`input-${title}`"
        ref="inputRef"
        v-model="localValue"
        @input="updateValue"
        @click="handleInputClick"
        v-money3="money ? moneyConfig : undefined"
        type="text"
        :readonly="!isEditing"
        :step="step"
        :min="min"
        :max="max"
        class="w-full h-11 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-base"
        :class="[
          prefix ? 'pl-8' : '', 
          suffix ? 'pr-12' : '',
          !isEditing ? 'cursor-pointer' : ''
        ]"
      />
      <div v-if="prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-gray-500 dark:text-gray-400">{{ prefix }}</span>
      </div>
      <div v-if="suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-gray-500 dark:text-gray-400">{{ suffix }}</span>
      </div>

      <!-- Input Popover -->
      <Teleport to="body">
        <InputPopover
          v-if="showPopover"
          :is-open="showPopover"
          :type="getInputType()"
          :current-value="modelValue"
          :is-editing="isEditing"
          :target-element="inputRef"
          @close="showPopover = false"
          @update:value="$emit('update:modelValue', $event)"
          @edit="startEditing"
          @stop-edit="stopEditing"
        />
      </Teleport>
    </div>
  </div>
</template>