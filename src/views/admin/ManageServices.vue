<template>
  <div class="min-h-screen text-charcoal p-4 sm:p-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text:2xl md:text-3xl font-bold text-navy">
          Service & Pricing Manager
        </h1>
        <p class="text-charcoal/70">
          Manage your services and pricing tiers efficiently
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 border-b-2 border-golden-brown">
        <button
          @click="activeTab = 'services'"
          :class="[
            'px-6 py-3 font-semibold text-sm transition-all duration-300 relative cursor-pointer',
            activeTab === 'services'
              ? 'text-golden-brown'
              : 'text-charcoal/60 hover:text-charcoal',
          ]"
        >
          Services (Definitions)
          <div
            v-if="activeTab === 'services'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-golden-brown"
          ></div>
        </button>
        <button
          @click="activeTab = 'pricings'"
          :class="[
            'px-6 py-3 font-semibold text-sm transition-all duration-300 relative cursor-pointer',
            activeTab === 'pricings'
              ? 'text-golden-brown'
              : 'text-charcoal/60 hover:text-charcoal',
          ]"
        >
          Service Pricings
          <div
            v-if="activeTab === 'pricings'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-golden-brown"
          ></div>
        </button>
      </div>

      <!-- Services Tab -->
      <div v-if="activeTab === 'services'" class="space-y-6 animate-fadeIn">
        <div class="flex justify-between items-center">
          <h2 class="text-3xl font-bold text-charcoal">
            Services
            <span class="text-golden-brown">({{ services.length }})</span>
          </h2>
          <button
            @click="openServiceModal()"
            class="inline-flex items-center gap-2 px-5 py-3 bg-golden-brown text-bone-white rounded-xl hover:bg-pure-gold hover:text-charcoal font-semibold transition-all duration-300"
          >
            <i class="fas fa-plus"></i>
            Add Service
          </button>
        </div>

        <div
          class="bg-white rounded-2xl border border-golden-brown/40 overflow-hidden"
        >
          <div
            v-if="isServicesLoading"
            class="flex items-center justify-center py-16 text-charcoal/60"
          >
            <i class="fas fa-spinner fa-spin mr-3"></i>Loading services...
          </div>

          <div
            v-else-if="services.length === 0"
            class="flex flex-col items-center justify-center py-16 text-charcoal/70"
          >
            <i
              class="fas fa-triangle-exclamation text-4xl mb-3 text-golden-brown"
            ></i>
            <p class="text-lg font-medium">No services defined yet</p>
            <p class="text-sm">Create your first service to get started</p>
          </div>

          <div v-else class="divide-y divide-golden-brown/30">
            <div
              v-for="service in services"
              :key="service._id"
              class="p-5 hover:bg-bone-white transition-colors duration-150 flex justify-between items-start group"
            >
              <div class="flex-1 space-y-2">
                <h3
                  class="text-lg font-semibold text-charcoal group-hover:text-golden-brown transition-colors"
                >
                  {{ service.name }}
                </h3>
                <p class="text-sm text-charcoal/70">
                  {{ service.description || "No description provided" }}
                </p>
                <div class="flex gap-4 text-xs text-charcoal/70 pt-2">
                  <span
                    class="inline-block bg-cream text-charcoal px-3 py-1 rounded-full border border-golden-brown/30"
                  >
                    Code: {{ service.code || "N/A" }}
                  </span>
                  <span
                    class="inline-block bg-golden-brown/20 text-golden-brown px-3 py-1 rounded-full"
                  >
                    Base: ${{ service.basePrice || 0 }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button
                  @click="openServiceModal(service)"
                  class="p-2.5 text-golden-brown hover:bg-golden-brown/20 rounded-lg transition-all duration-200"
                  title="Edit"
                >
                  <i class="fas fa-pen-to-square"></i>
                </button>
                <button
                  @click="confirmDeleteService(service)"
                  class="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                  title="Delete"
                >
                  <i class="fas fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pricings Tab -->
      <div
        v-else-if="activeTab === 'pricings'"
        class="space-y-6 animate-fadeIn"
      >
        <div class="flex justify-between items-center">
          <h2 class="text-3xl font-bold text-charcoal">
            Service Pricings
            <span class="text-golden-brown"
              >({{ servicePricings.length }})</span
            >
          </h2>
        </div>

        <div
          class="bg-white rounded-2xl border border-golden-brown/40 overflow-hidden"
        >
          <div
            v-if="isPricingsLoading"
            class="flex items-center justify-center py-16 text-charcoal/60"
          >
            <i class="fas fa-spinner fa-spin mr-3"></i>Loading pricings...
          </div>

          <div
            v-else-if="servicePricings.length === 0"
            class="flex flex-col items-center justify-center py-16 text-charcoal/70"
          >
            <i
              class="fas fa-triangle-exclamation text-4xl mb-3 text-golden-brown"
            ></i>
            <p class="text-lg font-medium">No pricing tiers defined</p>
          </div>

          <div v-else class="divide-y divide-golden-brown/30">
            <div
              v-for="pricing in servicePricings"
              :key="pricing._id"
              class="p-5 hover:bg-white transition-colors duration-150 flex justify-between items-start group"
            >
              <div class="flex-1 space-y-2">
                <h3
                  class="text-lg font-semibold text-charcoal group-hover:text-golden-brown transition-colors"
                >
                  {{ pricing.serviceName || pricing.service.code }}
                </h3>
                <div class="flex flex-wrap gap-4 text-sm text-charcoal/70">
                  <span
                    class="inline-block bg-cream text-charcoal px-3 py-1 rounded-full border border-golden-brown/30"
                  >
                    Code: {{ pricing.service?.code }}
                  </span>
                  <span
                    class="inline-block bg-golden-brown/20 text-golden-brown px-3 py-1 rounded-full"
                  >
                    Tier: {{ pricing.serviceTier }}
                  </span>
                  <span
                    class="inline-block bg-pure-gold/20 text-charcoal px-3 py-1 rounded-full"
                  >
                    Model: {{ pricing.pricingModel }}
                  </span>
                  <span
                    class="inline-block bg-charcoal/10 text-navy-blue px-3 py-1 rounded-full font-semibold"
                  >
                    ${{ pricing.pricePerItem }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button
                  @click="openPricingModal(pricing)"
                  class="p-2.5 text-golden-brown hover:bg-golden-brown/20 rounded-lg transition-all duration-200"
                  title="Edit"
                >
                  <i class="fas fa-pen-to-square"></i>
                </button>
                <button
                  @click="confirmDeletePricing(pricing)"
                  class="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                  title="Delete"
                >
                  <i class="fas fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Modal -->
      <div
        v-if="showServiceModal"
        class="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white rounded-2xl w-full max-w-lg border border-golden-brown/40 space-y-6 p-6 animate-slideUp"
        >
          <h3 class="text-2xl font-bold text-golden-brown">
            {{ isEditService ? "Edit Service" : "Create New Service" }}
          </h3>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-charcoal mb-2"
                >Service Name *</label
              >
              <input
                v-model="currentService.name"
                type="text"
                required
                placeholder="e.g., Web Design"
                class="w-full px-4 py-3 border border-golden-brown/40 rounded-xl focus:ring-2 focus:ring-golden-brown bg-bone-white text-charcoal transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-charcoal mb-2"
                >Description</label
              >
              <textarea
                v-model="currentService.description"
                placeholder="Describe what this service offers..."
                rows="3"
                class="w-full px-4 py-3 border border-golden-brown/40 rounded-xl focus:ring-2 focus:ring-golden-brown bg-bone-white text-charcoal transition-all resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-charcoal mb-2"
                  >Service Code *</label
                >
                <input
                  v-model="currentService.code"
                  type="text"
                  required
                  placeholder="e.g., WD001"
                  :disabled="isEditService"
                  :class="[
                    'w-full px-4 py-3 border border-golden-brown/40 rounded-xl focus:ring-2 focus:ring-golden-brown bg-bone-white text-charcoal transition-all',
                    isEditService ? 'opacity-70 cursor-not-allowed' : '',
                  ]"
                />
                <p v-if="isEditService" class="text-xs text-charcoal/60 mt-1">
                  Code cannot be changed.
                </p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-charcoal mb-2"
                  >Base Price</label
                >
                <input
                  v-model.number="currentService.basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full px-4 py-3 border border-golden-brown/40 rounded-xl focus:ring-2 focus:ring-golden-brown bg-bone-white text-charcoal transition-all"
                />
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                @click="showServiceModal = false"
                class="px-6 py-2.5 border-2 border-golden-brown/40 text-charcoal rounded-xl hover:bg-bone-white transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                @click="submitService"
                :disabled="
                  isSubmitting ||
                  !currentService.name.trim() ||
                  !currentService.code.trim()
                "
                class="px-6 py-2.5 bg-golden-brown text-bone-white rounded-xl hover:bg-pure-gold hover:text-charcoal transition-all font-semibold disabled:opacity-50"
              >
                <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
                {{
                  isSubmitting
                    ? "Saving..."
                    : isEditService
                    ? "Update Service"
                    : "Create Service"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pricing Modal -->
      <div
        v-if="showPricingModal"
        class="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white rounded-2xl w-full max-w-lg border border-golden-brown/40 space-y-6 p-6 animate-slideUp"
        >
          <h3 class="text-2xl font-bold text-golden-brown">
            Edit Service Pricing
          </h3>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-charcoal mb-2">
                Service Code
              </label>
              <input
                v-model="currentPricing.service.code"
                type="text"
                disabled
                class="w-full px-4 py-3 border border-golden-brown/40 rounded-xl bg-bone-white text-charcoal opacity-70 cursor-not-allowed"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-charcoal mb-2">
                Tier
              </label>
              <input
                v-model="currentPricing.serviceTier"
                type="text"
                placeholder="e.g., Standard"
                class="w-full px-4 py-3 border border-golden-brown/40 rounded-xl focus:ring-2 focus:ring-golden-brown bg-bone-white text-charcoal transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-charcoal mb-2">
                Pricing Model
              </label>
              <input
                v-model="currentPricing.pricingModel"
                type="text"
                placeholder="e.g., per item, per hour"
                class="w-full px-4 py-3 border border-golden-brown/40 rounded-xl focus:ring-2 focus:ring-golden-brown bg-bone-white text-charcoal transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-charcoal mb-2">
                Price per Item
              </label>
              <input
                v-model.number="currentPricing.pricePerItem"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full px-4 py-3 border border-golden-brown/40 rounded-xl focus:ring-2 focus:ring-golden-brown bg-bone-white text-charcoal transition-all"
              />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                @click="showPricingModal = false"
                class="px-6 py-2.5 border-2 border-golden-brown/40 text-charcoal rounded-xl hover:bg-bone-white transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                @click="submitPricing"
                :disabled="isSubmitting"
                class="px-6 py-2.5 bg-golden-brown text-bone-white rounded-xl hover:bg-pure-gold hover:text-charcoal transition-all font-semibold disabled:opacity-50"
              >
                <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm Modal -->
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white rounded-2xl w-full max-w-sm border border-golden-brown/40 space-y-6 p-6 animate-slideUp"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl text-red-600"
            >
              <i class="fas fa-triangle-exclamation"></i>
            </div>
            <h3 class="text-xl font-bold text-charcoal">
              {{ confirmData.title }}
            </h3>
          </div>

          <p class="text-charcoal/70 leading-relaxed">
            {{ confirmData.message }}
          </p>

          <div class="flex gap-3 justify-end pt-4">
            <button
              @click="showConfirmModal = false"
              class="px-5 py-2.5 border-2 border-golden-brown/40 text-charcoal rounded-xl hover:bg-bone-white transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              @click="handleConfirmAction"
              class="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  getAdminServicePricings,
  updateAdminServicePricing,
  deleteAdminServicePricing,
} from "@/services/api"; // Adjusted path assumption
import { useToast } from "@/composables/useToast";

const { showSuccess, showError } = useToast();

const activeTab = ref("services");
const services = ref([]);
const servicePricings = ref([]);
const isServicesLoading = ref(false);
const isPricingsLoading = ref(false);
const isSubmitting = ref(false);

const showServiceModal = ref(false);
const isEditService = ref(false);
const currentService = ref({
  _id: null,
  name: "",
  description: "",
  code: "",
  basePrice: 0,
});

const showPricingModal = ref(false);
const currentPricing = ref({
  _id: null,
  serviceCode: "",
  serviceTier: "",
  pricingModel: "",
  pricePerItem: 0,
});

const showConfirmModal = ref(false);
const confirmData = ref({
  title: "",
  message: "",
  action: null,
});

let pendingAction = null;

// --- Data Fetching ---

const fetchServices = async () => {
  isServicesLoading.value = true;
  try {
    const data = await getServices();
    // Assuming API returns an array or an object with a 'services' array
    services.value = Array.isArray(data) ? data : data.services || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    showError("Failed to load services.");
  } finally {
    isServicesLoading.value = false;
  }
};

const fetchPricings = async () => {
  isPricingsLoading.value = true;
  try {
    const data = await getAdminServicePricings();
    // Assuming API returns an array or an object with a 'pricings' array
    servicePricings.value = Array.isArray(data) ? data : data.pricings || [];
  } catch (error) {
    console.error("Error fetching pricings:", error);
    showError("Failed to load pricings.");
  } finally {
    isPricingsLoading.value = false;
  }
};

const syncData = async () => {
  await Promise.all([fetchServices(), fetchPricings()]);
};

// --- Service Logic ---

const openServiceModal = (service = null) => {
  if (service) {
    isEditService.value = true;
    currentService.value = { ...service };
  } else {
    isEditService.value = false;
    currentService.value = {
      _id: null,
      name: "",
      description: "",
      code: "",
      basePrice: 0,
    };
  }
  showServiceModal.value = true;
};

const submitService = async () => {
  // Client-side validation
  if (!currentService.value.name.trim() || !currentService.value.code.trim()) {
    showError("Service Name and Code are required.");
    return;
  }

  // FIX: Deduplication Check (only on creation)
  if (!isEditService.value) {
    const normalizedCode = currentService.value.code.trim().toLowerCase();
    const existing = services.value.some(
      (s) => s.code && s.code.toLowerCase() === normalizedCode
    );
    if (existing) {
      showError(
        `A service with code "${currentService.value.code.trim()}" already exists. Service codes must be unique.`
      );
      return;
    }
  }

  isSubmitting.value = true;
  try {
    const payload = { ...currentService.value };

    const apiCall = isEditService.value
      ? updateService(currentService.value._id, payload)
      : createService(payload);

    const response = await apiCall;

    if (response) {
      showSuccess(
        `Service ${isEditService.value ? "updated" : "created"} successfully.`
      );
      showServiceModal.value = false;
      await syncData(); // Re-fetch data to reflect changes immediately
    } else {
      // This path handles unexpected success responses (e.g., 200 OK with no body)
      showError(
        "Operation successful, but response body was empty or malformed."
      );
      // Still close modal and sync data if creation was successful despite the warning
      showServiceModal.value = false;
      await syncData();
    }
  } catch (error) {
    console.error("Service operation error:", error);
    // Use the error message from the API if available, otherwise a generic one
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Unexpected error while saving service.";
    showError(`Failed to save service: ${msg}`);
  } finally {
    isSubmitting.value = false;
  }
};

// --- Pricing Logic ---

const openPricingModal = (pricing) => {
  currentPricing.value = { ...pricing };
  showPricingModal.value = true;
};

const submitPricing = async () => {
  const serviceCode =
    
    currentPricing.value.service?.code ||
    "";

  if (!serviceCode.trim() || !currentPricing.value.serviceTier?.trim()) {
    showError("Service Code and Tier are required.");
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      ...currentPricing.value,
      serviceCode, // flatten to match backend expectation
    };

    const response = await updateAdminServicePricing(
      currentPricing.value._id,
      payload
    );

    if (response) {
      showSuccess("Pricing updated successfully.");
      showPricingModal.value = false;
      await syncData();
    } else {
      showError("Failed to update pricing: Empty response received.");
    }
  } catch (error) {
    console.error("Pricing update error:", error);
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Unexpected error while updating pricing.";
    showError(`Failed to update pricing: ${msg}`);
  } finally {
    isSubmitting.value = false;
  }
};

// --- Delete Confirmation Logic ---

const openDeleteConfirm = (title, message, action) => {
  confirmData.value = { title, message, action };
  pendingAction = action;
  showConfirmModal.value = true;
};

const confirmDeleteService = (service) => {
  openDeleteConfirm(
    "Delete Service",
    `Are you sure you want to permanently delete "${service.name}" (${service.code})? This action cannot be undone and may affect associated pricings.`,
    async () => {
      isSubmitting.value = true;
      try {
        await deleteService(service._id);
        showSuccess("Service deleted successfully.");
        await syncData();
      } catch (error) {
        console.error("Delete service error:", error);
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete service.";
        showError(`Deletion failed: ${msg}`);
      } finally {
        isSubmitting.value = false;
      }
    }
  );
};

const confirmDeletePricing = (pricing) => {
  openDeleteConfirm(
    "Delete Pricing",
    `Are you sure you want to delete the pricing tier "${pricing.serviceTier}" for service ${pricing.service.code}?`,
    async () => {
      isSubmitting.value = true;
      try {
        await deleteAdminServicePricing(pricing._id);
        showSuccess("Pricing deleted successfully.");
        await syncData();
      } catch (error) {
        console.error("Delete pricing error:", error);
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete pricing.";
        showError(`Deletion failed: ${msg}`);
      } finally {
        isSubmitting.value = false;
      }
    }
  );
};

const handleConfirmAction = async () => {
  if (pendingAction) {
    await pendingAction();
  }
  showConfirmModal.value = false;
  pendingAction = null;
};

onMounted(() => {
  syncData();
});
</script>

<style scoped>
/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}
</style>
