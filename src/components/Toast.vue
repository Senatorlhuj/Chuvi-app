<template>
  <div class="fixed top-5 right-5 z-[100] space-y-3 pointer-events-none">
    
    <div 
      v-for="toast in toasts" 
      :key="toast.id" 
      :class="[
        'w-80 p-4 rounded-lg shadow-xl border-l-4 transition-all duration-300 transform pointer-events-auto',
        toast.type === 'success' ? 'bg-bone-white border-brand-green' : 'bg-bone-white border-destructive',
        toast.type === 'success' ? 'text-charcoal' : 'text-charcoal',
        // Slide in/out animation classes
        toast.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      ]"
    >
      <div class="flex items-start">
        <font-awesome-icon 
          :icon="toast.type === 'success' ? 'check-circle' : 'exclamation-triangle'" 
          :class="[
            'text-xl mr-3 mt-0.5',
            toast.type === 'success' ? 'text-green-700' : 'text-destructive'
          ]" 
        />
        
        <div class="flex-1">
          <p 
            :class="['font-semibold', toast.type === 'success' ? 'text-green-700' : 'text-red-700']"
          >
            {{ toast.type === 'success' ? 'Success' : 'Error' }}
          </p>
          <p class="text-sm mt-1 text-charcoal">{{ toast.message }}</p>
        </div>

        <button 
          @click="removeToast(toast.id)"
          class="ml-3 text-gray-400 hover:text-charcoal transition-colors focus:outline-none"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useToast, removeToast } from '@/composables/useToast';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Get the globally managed toast list
const { toasts } = useToast();

// Cleanup for any remaining timers if the component is unmounted
onUnmounted(() => {
  // Optional: Add logic to clear timers if you manage them inside the component
});
</script>