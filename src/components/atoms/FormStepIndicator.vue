<template>
  <div class="flex items-center justify-between">
    <template v-for="step in totalSteps" :key="step">
      <div class="flex flex-col items-center">
        <div
          class="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all duration-300"
          :class="{
            'bg-golden-brown text-bone-white border-golden-brown': step === currentStep,
            'bg-bone-white text-charcoal border-charcoal': step !== currentStep,
          }"
        >
          {{ step }}
        </div>
      </div>
      <div v-if="step < totalSteps" class="flex-grow h-px mx-4 transition-colors duration-300"
        :class="{
          'bg-golden-brown': step < currentStep,
          'bg-charcoal': step >= currentStep,
        }"
      ></div>
    </template>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  totalSteps: {
    type: Number,
    default: 3,
  }
});
</script>