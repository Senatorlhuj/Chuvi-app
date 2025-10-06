<template>
  <div class="p-6 md:p-10 max-w-2xl mx-auto text-charcoal">
    <h2
      class="text-3xl font-bold mb-6 text-navy-blue"
      :style="{ fontFamily: 'var(--font-display)' }"
    >
      Laundry Preferences
    </h2>

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
        <CustomSelect
          v-model="form.preferences.fragrance"
          :options="fragranceOptions"
          placeholder="Select fragrance"
          label="Fragrance Selection"
          required
        />
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
import CustomSelect from "@/components/atoms/CustomSelect.vue";
import { useToast } from "@/composables/useToast";


const toast = useToast();

const saving = ref(false);


const fragranceOptions = [
  { label: "Lavender", value: "Lavender" },
  { label: "Rose", value: "Rose" },
  { label: "Vanilla", value: "Vanilla" },
  { label: "Unscented", value: "Unscented" },
];


const form = ref({
  preferences: {
    detergent: "Omo",
    hanger: true,
    fragrance: "Lavender",
    specialCareNotes:
      "Handle delicate fabrics separately and use cold water wash.",
  },
});


const savePreferences = async () => {
  saving.value = true;
  try {

    console.log("Submitted payload:", form.value);


    toast.showSuccess("Laundry preferences saved successfully! 🎉");
  } catch (err) {

    const errorMessage = err.message || "Failed to save preferences";
    toast.showError(errorMessage);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>

.bg-bone-white {
  background-color: var(--color-bone-white);
}
.bg-navy-blue {
  background-color: var(--color-navy-blue);
}
.bg-golden-brown {
  background-color: var(--color-golden-brown);
}

.text-navy-blue {
  color: var(--color-navy-blue);
}
.text-charcoal {
  color: var(--color-charcoal);
}
.text-golden-brown {
  color: var(--color-golden-brown);
}
.text-bone-white {
  color: var(--color-bone-white);
}
.text-pure-gold {
  color: var(--color-pure-gold);
}


.input {
  width: 100%;
  border: 1px solid var(--color-charcoal, #302e2d);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  background-color: var(--color-bone-white);
  color: var(--color-charcoal);
}

.input::placeholder {
  color: var(--color-charcoal);
  opacity: 0.7; 
}

.input:focus {
  border-color: var(--color-golden-brown);
}


.custom-checkbox {
  -webkit-appearance: none;
  appearance: none;

  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-charcoal); /* Border with charcoal */
  border-radius: 0.25rem;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s, border-color 0.2s;
  background-color: var(--color-bone-white);
}

/* Checkbox Checked State: Use Golden Brown */
.custom-checkbox:checked {
  background-color: var(
    --color-golden-brown
  ); /* Fill with golden brown when checked */
  border-color: var(--color-golden-brown);
}

/* Custom Checkmark (White checkmark on Golden Brown background) */
.custom-checkbox:checked::after {
  content: "";
  position: absolute;
  /* Checkmark SVG Path (adjusted for size) */
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 00-1.414 0L7 8.586 4.207 5.793a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0l5-5a1 1 0 000-1.414z'/%3e%3c/svg%3e");
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

/* Focus state using Pure Gold */
.custom-checkbox:focus {
  outline: none;
}
</style>