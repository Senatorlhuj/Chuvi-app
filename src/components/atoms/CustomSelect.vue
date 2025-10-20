<template>
  <div class="space-y-1">
    <label
      v-if="label"
      :for="id"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-400 ml-1">*</span>
    </label>

    <div class="relative inline-block" ref="selectWrapper">
      <button
        type="button"
        :id="id"
        @click="toggleDropdown"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
        @keydown.escape="closeDropdown"
        @keydown.down.prevent="navigateOptions(1)"
        @keydown.up.prevent="navigateOptions(-1)"
        :disabled="disabled"
        :class="[
          'appearance-none block p-3 bg-bone-white border rounded-lg text-left font-medium transition-all duration-300 pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
          isOpen ? 'border-golden-brown text-navy-blue' : 'text-charcoal',
          error ? 'border-red-500' : 'border-golden-brown/30',
          widthClass,
        ]"
      >
        <span v-if="selectedOption" class="block truncate">
          {{ selectedOption.label }}
        </span>
        <span v-else class="block truncate text-charcoal/70">
          {{ placeholder }}
        </span>
      </button>

      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-navy-blue transition-all duration-300"
        :class="{ 'rotate-180 text-golden-brown': isOpen }"
      >
        <svg
          class="h-5 w-5 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="isOpen"
          class="absolute z-50 mt-2 bg-bone-white rounded-lg max-h-60 overflow-auto shadow-xl border border-golden-brown/20"
          :class="widthClass"
        >
          <ul>
            <li
              v-for="(option, index) in options"
              :key="option.value"
              @click="selectOption(option)"
              @mouseenter="highlightedIndex = index"
              class="px-3 py-2.5 cursor-pointer transition-all duration-150 font-medium"
              :class="{
                'bg-charcoal !text-bone-white': highlightedIndex === index,
                'text-charcoal': highlightedIndex !== index,
              }"
            >
              <div class="flex items-center justify-between">
                <span class="block truncate">{{ option.label }}</span>
                <svg
                  v-if="modelValue === option.value"
                  class="h-5 w-5 text-golden-brown"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <p
      v-if="helperText"
      class="text-xs mt-1 transition-opacity duration-200"
      :class="error ? 'text-red-500' : 'text-cream/80'"
    >
      {{ helperText }}
    </p>
  </div>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  computed,
  ref,
  onMounted,
  onUnmounted,
} from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: "",
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: "Select an option",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  helperText: {
    type: String,
    default: null,
  },
  error: {
    type: Boolean,
    default: false,
  },
  widthClass: {
    type: String,
    default: "w-48",
  },
  // NEW PROP for external control of the default label text color
  labelTextColor: {
    type: String,
    // Use the original default color as a fallback
    default: "text-cream/70", 
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const highlightedIndex = ref(-1);
const selectWrapper = ref(null);

// Generate a unique ID for accessibility
const id = computed(
  () => `custom-select-${Math.random().toString(36).substr(2, 9)}`
);

// Find the selected option object
const selectedOption = computed(() => {
  return props.options.find((option) => option.value === props.modelValue);
});

// Computed classes for the label's text color
const labelClasses = computed(() => {
  // Base classes for size, weight, transition, and default behavior
  const baseClasses =
    "text-sm font-medium block transition-colors duration-200 cursor-default";

  // Start with the color passed in via the new prop
  let colorClass = props.labelTextColor; 

  // Dynamic states override the default prop color
  if (props.disabled) {
    colorClass = "text-navy-blue/50"; // Disabled state color
  } else if (props.error) {
    colorClass = "text-red-500"; // Error state color
  } else if (isOpen.value) {
    colorClass = "text-pure-gold"; // Focus/Active color
  } else if (props.modelValue) {
      // Option to change color when filled, keeping it 'text-charcoal' 
      // is a common pattern to signify a selected state.
      colorClass = 'text-charcoal'; 
  }

  // Combine the base classes with the dynamic color class
  return [baseClasses, colorClass];
});


const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    // Highlight current selection when opening
    const currentIndex = props.options.findIndex(
      (opt) => opt.value === props.modelValue
    );
    highlightedIndex.value = currentIndex >= 0 ? currentIndex : 0;
  }
};

const closeDropdown = () => {
  isOpen.value = false;
  highlightedIndex.value = -1;
};

const selectOption = (option) => {
  emit("update:modelValue", option.value);
  closeDropdown();
};

const navigateOptions = (direction) => {
  if (!isOpen.value) {
    toggleDropdown();
    return;
  }

  highlightedIndex.value += direction;

  // Loop around
  if (highlightedIndex.value < 0) {
    highlightedIndex.value = props.options.length - 1;
  } else if (highlightedIndex.value >= props.options.length) {
    highlightedIndex.value = 0;
  }

  // Auto-scroll highlighted option into view
  const listElement = selectWrapper.value?.querySelector("ul");
  const highlightedElement = listElement?.children[highlightedIndex.value];
  highlightedElement?.scrollIntoView({ block: "nearest" });
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (selectWrapper.value && !selectWrapper.value.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Custom scrollbar for dropdown */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: transparent;
}

/* Using a custom color based on your theme for the scrollbar thumb */
.overflow-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 2, 46, 0.3); /* navy-blue at 30% opacity */
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 2, 46, 0.5); /* navy-blue at 50% opacity */
}
</style>