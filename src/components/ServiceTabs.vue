<template>
  <div class="fixed top-16 z-40  py-4 flex justify-center w-full">
    <div class="flex space-x-2 p-2 bg-gray-100 rounded-full w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('select-tab', tab.id)"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-full flex items-center transition-colors duration-200 cursor-pointer',
          activeTab === tab.id
            ? 'bg-golden-brown text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-50',
        ]"
      >
        {{ tab.name }}
        <span
          v-if="tab.badge"
          :class="[
            'ml-2 px-2 py-0.5 text-xs rounded-full',
            activeTab === tab.id
              ? 'bg-white text-golden-brown'
              : 'bg-golden-brown text-white',
          ]"
        >
          {{ tab.badge }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => [],
  },
  activeTab: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['select-tab']);
</script>