<template>
  <div class="space-y-1">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="text-sm font-medium text-cream/70 block transition-colors duration-200"
    >
      {{ label }}
      <span v-if="required" class="text-red-400 ml-1">*</span>
    </label>

    <!-- Custom Select Dropdown -->
    <div class="relative inline-block" ref="selectWrapper">
      <!-- Selected Value Display -->
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
          'appearance-none block p-3 bg-bone-white border border-golden-brown/30 rounded-lg text-left font-medium transition-all duration-300 pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
          isOpen ? 'border-golden-brown text-navy-blue' : 'text-charcoal',
          widthClass,
        ]"
      >
        <span v-if="selectedOption" class="block truncate">
          {{ selectedOption.label }}
        </span>
        <span v-else class="block truncate">
          {{ placeholder }}
        </span>
      </button>

      <!-- Dropdown Arrow Icon with Animation -->
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

      <!-- Dropdown Options List -->
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
          class="absolute z-50 mt-2 bg-bone-white rounded-lg max-h-60 overflow-auto"
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
                <!-- Checkmark for selected option -->
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

    <!-- Helper Text -->
    <p v-if="helperText" class="text-xs mt-1 transition-opacity duration-200">
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

  widthClass: {
    type: String,
    default: "w-48",
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

.overflow-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 47, 108, 0.3);
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 47, 108, 0.5);
}
</style>
