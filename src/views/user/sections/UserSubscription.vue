<script setup>
import { ref, onMounted, computed } from "vue";
import {
  getCurrentSubscription,
  pauseSubscription,
  resumeSubscription,
  changeSubscriptionPlan,
  fetchUserPlans, // <-- New API call for listing plans
} from "@/services/api";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPause,
  faPlay,
  faExchangeAlt,
  faCalendarAlt,
  faBoxOpen,
  faSync,
  faCircle,
  faTimesCircle, // Icon for closing modal
  faCheckCircle, // Icon for plan features
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

// --- State Variables ---
const subscription = ref(null);
const isLoading = ref(true);
const error = ref(null);

// State for general actions (Pause/Resume/Change)
const isActionLoading = ref(false);
const actionError = ref(null);

// State for Plan Change Modal
const showPlanChangeModal = ref(false);
const availablePlans = ref([]);
const isPlanLoading = ref(false);
const newPlanCode = ref(null);

// --- Computed Properties ---
const isSubscriptionActive = computed(
  () => subscription.value?.status === "ACTIVE"
);
const isSubscriptionPaused = computed(
  () => subscription.value?.status === "PAUSED"
);
const currentPlanCode = computed(() => subscription.value?.plan?.code);

// --- Utility Functions ---

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

// --- API Functions ---

const loadCurrentSubscription = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getCurrentSubscription();
    subscription.value = response.subscription || response;
  } catch (err) {
    console.error("Failed to load current subscription:", err);
    if (err.message.includes("404")) {
      error.value = "You do not have an active subscription.";
    } else {
      error.value = err.message || "Failed to fetch subscription details.";
    }
  } finally {
    isLoading.value = false;
  }
};

const loadAvailablePlans = async () => {
  isPlanLoading.value = true;
  actionError.value = null; // Clear previous action error
  try {
    const plans = await fetchUserPlans();
    // Filter out the current plan and plans marked as not active
    availablePlans.value = plans
      .filter((p) => p.code !== currentPlanCode.value && p.active)
      .sort((a, b) => a.price_ngn - b.price_ngn); // Sort by price
  } catch (err) {
    actionError.value =
      err.message || "Failed to load available plans for change.";
  } finally {
    isPlanLoading.value = false;
  }
};

// --- Action Handlers ---

const handlePause = async () => {
  // ... (Pause logic remains the same)
  if (!confirm("Are you sure you want to pause your subscription?")) return;
  isActionLoading.value = true;
  actionError.value = null;
  try {
    await pauseSubscription();
    await loadCurrentSubscription();
    alert("Subscription paused successfully!");
  } catch (err) {
    actionError.value = err.message || "Failed to pause subscription.";
  } finally {
    isActionLoading.value = false;
  }
};

const handleResume = async () => {
  // ... (Resume logic remains the same)
  if (!confirm("Are you sure you want to resume your subscription?")) return;
  isActionLoading.value = true;
  actionError.value = null;
  try {
    await resumeSubscription();
    await loadCurrentSubscription();
    alert("Subscription resumed successfully!");
  } catch (err) {
    actionError.value = err.message || "Failed to resume subscription.";
  } finally {
    isActionLoading.value = false;
  }
};

const handlePlanChange = () => {
  actionError.value = null;
  newPlanCode.value = null;
  showPlanChangeModal.value = true;
  loadAvailablePlans(); // Load plans when modal opens
};

const closePlanChangeModal = () => {
  showPlanChangeModal.value = false;
  newPlanCode.value = null;
};

const submitPlanChange = async () => {
  if (!newPlanCode.value) {
    actionError.value = "Please select a new plan.";
    return;
  }

  if (
    !confirm(
      "Are you sure you want to change your plan? This change is effective immediately."
    )
  )
    return;

  isActionLoading.value = true;
  actionError.value = null;

  try {
    const data = { newPlanCode: newPlanCode.value };
    await changeSubscriptionPlan(data);

    // Success: Close modal, refresh dashboard data, and notify user
    closePlanChangeModal();
    await loadCurrentSubscription();
    alert("Plan successfully changed! Your new plan is now active.");
  } catch (err) {
    actionError.value =
      err.message ||
      "Failed to change subscription plan. Please check if your current period has ended.";
  } finally {
    isActionLoading.value = false;
  }
};

// --- Lifecycle Hook ---
onMounted(loadCurrentSubscription);
</script>

<template>
  <section class="py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        class="text-3xl font-bold text-navy-blue mb-8"
        style="font-family: var(--font-display)"
      >
        My Subscriptions
      </h2>

      <div
        v-if="isLoading"
        class="text-charcoal text-xl "
      >
        <p>Loading your current subscription...</p>
      </div>
      <div
        v-else-if="error"
        class="bg-destructive p-4 rounded-lg text-destructive-foreground text-lg"
      >
        <p>
          {{ error }}
          <span v-if="error.includes('active subscription')"
            >You can find available plans
            <a href="/services" class="underline text-pure-gold">here</a>.</span
          >
        </p>
      </div>

      <div v-else-if="subscription" class="bg-cream p-6 rounded-xl shadow-lg">
        <div
          class="flex justify-between items-start border-b border-gray-300 pb-4 mb-4"
        >
          <div>
            <p class="text-sm font-medium text-charcoal">Current Plan</p>
            <h3 class="text-3xl font-bold text-navy-blue">
              {{ subscription.planName || subscription.plan.name || "N/A" }}
            </h3>
          </div>

          <div class="text-right">
            <p class="text-sm font-medium text-charcoal">Status</p>
            <div class="flex items-center">
              <font-awesome-icon
                :icon="faCircle"
                class="w-3 h-3 mr-2"
                :class="{
                  'text-brand-green': isSubscriptionActive,
                  'text-golden-brown': isSubscriptionPaused,
                  'text-charcoal':
                    subscription.status !== 'ACTIVE' &&
                    subscription.status !== 'PAUSED',
                }"
              />
              <span
                class="text-xl font-semibold"
                :class="{
                  'text-brand-green': isSubscriptionActive,
                  'text-golden-brown': isSubscriptionPaused,
                  'text-charcoal':
                    subscription.status !== 'ACTIVE' &&
                    subscription.status !== 'PAUSED',
                }"
              >
                {{ subscription.status }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-6">
          <div class="bg-bone-white p-4 rounded-lg shadow-sm">
            <font-awesome-icon
              :icon="faCalendarAlt"
              class="text-pure-gold mb-2 w-5 h-5"
            />
            <p class="text-xs text-charcoal">Renewal Date</p>
            <p class="text-md font-semibold text-navy-blue">
              {{ formatDate(subscription.period_end) }}
            </p>
          </div>

          <div class="bg-bone-white p-4 rounded-lg shadow-sm">
            <font-awesome-icon
              :icon="faBoxOpen"
              class="text-pure-gold mb-2 w-5 h-5"
            />
            <p class="text-xs text-charcoal">Items Remaining</p>
            <p class="text-md font-semibold text-navy-blue">
              {{ subscription.items_remaining || "N/A" }}
              <span class="text-xs text-golden-brown"
                >of {{ subscription.plan.monthly_items || "N/A" }}</span
              >
            </p>
          </div>

          <div class="bg-bone-white p-4 rounded-lg shadow-sm">
            <font-awesome-icon
              :icon="faSync"
              class="text-pure-gold mb-2 w-5 h-5"
            />
            <p class="text-xs text-charcoal">Rollover Limit</p>
            <p class="text-md font-semibold text-navy-blue">
              {{ subscription.plan.rollover_limit_items || 0 }} Items
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="isSubscriptionActive ? handlePause() : handleResume()"
            :disabled="isActionLoading"
            class="py-3 px-6 rounded-lg font-bold transition-colors flex items-center justify-center sm:w-1/3 disabled:opacity-50"
            :class="
              isSubscriptionActive
                ? 'bg-golden-brown text-navy-blue hover:bg-opacity-80'
                : 'bg-brand-green text-navy-blue hover:bg-opacity-80'
            "
          >
            <font-awesome-icon
              :icon="isSubscriptionActive ? faPause : faPlay"
              class="mr-2 w-4 h-4"
            />
            {{
              isSubscriptionActive
                ? "Pause Subscription"
                : "Resume Subscription"
            }}
          </button>

          <button
            @click="handlePlanChange"
            :disabled="isActionLoading || isSubscriptionPaused"
            class="py-3 px-6 rounded-lg font-bold bg-navy-blue text-cream hover:bg-charcoal transition-colors flex items-center justify-center sm:w-1/3 disabled:opacity-50"
          >
            <font-awesome-icon :icon="faExchangeAlt" class="mr-2 w-4 h-4" />
            Change Plan
          </button>

          <button
            :disabled="isActionLoading"
            class="py-3 px-6 rounded-lg font-bold text-destructive hover:bg-bone-white transition-colors border-2 border-destructive flex items-center justify-center sm:w-1/3 disabled:opacity-50"
          >
            Cancel Auto-Renew
          </button>
        </div>

        <div
          v-if="actionError"
          class="bg-destructive p-3 rounded text-destructive-foreground mt-4"
        >
          {{ actionError }}
        </div>
      </div>
    </div>
  </section>

  <div
    v-if="showPlanChangeModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-navy-blue bg-opacity-80 transition-opacity"
  >
    <div
      class="bg-bone-white p-8 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center border-b pb-4 mb-6">
        <h3 class="text-2xl font-bold text-navy-blue">
          Change Subscription Plan
        </h3>
        <button
          @click="closePlanChangeModal"
          class="text-charcoal hover:text-golden-brown"
        >
          <font-awesome-icon :icon="faTimesCircle" class="w-6 h-6" />
        </button>
      </div>

      <div class="bg-cream p-4 rounded-lg mb-6 border-l-4 border-pure-gold">
        <p class="text-sm font-semibold text-charcoal">Your Current Plan:</p>
        <p class="text-xl font-bold text-navy-blue">
          {{ subscription.planName || subscription.plan.name || "N/A" }}
          ({{ formatPrice(subscription.plan.price_ngn) }} / month)
        </p>
      </div>

      <div v-if="isPlanLoading" class="text-charcoal text-center py-8">
        Loading available plans...
      </div>
      <div
        v-else-if="availablePlans.length === 0"
        class="text-charcoal text-center py-8"
      >
        No other active plans are currently available for change.
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="plan in availablePlans"
          :key="plan.code"
          @click="newPlanCode = plan.code"
          class="p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center"
          :class="{
            'border-pure-gold bg-cream shadow-md': newPlanCode === plan.code,
            'border-gray-300 bg-bone-white hover:border-golden-brown':
              newPlanCode !== plan.code,
          }"
        >
          <div>
            <p
              class="text-xl font-bold"
              :class="{
                'text-navy-blue': newPlanCode === plan.code,
                'text-charcoal': newPlanCode !== plan.code,
              }"
            >
              {{ plan.name }}
              <span class="text-sm font-normal ml-2 text-golden-brown"
                >({{ plan.tier }})</span
              >
            </p>
            <p class="text-sm text-charcoal mt-1">
              <font-awesome-icon
                :icon="faBoxOpen"
                class="w-3 h-3 mr-1 text-pure-gold"
              />
              {{ plan.monthly_items }} Items |
              <font-awesome-icon
                :icon="faSync"
                class="w-3 h-3 mr-1 text-pure-gold"
              />
              {{ plan.rollover_limit_items }} Rollover
            </p>
          </div>

          <div class="text-right">
            <p class="text-2xl font-extrabold text-navy-blue">
              {{ formatPrice(plan.price_ngn) }}
            </p>
            <span
              v-if="newPlanCode === plan.code"
              class="text-xs font-bold text-pure-gold flex items-center justify-end"
            >
              Selected
              <font-awesome-icon :icon="faCheckCircle" class="ml-1 w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-4 border-t border-gray-300">
        <div
          v-if="actionError"
          class="bg-destructive p-3 rounded text-destructive-foreground mb-4"
        >
          {{ actionError }}
        </div>

        <button
          @click="submitPlanChange"
          :disabled="!newPlanCode || isActionLoading"
          class="w-full py-3 bg-navy-blue text-cream font-bold rounded-lg transition-colors disabled:opacity-50 hover:bg-golden-brown flex items-center justify-center"
        >
          <font-awesome-icon :icon="faArrowRight" class="mr-3 w-4 h-4" />
          <span v-if="isActionLoading">Changing Plan...</span>
          <span v-else>Confirm Change to {{ newPlanCode }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
