<script setup>
// No props or logic needed for skeleton
</script>

<template>
  <div class="card-container">
    <div class="signal-card-skeleton rounded-2xl p-6">
      <div class="grid grid-cols-2 gap-4">
        <!-- Header -->
        <div class="col-span-2 flex justify-between items-start mb-2">
          <div class="skeleton-item h-8 w-32"></div>
          <div class="skeleton-item h-7 w-24 rounded-full"></div>
        </div>

        <!-- Price and FDV -->
        <div>
          <div class="skeleton-item h-3 w-16 mb-2"></div>
          <div class="skeleton-item h-5 w-20"></div>
        </div>
        <div>
          <div class="skeleton-item h-3 w-12 mb-2"></div>
          <div class="skeleton-item h-5 w-16"></div>
        </div>

        <!-- Liquidity and Volume -->
        <div>
          <div class="skeleton-item h-3 w-14 mb-2"></div>
          <div class="skeleton-item h-5 w-20"></div>
        </div>
        <div>
          <div class="skeleton-item h-3 w-14 mb-2"></div>
          <div class="skeleton-item h-5 w-24"></div>
        </div>

        <!-- ATH -->
        <div>
          <div class="skeleton-item h-3 w-10 mb-2"></div>
          <div class="skeleton-item h-5 w-28"></div>
        </div>
        <div>
          <div class="skeleton-item h-3 w-16 mb-2"></div>
          <div class="skeleton-item h-5 w-16"></div>
        </div>

        <!-- Buyers and Sellers -->
        <div>
          <div class="skeleton-item h-3 w-12 mb-2"></div>
          <div class="skeleton-item h-5 w-14"></div>
        </div>
        <div>
          <div class="skeleton-item h-3 w-12 mb-2"></div>
          <div class="skeleton-item h-5 w-14"></div>
        </div>

        <!-- Details Button -->
        <div class="col-span-2">
          <div class="skeleton-item w-full h-[60px] rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
}

.signal-card-skeleton {
  background: linear-gradient(210deg, #4158D0 0%, #4158D0 26%, #C850C0 100%);
  opacity: 0.7;
}

.skeleton-item {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
}

.skeleton-item::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0.2) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.skeleton-item {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>