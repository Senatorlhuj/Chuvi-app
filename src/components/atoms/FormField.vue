<template>
  <div class="mb-6">
    <label class="block text-charcoal font-semibold mb-2">{{ label }}</label>

    <!-- radios & checkboxes (existing) -->
    <div
      v-if="type === 'radio' || type === 'checkbox'"
      class="flex flex-wrap gap-4"
    >
      <!-- ... existing code ... -->
    </div>

    <!-- textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="['w-full p-3 border border-golden-brown rounded-md', inputClass]"
    ></textarea>

    <!-- select -->
    <select
      v-else-if="type === 'select'"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :name="name"
      :class="['w-full p-3 border border-golden-brown rounded-md', inputClass]"
    >
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>

    <!-- 🆕 file input special case -->
    <input
      v-else-if="type === 'file'"
      type="file"
      :name="name"
      @change="$emit('update:modelValue', $event)" 
      class="w-full p-3 border border-golden-brown rounded-md text-charcoal"
    />

    <!-- all other input types -->
    <div v-else class="relative">
      <input
        :type="computedInputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="[
          'w-full p-3 border border-golden-brown rounded-md text-charcoal',
          inputClass,
          { 'pr-10': type === 'password' },
        ]"
      />
      <button
        v-if="type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal hover:text-navy-blue focus:outline-none cursor-pointer"
        :tabindex="-1"
      >
        <font-awesome-icon :icon="passwordToggleIcon" />
      </button>
    </div>
  </div>
</template>


<script setup>
import { defineProps, defineEmits, ref, computed } from "vue"; // Import ref and computed
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"; // For the icon
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Import specific icons

const props = defineProps({
  label: String,
  type: String,
  name: String,
  modelValue: [String, Number, Array, Boolean],
  options: Array,

  // FIX 3: Added prop to accept custom classes for the input/textarea elements
  inputClass: {
    type: [String, Array],
    default: "",
  },

  // Added common input props used in CouponManager.vue for completeness
  placeholder: String,
  disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

// --- Password Toggle Logic ---
const isPasswordVisible = ref(false);

const computedInputType = computed(() => {
  if (props.type === "password") {
    // Return 'text' if visible, 'password' if hidden
    return isPasswordVisible.value ? "text" : "password";
  }
  // Otherwise, return the original type (e.g., 'text', 'number', 'email', etc.)
  return props.type;
});

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const passwordToggleIcon = computed(() => {
  return isPasswordVisible.value ? faEye : faEyeSlash;
});

// --- Radio/Checkbox Logic (EXISTING) ---
const isSelected = (option) => {
  if (props.type === "radio") {
    return props.modelValue === option;
  }
  if (props.type === "checkbox") {
    // Ensure modelValue is treated as an array for includes
    return Array.isArray(props.modelValue) && props.modelValue.includes(option);
  }
  return false;
};

const updateValue = (event) => {
  if (props.type === "radio") {
    emit("update:modelValue", event.target.value);
  } else if (props.type === "checkbox") {
    const value = event.target.value;
    // Ensure props.modelValue is treated as an array for manipulation
    const currentValues = Array.isArray(props.modelValue)
      ? props.modelValue
      : [];

    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    emit("update:modelValue", newValues);
  } else {
    emit("update:modelValue", event.target.value);
  }
};
</script>
