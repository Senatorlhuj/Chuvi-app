<template>
  <div class="p-6 md:p-10 max-w-2xl mx-auto text-charcoal">
    <h2 class="text-3xl font-bold mb-6 text-navy-blue">Laundry Preferences</h2>

    <div
      class="bg-bone-white text-golden-brown px-4 py-3 rounded-sm mb-6 border border-golden-brown/50"
    >
      <strong>Disclaimer:</strong> Deliveries and services are available
      <strong>within Anambra state</strong> only.
    </div>

    <form
      @submit.prevent="savePreferences"
      class="space-y-6 bg-bone-white rounded-lg p-6"
    >
      <div>
        <label class="block text-sm font-medium mb-1 text-navy-blue"
          >Detergent</label
        >
        <input
          v-model="form.preferences.detergent"
          type="text"
          placeholder="e.g. Omo or Ariel"
          class="input"
          required
        />
      </div>

      <div class="flex items-center space-x-2">
        <input
          id="hanger"
          v-model="form.preferences.hanger"
          type="checkbox"
          class="custom-checkbox"
        />
        <label for="hanger" class="text-sm font-medium text-charcoal"
          >Return clothes on hanger</label
        >
      </div>

      <div>
        <label class="block text-sm font-medium mb-1 text-navy-blue"
          >Fragrance</label
        >
        <select v-model="form.preferences.fragrance" class="input">
          <option disabled value="">Select fragrance</option>
          <option>Lavender</option>
          <option>Rose</option>
          <option>Vanilla</option>
          <option>Unscented</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1 text-navy-blue"
          >Special Care Notes</label
        >
        <textarea
          v-model="form.preferences.specialCareNotes"
          placeholder="Handle delicate fabrics separately…"
          rows="4"
          class="input"
        ></textarea>
      </div>

      <div>
        <button
          type="submit"
          :disabled="saving"
          class="px-6 py-2 bg-navy-blue text-bone-white rounded-sm hover:bg-golden-brown transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {{ saving ? "Saving…" : "Save Preferences" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
// Import Toast composable
import { useToast } from "@/composables/useToast";

// Initialize the Toast
const toast = useToast();

// import { savePreferences } from '@/services/api.js'

const saving = ref(false);

// Default form state
const form = ref({
  preferences: {
    detergent: "Omo",
    hanger: true,
    fragrance: "Lavender",
    specialCareNotes:
      "Handle delicate fabrics separately and use cold water wash.",
  },
});

// Fake save function for demo
const savePreferences = async () => {
  saving.value = true;
  try {
    // await savePreferences(form.value)
    console.log("Submitted payload:", form.value);

    // Use toast for success
    toast.showSuccess("Laundry preferences saved successfully! 🎉");
  } catch (err) {
    // Use toast for error
    const errorMessage = err.message || "Failed to save preferences";
    toast.showError(errorMessage);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
/*
  Custom CSS block for the utility classes and input styles.
*/
.bg-bone-white { background-color: var(--color-bone-white); }
.bg-bone-white { background-color: var(--color-bone-white); }
.bg-navy-blue { background-color: var(--color-navy-blue); }
.bg-golden-brown { background-color: var(--color-golden-brown); }

.text-navy-blue { color: var(--color-navy-blue); }
.text-charcoal { color: var(--color-charcoal); }
.text-golden-brown { color: var(--color-golden-brown); }
.text-bone-white { color: var(--color-bone-white); }
.text-pure-gold { color: var(--color-pure-gold); }


/* Input Field Styling */
.input {
  width: 100%;
  border: 1px solid var(--color-charcoal, #302e2d);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  background-color: white;
  
  /* ADDED: Use Charcoal for input text color */
  color: var(--color-charcoal);
}

/* ADDED: Custom style for the placeholder text */
.input::placeholder {
  color: var(--color-charcoal, #302e2d);
  opacity: 0.7; /* Muted placeholder color */
}

.input:focus {
  /* Use Pure Gold for the focus ring for a premium, accessible highlight */
  box-shadow: 0 0 0 2px var(--color-pure-gold);
  border-color: var(--color-pure-gold);
}

/* Custom Checkbox Styling */
/* Replaces the default Tailwind blue checkbox */
.custom-checkbox {
  /* Hide default checkbox */
  -webkit-appearance: none;
  appearance: none;
  /* Size and shape */
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-navy-blue);
  border-radius: 0.25rem;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s, border-color 0.2s;
}

/* Checkbox Checked State */
.custom-checkbox:checked {
  background-color: var(--color-navy-blue);
  border-color: var(--color-navy-blue);
}

/* Custom Checkmark (using Pure Gold) */
.custom-checkbox:checked::after {
  content: '\2713'; /* Checkmark symbol */
  font-size: 1rem;
  color: var(--color-pure-gold); /* Pure Gold checkmark */
  position: absolute;
  top: -1px;
  left: 2px;
}
</style>