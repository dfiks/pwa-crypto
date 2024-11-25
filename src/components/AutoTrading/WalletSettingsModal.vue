<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '../common/Modal.vue'
import { KeyIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  isOpen: boolean
  currentApiKey: string
}>()

const emit = defineEmits(['close', 'update'])
const apiKey = ref(props.currentApiKey)

watch(() => props.currentApiKey, (newValue) => {
  apiKey.value = newValue
})

const handleSubmit = () => {
  emit('update', apiKey.value)
}
</script>

<template>
  <Modal 
    :is-open="isOpen" 
    title="Wallet Settings"
    @close="emit('close')"
  >
    <div class="space-y-6">
      <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
            <KeyIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100">
              API Key Required
            </h4>
            <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Enter your Raydium API key to enable automatic trading features.
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          API Key
        </label>
        <input
          v-model="apiKey"
          type="password"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Enter your API key"
        />
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  </Modal>
</template>