<template>
  <div v-if="loading" class="route-loader-overlay">
    <div class="flex flex-col items-center justify-center py-20">
      <div class="relative w-16 h-16 mb-4">
        <div
          class="absolute inset-0 bg-gradient-to-r from-[#d1671f] to-[#d1671f] rounded-full animate-spin"
          style="mask-image: conic-gradient(transparent 25%, black)"
        ></div>
      </div>
      <p class="text-[#959190] font-medium animate-pulse">
        <slot>Loading...</slot>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RouteLoader',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.route-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}
</style>