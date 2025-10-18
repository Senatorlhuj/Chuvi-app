<template>
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
</template>

