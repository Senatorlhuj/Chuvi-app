<template>
  <div class="fixed top-5 right-5 z-[100] space-y-3 pointer-events-none">
    
    <div 
      v-for="toast in toasts" 
      :key="toast.id" 
      :class="[
        'w-80 p-4 rounded-lg shadow-xl border-l-4 transition-all duration-300 transform pointer-events-auto',
        // Background and border colors based on type
        toast.type === 'success' ? 'bg-bone-white border-brand-green' : 'bg-bone-white border-destructive',
        'text-charcoal',
        // Slide in/out animation classes
        toast.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      ]"
      :style="{ transition: 'transform 0.3s ease-out, opacity 0.3s ease-out' }"
    >
      <div class="flex items-start">
        <!-- Icon based on type -->
        <font-awesome-icon 
          :icon="toast.type === 'success' ? ['fas', 'check-circle'] : ['fas', 'exclamation-triangle']" 
          :class="[
            'text-xl mr-3 mt-0.5',
            // Text color based on type
            toast.type === 'success' ? 'text-brand-green' : 'text-destructive'
          ]" 
        />
        
        <div class="flex-1">
          <p 
            :class="['font-semibold', toast.type === 'success' ? 'text-brand-green' : 'text-destructive']"
          >
            {{ toast.type === 'success' ? 'Success' : 'Error' }}
          </p>
          <p class="text-sm mt-1 text-charcoal">{{ toast.message }}</p>
        </div>

        <button 
          @click="removeToast(toast.id)"
          class="ml-3 text-gray-400 hover:text-charcoal transition-colors focus:outline-none"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast, removeToast } from '@/composables/useToast';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Get the globally managed toast list and remove function
const { toasts } = useToast();
// The removeToast function is imported directly for button use.
</script>

<style scoped>
/* Ensure custom colors are defined for use here if not using Tailwind's config */
.text-brand-green { color: #27B8A7; }
.text-destructive { color: hsl(14, 100%, 57%); }
.bg-bone-white { background-color: #f6f4f1; }
.text-charcoal { color: #302e2d; }
</style>
