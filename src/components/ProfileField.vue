<template>
  <div class="flex justify-between items-center py-2 border-b border-charcoal/10">
    <label class="text-sm font-medium text-charcoal/70">{{ label }}</label>
    <div class="flex-1 ml-4">
      <input
        v-if="editable"
        :value="value"
        @input="$emit('update:value', $event.target.value)"
        type="text"
        class="bg-transparent border-none text-charcoal text-base w-full"
        :readonly="!editable"
      />
      <span v-else class="text-charcoal text-base font-semibold">{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  label: String,
  value: [String, Number],
  editable: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:value'])
</script>

<style scoped>
/* Adjust styling for the input inside ProfileField if needed */
</style>