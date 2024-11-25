<script setup>
import NavigationBar from '../components/NavigationBar.vue'
</script>

<template>
  <div class="mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 relative transition-colors duration-300 md:max-w-3xl lg:max-w-4xl">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <NavigationBar />
  </div>
</template>

<style>
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