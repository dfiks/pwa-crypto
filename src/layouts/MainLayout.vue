<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavigationBar from '../components/NavigationBar.vue'

const route = useRoute()
const showNavigation = computed(() => !route.path.includes('/register') && !route.path.includes('/login') && !route.path.includes('/forgot-password'))
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 relative transition-colors duration-300">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <NavigationBar v-if="showNavigation" />
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>