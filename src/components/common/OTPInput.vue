<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  length?: number
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue', 'complete'])

const inputs = ref<(HTMLInputElement | null)[]>([])
const inputValues = ref<string[]>(Array(props.length || 5).fill(''))

const focusNext = (index: number) => {
  if (index < (props.length || 5) - 1) {
    inputs.value[index + 1]?.focus()
  }
}

const focusPrev = (index: number) => {
  if (index > 0) {
    inputs.value[index - 1]?.focus()
  }
}

const handleInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Allow only numbers
  if (!/^\d*$/.test(value)) {
    input.value = inputValues.value[index]
    return
  }

  // Handle paste of multiple characters
  if (value.length > 1) {
    const values = value.split('').slice(0, props.length || 5)
    values.forEach((v, i) => {
      if (i + index < (props.length || 5)) {
        inputValues.value[i + index] = v
      }
    })
    emit('update:modelValue', inputValues.value.join(''))
    
    // Focus next empty input or last input
    const nextEmptyIndex = inputValues.value.findIndex(v => !v)
    if (nextEmptyIndex !== -1) {
      inputs.value[nextEmptyIndex]?.focus()
    } else {
      inputs.value[inputs.value.length - 1]?.focus()
    }
    return
  }

  inputValues.value[index] = value
  emit('update:modelValue', inputValues.value.join(''))

  if (value) {
    focusNext(index)
  }

  // Check if all inputs are filled
  if (inputValues.value.every(v => v) && inputValues.value.join('').length === (props.length || 5)) {
    emit('complete', inputValues.value.join(''))
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !inputValues.value[index]) {
    focusPrev(index)
  }
}

const handlePaste = async (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = await navigator.clipboard.readText()
  const numbers = pastedData.replace(/\D/g, '').split('').slice(0, props.length || 5)
  
  numbers.forEach((number, index) => {
    inputValues.value[index] = number
  })
  
  emit('update:modelValue', inputValues.value.join(''))
  
  // Focus next empty input or last input
  const nextEmptyIndex = inputValues.value.findIndex(v => !v)
  if (nextEmptyIndex !== -1) {
    inputs.value[nextEmptyIndex]?.focus()
  } else {
    inputs.value[inputs.value.length - 1]?.focus()
  }

  // Check if all inputs are filled
  if (inputValues.value.every(v => v) && inputValues.value.join('').length === (props.length || 5)) {
    emit('complete', inputValues.value.join(''))
  }
}

// Handle clipboard content on focus
const handleFocus = async () => {
  try {
    const clipboardContent = await navigator.clipboard.readText()
    const numbers = clipboardContent.replace(/\D/g, '')
    
    if (numbers.length === (props.length || 5)) {
      numbers.split('').forEach((number, index) => {
        inputValues.value[index] = number
      })
      emit('update:modelValue', inputValues.value.join(''))
      inputs.value[inputs.value.length - 1]?.focus()
      
      if (inputValues.value.every(v => v)) {
        emit('complete', inputValues.value.join(''))
      }
    }
  } catch (error) {
    console.log('No clipboard access or empty clipboard')
  }
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  const values = newValue.split('')
  inputValues.value = Array(props.length || 5).fill('').map((_, i) => values[i] || '')
})

onMounted(() => {
  // Focus first input on mount
  inputs.value[0]?.focus()
})
</script>

<template>
  <div class="flex gap-3 justify-center">
    <template v-for="(_, index) in props.length || 5" :key="index">
      <input
        :ref="el => inputs[index] = el as HTMLInputElement"
        v-model="inputValues[index]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="w-12 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200"
        :class="{ 
          'border-blue-500 dark:border-blue-400': inputValues[index],
          'animate-pulse': inputValues[index]
        }"
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        @focus="handleFocus"
        @paste="handlePaste"
      />
    </template>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .7;
  }
}
</style>