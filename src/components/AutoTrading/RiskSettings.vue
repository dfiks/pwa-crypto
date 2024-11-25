<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowTrendingDownIcon } from '@heroicons/vue/24/outline'
import AutoTradingCard from './AutoTradingCard.vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const emit = defineEmits(['change'])
const btcDropThreshold = ref(50)

const initialValues = ref({
  btcDropThreshold: 50
})

const saveInitialValues = () => {
  initialValues.value = {
    btcDropThreshold: btcDropThreshold.value
  }
}

const resetToInitial = () => {
  btcDropThreshold.value = initialValues.value.btcDropThreshold
}

watch(btcDropThreshold, () => {
  const hasChanges = btcDropThreshold.value !== initialValues.value.btcDropThreshold
  emit('change', hasChanges)
}, { deep: true })

defineExpose({
  btcDropThreshold,
  saveInitialValues,
  resetToInitial
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <AutoTradingCard
      v-model="btcDropThreshold"
      title="BTC Drop Threshold"
      subtitle="Stop trading if Bitcoin drops by this percentage"
      suffix="%"
      :min="0"
      :max="100"
      :step="1"
      :icon="ArrowTrendingDownIcon"
      tooltip="Trading will be automatically stopped if Bitcoin price drops by this percentage from the current value"
    />
  </div>
</template>