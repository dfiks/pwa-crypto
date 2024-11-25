<script setup lang="ts">
import { ref, watch } from 'vue'
import { VMoney3 } from 'v-money3'

const props = defineProps<{
  modelValue: number
  label: string
  hint?: string
  prefix?: string
  suffix?: string
  step?: string
  min?: number
  max?: number
  money?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const inputProps = {
  modelModifiers: { number: true }
}

const moneyConfig = {
  prefix: props.prefix || '',
  suffix: props.suffix || '',
  precision: props.step ? props.step.split('.')[1]?.length || 0 : 2,
  decimal: '.',
  thousands: ',',
  masked: false
}

const formattedValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  formattedValue.value = newVal
})

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = props.money ? parseFloat(target.value.replace(/[^0-9.-]/g, '')) : parseFloat(target.value)
  
  if (props.min !== undefined) {
    value = Math.max(props.min, value)
  }
  if (props.max !== undefined) {
    value = Math.min(props.max, value)
  }
  
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="space-y-2">
    <label class="block text-base font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    
    <div class="relative">
      <input
        :value="formattedValue"
        @input="updateValue"
        v-money3="money ? moneyConfig : undefined"
        type="text"
        :step="step"
        :min="min"
        :max="max"
        class="block w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100 text-base transition-colors duration-200"
        :class="[prefix ? 'pl-10' : 'pl-4', suffix ? 'pr-12' : 'pr-4']"
        v-bind="inputProps"
      />
      <div v-if="prefix" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span class="text-gray-500 dark:text-gray-400 text-base font-medium">
          {{ prefix }}
        </span>
      </div>
      <div v-if="suffix" class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <span class="text-gray-500 dark:text-gray-400 text-base font-medium">
          {{ suffix }}
        </span>
      </div>
    </div>
    
    <p v-if="hint" class="text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>