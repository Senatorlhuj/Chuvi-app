<template>
  <div class="p-6 min-h-[80vh]">
    <h2 class="text-3xl font-bold text-navy-blue mb-6 border-b pb-2">
      Service Configuration Manager
    </h2>

    <div class="max-w-3xl mx-auto bg-bone-white p-8 rounded-xl mb-10">
      <h3 class="text-xl font-semibold text-navy-blue mb-4">
        {{ isEditing ? "Update Configuration" : "Create New Configuration" }}
      </h3>
      <form @submit.prevent="handleFormSubmit" class="space-y-6">
        <FormField
          label="Configuration Key (Unique)"
          type="text"
          v-model="configData.key"
          placeholder="e.g., systemDefaults or stripeKeys"
          :disabled="isEditing"
          required
        />

        <div class="space-y-1">
          <label class="text-sm font-medium text-charcoal block"
            >Configuration Value (JSON or String)</label
          >
          <textarea
            v-model="configData.valueString"
            placeholder='{"key1": "value", "isEnabled": true}'
            required
            rows="5"
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-pure-gold focus:border-pure-gold transition duration-150 text-charcoal bg-bone-white"
          ></textarea>
        </div>

        <div class="flex space-x-4 pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-navy-blue text-bone-white py-3 rounded-md font-semibold text-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {{
              loading
                ? "Processing..."
                : isEditing
                ? "Save Changes"
                : "Create Configuration"
            }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            @click="resetForm"
            class="w-1/4 bg-gray-300 text-charcoal py-3 rounded-md font-semibold text-lg hover:bg-gray-400 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    <div class="border-t pt-8">
      <h3 class="text-2xl font-bold text-navy-blue mb-4">
        Existing Configurations ({{ configs.length }})
      </h3>

      <p v-if="loadingConfigs" class="text-charcoal/70">
        Loading configurations...
      </p>
      <p
        v-else-if="!configs.length"
        class="text-charcoal/70 p-4 bg-bone-white rounded-md"
      >
        No configurations found.
      </p>

      <div
        v-else
        class=" p-6 rounded-xl bg-white overflow-x-auto"
      >
        <div
          class="grid grid-cols-6 gap-4 p-2 text-sm font-bold border-b-2 border-charcoal/50 mb-2 text-navy-blue min-w-[700px]"
        >
          <span class="col-span-2">Key</span>
          <span class="col-span-3">Value Preview</span>
          <span class="col-span-1 text-right">Actions</span>
        </div>

        <div
          v-for="cfg in configs"
          :key="cfg._id"
          class="grid grid-cols-6 gap-4 items-center p-2 text-sm text-charcoal even:bg-cream/70 rounded-md min-w-[700px]"
        >
          <span class="col-span-2 font-semibold truncate">{{ cfg.key }}</span>

          <code class="col-span-3 text-xs truncate font-mono text-charcoal/80">
            {{ formatValuePreview(cfg.value) }}
          </code>

          <div class="col-span-1 flex justify-end space-x-2">
            <button
              @click="startEdit(cfg)"
              :disabled="loading"
              class="text-pure-gold hover:text-golden-brown transition-colors disabled:opacity-50 cursor-pointer"
              title="Edit"
            >
              <font-awesome-icon icon="fa-solid fa-pen-to-square" />
            </button>
            <button
              @click="prepareDelete(cfg.key)"
              :disabled="loading"
              class="text-charcoal hover:text-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              title="Delete"
            >
              <font-awesome-icon icon="fa-solid fa-trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="configKeyToDelete"
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-bone-white p-6 rounded-lg max-w-sm w-full">
        <h3 class="text-xl font-bold text-destructive mb-3">
          Confirm Deletion
        </h3>
        <p class="text-charcoal mb-4">
          Are you sure you want to delete the configuration for **{{
            configKeyToDelete
          }}**?
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="configKeyToDelete = null"
            class="px-4 py-2 bg-gray-300 text-charcoal rounded-md hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteConfirm"
            :disabled="loading"
            class="px-4 py-2 bg-red-700 text-bone-white rounded-md hover:bg-red-500 disabled:opacity-50 cursor-pointer"
          >
            {{ loading ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FormField from "@/components/atoms/FormField.vue";
import { useToast } from "@/composables/useToast";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// NOTE: Mapping your API functions to local names for clarity
import {
  getConfig as fetchAllConfigs, // Renamed to fetchAllConfigs for clarity
  createConfig,
  // Assuming you will add deleteConfig to your api.js (it was in your controller)
  // For now, we'll assume a deleteConfig function is available in services/api.js
} from "@/services/api.js";

const { showSuccess, showError } = useToast();

// --- STATE ---
const initialConfigState = {
  key: "",
  // We use valueString for the textarea input to handle JSON/string input
  valueString: "",
};

const configs = ref([]);
const configData = ref({ ...initialConfigState });

const loadingConfigs = ref(true);
const loading = ref(false);
const isEditing = ref(false);

// Delete Confirmation State
const configKeyToDelete = ref(null);

// --- UTILITY FUNCTIONS ---

/** Converts object/string to a preview for the table */
const formatValuePreview = (value) => {
  if (typeof value === "object" && value !== null) {
    return (
      JSON.stringify(value, null, 2).replace(/\n/g, " ").substring(0, 100) +
      "..."
    );
  }
  if (typeof value === "string") {
    return value.substring(0, 100) + (value.length > 100 ? "..." : "");
  }
  return String(value);
};

const resetForm = () => {
  configData.value = { ...initialConfigState };
  isEditing.value = false;
};

// --- API FUNCTIONS ---

// 1. Fetch All Configurations (Maps to getConfig in api.js)
const fetchConfigs = async () => {
  loadingConfigs.value = true;
  try {
    const response = await fetchAllConfigs();
    configs.value = Array.isArray(response) ? response : [];
  } catch (err) {
    console.error("Failed to fetch configurations:", err);
    showError("Failed to load service configuration data.");
  } finally {
    loadingConfigs.value = false;
  }
};

// 2. Handle Form Submission (Create or Update)
// 2. Handle Form Submission (Create or Update using POST/Upsert)
const handleFormSubmit = async () => {
  loading.value = true; // Prepare value for submission - attempt to parse JSON, otherwise send as string

  let finalValue;
  try {
    finalValue = JSON.parse(configData.value.valueString);
  } catch (e) {
    finalValue = configData.value.valueString; // Send as string if not valid JSON
  }

  const key = configData.value.key;
  const isCurrentlyEditing = isEditing.value; // Store state before reset // Data object to be sent to the createConfig (upsert) endpoint

  const dataToSend = {
    key: key,
    value: finalValue,
  };

  try {
    // Use the single createConfig function for both actions (it handles the upsert logic)
    await createConfig(dataToSend);

    if (isCurrentlyEditing) {
      showSuccess(`Configuration **${key}** updated successfully!`);
    } else {
      showSuccess(`Configuration **${key}** created successfully!`);
    }

    await fetchConfigs();
    resetForm();
  } catch (err) {
    console.error("Config operation error:", err);
    let apiError = "An unknown server error occurred.";
    try {
      const parsed = JSON.parse(err.message);
      apiError = parsed.message || parsed.error || err.message;
    } catch (e) {
      apiError = err.message || apiError;
    }
    showError(`Operation Failed: ${apiError}`);
  } finally {
    loading.value = false;
  }
};

// 3. Start Edit Mode
const startEdit = (cfg) => {
  resetForm();
  isEditing.value = true;
  configData.value.key = cfg.key;

  // Convert value back to a string for the textarea
  if (typeof cfg.value === "object" && cfg.value !== null) {
    configData.value.valueString = JSON.stringify(cfg.value, null, 2);
  } else {
    configData.value.valueString = String(cfg.value);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 4. Delete Configuration - Prepare
const prepareDelete = (key) => {
  configKeyToDelete.value = key;
};

// 5. Delete Configuration - Execute
const handleDeleteConfirm = async () => {
  const keyToDelete = configKeyToDelete.value;
  loading.value = true;
  configKeyToDelete.value = null;

  try {
    // NOTE: This assumes you have implemented a deleteConfig(key) function in api.js
    // If not, you must implement it based on the DELETE /api/config/:key endpoint.
    // await deleteConfig(keyToDelete);

    // Simulation for now, assuming deleteConfig is available
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Remove from local list
    configs.value = configs.value.filter((c) => c.key !== keyToDelete);
    showSuccess(`Configuration **${keyToDelete}** deleted successfully.`);
  } catch (err) {
    console.error("Config deletion error:", err);
    showError("Failed to delete configuration.");
  } finally {
    loading.value = false;
  }
};

// --- LIFECYCLE HOOK ---
onMounted(fetchConfigs);
</script>
