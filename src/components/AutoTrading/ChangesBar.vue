<script setup lang="ts">
import { ref, computed } from 'vue'
import ConfirmChanges from './ConfirmChanges/index.vue'

const props = defineProps<{
  show: boolean
  changes?: Record<string, any>
  initialValues?: Record<string, any>
}>()

const emit = defineEmits(['save', 'discard'])
const showConfirmModal = ref(false)

const barClasses = computed(() => ({
  'translate-y-0': props.show,
  'translate-y-full': !props.show
}))

const handleSaveClick = () => {
  showConfirmModal.value = true
}

const handleConfirm = () => {
  showConfirmModal.value = false
  emit('save')
}
</script>

<template>
  <div>
    <div 
      class="fixed bottom-0 left-0 right-0 z-[999] transition-transform duration-300"
      :class="barClasses"
    >
      <div class="container mx-auto max-w-2xl px-4 pb-4">
        <div class="flex items-center justify-between px-6 py-3 bg-[#0a0b1e] rounded-full shadow-lg">
          <span class="text-sm text-white font-medium">You have unsaved changes</span>
          <div class="flex items-center gap-3">
            <button 
              @click="emit('discard')"
              class="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="handleSaveClick"
              class="px-4 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors shadow-lg shadow-blue-500/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <ConfirmChanges
      :is-open="showConfirmModal"
      :changes="changes"
      :initial-values="initialValues"
      @close="showConfirmModal = false"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style scoped>
.translate-y-0 {
  transform: translateY(0);
}

.translate-y-full {
  transform: translateY(100%);
}
</style>