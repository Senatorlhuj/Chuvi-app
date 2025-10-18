<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-navy-blue">
              Subscription Plans
            </h1>
            <p class="text-gray-600 text-sm mt-1">Manage and organize your subscription tiers</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="fetchPlans"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-charcoal rounded-lg hover:bg-gray-50 transition font-medium text-sm "
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              @click="openPlanModal()"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-pure-gold text-navy-blue rounded-lg hover:bg-pure-gold/90 transition font-medium text-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New Plan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <div class="relative w-12 h-12 mb-4">
          <div class="absolute inset-0 bg-pure-gold/20 rounded-full animate-pulse"></div>
          <svg class="w-12 h-12 text-pure-gold animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <p class="text-golden-brown font-medium">Loading plans...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
        <div class="flex items-start gap-4">
          <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div>
            <h3 class="font-semibold text-red-800">Error loading plans</h3>
            <p class="text-red-700 text-sm mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="plans.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-200">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-lg font-semibold text-navy-blue mb-2">No plans yet</h3>
        <p class="text-gray-600 mb-6">Get started by creating your first subscription plan</p>
        <button
          @click="openPlanModal()"
          class="inline-flex items-center gap-2 px-6 py-3 bg-pure-gold text-navy-blue rounded-lg hover:bg-pure-gold/90 transition font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create First Plan
        </button>
      </div>

      <!-- Plans Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="plan in plans"
          :key="plan._id"
          class="bg-white rounded-xl border border-gray-200 hover:border-pure-gold/50  transition-all overflow-hidden group"
        >
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-navy-blue/5 to-pure-gold/5 px-6 py-4 border-b border-gray-100">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-bold text-navy-blue">{{ plan.name || "—" }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ plan.code || "—" }}</p>
              </div>
              <span
                :class="
                  plan.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-700'
                "
                class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
              >
                {{ plan.active ? "Active" : "Inactive" }}
              </span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="px-6 py-5 space-y-4">
            <!-- Price -->
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-navy-blue">₦{{ Number(plan.price_ngn || 0).toLocaleString() }}</span>
              <span class="text-gray-600 text-sm">/month</span>
            </div>

            <!-- Plan Details Grid -->
            <div class="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
              <div>
                <p class="text-xs text-gray-600 uppercase tracking-wide font-medium">Family</p>
                <p class="text-sm font-semibold text-charcoal mt-1">{{ plan.family || "—" }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase tracking-wide font-medium">Tier</p>
                <p class="text-sm font-semibold text-charcoal mt-1">{{ plan.tier || "—" }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase tracking-wide font-medium">Items</p>
                <p class="text-sm font-semibold text-charcoal mt-1">{{ plan.monthly_items ?? 0 }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase tracking-wide font-medium">Trips</p>
                <p class="text-sm font-semibold text-charcoal mt-1">{{ plan.included_trips ?? 0 }}</p>
              </div>
            </div>

            <!-- Additional Info -->
            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Overage Fee:</span>
                <span class="font-medium text-charcoal">₦{{ Number(plan.overageFee || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">SLA:</span>
                <span class="font-medium text-charcoal">{{ plan.sla_hours || "—" }} hours</span>
              </div>
            </div>
          </div>

          <!-- Card Footer Actions -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
            <button
              @click="viewPlan(plan._id)"
              class="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              View
            </button>
            <button
              @click="openPlanModal(plan)"
              class="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              Edit
            </button>
            <button
              v-if="!plan.active"
              @click="toggleActive(plan.code, true)"
              class="flex-1 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition"
            >
              Activate
            </button>
            <button
              v-else
              @click="toggleActive(plan.code, false)"
              class="flex-1 px-3 py-2 text-sm font-medium text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
            >
              Deactivate
            </button>
            <button
              @click="confirmDelete(plan)"
              class="flex-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl  w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-navy-blue">
            {{ editing ? "Edit Plan" : "Create New Plan" }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-6">
          <!-- Basic Information -->
          <div>
            <h3 class="text-sm font-semibold text-charcoal uppercase tracking-wide mb-4">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Code</label>
                <input
                  v-model="form.code"
                  type="text"
                  :disabled="editing"
                  placeholder="e.g., BASIC_001"
                  class="input"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="e.g., Basic Plan"
                  class="input"
                />
              </div>
            </div>
          </div>

          <!-- Plan Classification -->
          <div>
            <h3 class="text-sm font-semibold text-charcoal uppercase tracking-wide mb-4 text-gray-700">Classification</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Family</label>
                <select v-model="form.family" class="input">
                  <option value="">Select Family</option>
                  <option value="BASIC_SAVER">BASIC_SAVER</option>
                  <option value="PREM_CHOICE">PREM_CHOICE</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tier</label>
                <select v-model="form.tier" class="input">
                  <option value="">Select Tier</option>
                  <option value="STANDARD">STANDARD</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Pricing & Allocations -->
          <div>
            <h3 class="text-sm font-semibold text-charcoal uppercase tracking-wide mb-4 text-gray-700">Pricing & Allocations</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
                <input
                  v-model.number="form.price_ngn"
                  type="number"
                  placeholder="0"
                  class="input"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Monthly Items</label>
                <input
                  v-model.number="form.monthly_items"
                  type="number"
                  placeholder="0"
                  class="input"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Included Trips</label>
                <input
                  v-model.number="form.included_trips"
                  type="number"
                  placeholder="0"
                  class="input"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Overage Fee (₦)</label>
                <input
                  v-model.number="form.overageFee"
                  type="number"
                  placeholder="0"
                  class="input"
                />
              </div>
            </div>
          </div>

          <!-- Advanced Settings -->
          <div class="border-t border-gray-200 pt-6">
            <button
              @click="showAdvanced = !showAdvanced"
              class="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition mb-4"
            >
              <svg :class="showAdvanced ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              {{ showAdvanced ? "Hide" : "Show" }} Advanced Settings
            </button>

            <transition name="fade">
              <div v-if="showAdvanced" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">SLA (hours)</label>
                  <input
                    v-model.number="form.sla_hours"
                    type="number"
                    placeholder="24"
                    class="input"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Express Multiplier</label>
                  <input
                    v-model.number="form.express_multiplier"
                    type="number"
                    placeholder="1.5"
                    class="input"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Same-day Multiplier</label>
                  <input
                    v-model.number="form.sameDay_multiplier"
                    type="number"
                    placeholder="2"
                    class="input"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                  <input
                    v-model.number="form.discount_pct"
                    type="number"
                    placeholder="0"
                    class="input"
                  />
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            @click="closeModal"
            class="px-6 py-2.5 bg-gray-200 text-charcoal rounded-lg hover:bg-gray-300 transition font-medium text-sm"
          >
            Cancel
          </button>
          <button
            @click="submitPlan"
            :disabled="submitting"
            class="px-6 py-2.5 bg-navy-blue text-white rounded-lg hover:bg-navy-blue/90 transition font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ submitting ? "Saving..." : editing ? "Update Plan" : "Create Plan" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl  p-6 w-full max-w-sm"
      >
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 4v2m0-12a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-navy-blue text-center mb-2">Delete Plan?</h3>
        <p class="text-gray-600 text-center text-sm mb-6">
          You're about to delete <strong>{{ planToDelete?.name }}</strong>. This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2.5 bg-gray-200 text-charcoal rounded-lg hover:bg-gray-300 transition font-medium text-sm"
          >
            Cancel
          </button>
          <button
            @click="deletePlan"
            class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- View Details Modal -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl  w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-navy-blue">Plan Details</h2>
          <button
            @click="showViewModal = false"
            class="text-gray-500 hover:text-gray-700 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div v-if="selectedPlan" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(value, key) in selectedPlan"
              :key="key"
              class="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{{ key }}</p>
              <p class="text-sm font-medium text-charcoal break-words">
                {{ typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value }}
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            @click="showViewModal = false"
            class="px-6 py-2.5 bg-navy-blue text-white rounded-lg hover:bg-navy-blue/90 transition font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  createAdminPlan,
  updateAdminPlan,
  deleteAdminPlan,
  activateAdminPlan,
  deActivateAdminPlan,
  AdminFetchPlans,
  getSingleAdminPlan,
} from "@/services/api";
import { useToast } from "@/composables/useToast";

const { showSuccess, showError } = useToast();

const plans = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const showAdvanced = ref(false);
const editing = ref(false);
const submitting = ref(false);
const form = ref({});
const showDeleteModal = ref(false);
const planToDelete = ref(null);
const showViewModal = ref(false);
const selectedPlan = ref(null);

const fetchPlans = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await AdminFetchPlans();
    plans.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = err.message || "Failed to fetch plans.";
  } finally {
    loading.value = false;
  }
};

const openPlanModal = (plan = null) => {
  editing.value = !!plan;
  form.value = plan
    ? { ...plan }
    : {
        code: "",
        name: "",
        family: "",
        tier: "",
        price_ngn: 0,
        monthly_items: 0,
        included_trips: 0,
        overageFee: 0,
      };
  showAdvanced.value = false;
  showModal.value = true;
};

const closeModal = () => (showModal.value = false);

const submitPlan = async () => {
  if (!form.value.code.trim() || !form.value.name.trim()) {
    showError("Code and Name are required.");
    return;
  }

  submitting.value = true;
  try {
    if (editing.value) {
      await updateAdminPlan(form.value.code, form.value);
      showSuccess("Plan updated successfully.");
    } else {
      await createAdminPlan(form.value);
      showSuccess("Plan created successfully.");
    }
    closeModal();
    await fetchPlans();
  } catch (err) {
    showError(err.message || "Failed to save plan.");
  } finally {
    submitting.value = false;
  }
};

const toggleActive = async (code, activate) => {
  try {
    if (activate) await activateAdminPlan(code);
    else await deActivateAdminPlan(code);
    showSuccess(
      activate
        ? "Plan activated successfully."
        : "Plan deactivated successfully."
    );
    await fetchPlans();
  } catch (err) {
    showError("Failed to update status.");
  }
};

const confirmDelete = (plan) => {
  planToDelete.value = plan;
  showDeleteModal.value = true;
};

const deletePlan = async () => {
  if (!planToDelete.value) return;
  try {
    await deleteAdminPlan(planToDelete.value.code);
    showSuccess("Plan deleted successfully.");
    showDeleteModal.value = false;
    await fetchPlans();
  } catch (err) {
    showError("Failed to delete plan.");
  }
};

const viewPlan = async (planId) => {
  try {
    const data = await getSingleAdminPlan(planId);
    selectedPlan.value = data.plan || data;
    showViewModal.value = true;
  } catch (err) {
    showError("Failed to fetch plan details.");
  }
};

onMounted(fetchPlans);
</script>

<style scoped>
@reference "tailwindcss";

.input {
  @apply w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition bg-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>