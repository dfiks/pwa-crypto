<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md'
  },
  color: {
    type: String,
    default: '#4158D0'
  }
})

const sizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5'
}

const dotSize = sizes[props.size] || sizes.md
</script>

<template>
  <div class="flex items-center gap-1.5">
    <div v-for="i in 4" :key="i"
         :class="[dotSize, 'rounded-full animate-dot']"
         :style="{
           backgroundColor: color,
           animationDelay: `${(i - 1) * 0.15}s`
         }">
    </div>
  </div>
</template>

<style scoped>
@keyframes dotPulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.animate-dot {
  animation: dotPulse 0.8s ease-in-out infinite;
}
</style>