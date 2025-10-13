<template>
  <div>
    <p class="text-sm font-medium text-navy-blue/80">{{ label }}</p>
    <p class="text-charcoal font-medium">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String
})
</script>

<style scoped>
.text-navy-blue { color: #1e3a8a; }
.text-charcoal { color: #302e2d; }
</style>
