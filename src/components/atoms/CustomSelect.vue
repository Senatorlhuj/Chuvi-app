<template>
  <div class="relative w-full" :aria-label="label">
    <button 
      type="button"
      @click="isOpen = !isOpen"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :disabled="disabled"
      class="flex justify-between items-center w-full px-4 py-3 text-base rounded-lg cursor-pointer transition-colors duration-200 
             border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)]"
      :class="[
        // Custom styling to match the rest of your form inputs
        ' text-[var(--color-charcoal)] border-[var(--color-charcoal)]/50',
        { 'opacity-60 cursor-not-allowed ': disabled }
      ]"
    >
      <span class="truncate">{{ selectedOption ? selectedOption.label : placeholder }}</span>
      <svg class="w-4 h-4 ml-2 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <Transition name="fade-slide">
      <ul
        v-if="isOpen"
        ref="listbox"
        role="listbox"
        tabindex="-1"
        class="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-lg shadow-xl 
               bg-[var(--color-bone-white)] "
      >
        <li 
          v-for="option in options"
          :key="option.value"
          role="option"
          :aria-selected="option.value === modelValue"
          @click="selectOption(option)"
          class="px-4 py-2 text-sm cursor-pointer transition-colors duration-100 text-[var(--color-charcoal)] hover:bg-golden-brown hover:text-white"
          :class="{
            // Use your golden-brown color for selection highlight
            'bg-[var(--color-cream)] text-charcoal font-medium': option.value === modelValue,
            'hover:bg-[var(--color-golden-brown)]/10': option.value !== modelValue,
          }"
        >
          {{ option.label }}
        </li>
        
        <li v-if="!options || options.length === 0" class="px-4 py-2 text-sm text-[var(--color-charcoal)]/60 italic">
          No options available
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';

// --- Props Definition ---
const props = defineProps({
  /** The currently selected value (used with v-model) */
  modelValue: {
    type: [String, Number, Object],
    default: null,
  },
  /** Array of available options */
  options: {
    type: Array,
    required: true,
    // Expected format: [{ label: 'Option 1', value: 'v1' }, ...]
  },
  /** Placeholder text when no option is selected */
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  /** Aria label for accessibility */
  label: {
    type: String,
    required: true,
  },
  /** Disable the select */
  disabled: {
    type: Boolean,
    default: false,
  },
});

// --- Emits Definition ---
const emit = defineEmits(['update:modelValue']);

// --- State Management ---
const isOpen = ref(false);
const listbox = ref(null); 
const buttonRef = ref(null); // Ref for the button

// --- Computed Properties ---
/** Finds the selected option object based on the modelValue */
const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue);
});

// --- Methods ---
/** Handles selection and updates the v-model */
const selectOption = (option) => {
  if (props.disabled) return;
  emit('update:modelValue', option.value);
  isOpen.value = false; // Close after selection
};

// --- Accessibility & Outside Click Handling ---

/** Close dropdown when clicking outside */
const handleClickOutside = (event) => {
  // Check if the click is outside both the listbox and the button
  const buttonElement = listbox.value?.parentElement.querySelector('button');
  if (listbox.value && !listbox.value.contains(event.target) && buttonElement && !buttonElement.contains(event.target)) {
    isOpen.value = false;
  }
};

/** Add/Remove outside click listener */
watch(isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
}, { immediate: true });

// Cleanup the listener when the component is unmounted
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Basic fade and slide transition for the dropdown */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>