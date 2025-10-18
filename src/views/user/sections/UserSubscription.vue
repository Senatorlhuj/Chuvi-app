<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  defineAsyncComponent,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getCurrentSubscription,
  pauseSubscription,
  resumeSubscription,
  changeSubscriptionPlan,
  fetchUserPlans,
  cancelAutoPayment,
} from "@/services/api";
import { useToast } from "@/composables/useToast";
import GradientLoader from "@/components/atoms/GradientLoader.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPause,
  faPlay,
  faExchangeAlt,
  faCalendarAlt,
  faBoxOpen,
  faSync,
  faCircle,
  faTimesCircle,
  faCheckCircle,
  faArrowRight,
  faClock,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

// --- Hooks Instantiation FIX ---
const route = useRoute();
const router = useRouter();
// ------------------------------

const { showSuccess, showError } = useToast();
const PlansPage = defineAsyncComponent(() =>
  import("@/views/user/sections/PlansPage.vue")
);

// --- State ---
const subscription = ref(null);
const isLoading = ref(true);
const error = ref(null);

const actionStates = ref({
  pause: false,
  resume: false,
  planChange: false,
  cancel: false,
});

const showPlanChangeModal = ref(false);
const availablePlans = ref([]);
const isPlanLoading = ref(false);
const newPlanCode = ref(null);

const showConfirmationModal = ref(false);
const confirmationMessage = ref("");
const confirmActionHandler = ref(() => {});
const confirmButtonText = ref("");
const confirmButtonClass = ref("");
const confirmActionType = ref("");

// --- Computed ---
const isSubscriptionActive = computed(
  () => subscription.value?.status === "ACTIVE"
);
const isSubscriptionPaused = computed(
  () => subscription.value?.status === "PAUSED"
);
// Disable the cancel button if auto-renewal is already canceled
const isAutoRenewCancelled = computed(() => {
  return subscription.value?.autoRenew === false;
});

const currentPlanCode = computed(() => subscription.value?.plan?.code);

const selectedNewPlanName = computed(() => {
  if (!newPlanCode.value) return null;
  const plan = availablePlans.value.find((p) => p.code === newPlanCode.value);
  return plan ? plan.name : newPlanCode.value;
});

const itemsRemaining = computed(() => {
  const remaining = subscription.value?.itemsRemaining;
  const monthly = subscription.value?.plan?.monthlyItems;
  return {
    remaining:
      remaining !== undefined && remaining !== null ? remaining : "N/A",
    monthly: monthly !== undefined && monthly !== null ? monthly : "N/A",
  };
});

const daysUntilRenewal = computed(() => {
  if (!subscription.value?.periodEnd) return null;
  const renewalDate = new Date(subscription.value.periodEnd);
  const today = new Date();
  const daysLeft = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));
  return daysLeft > 0 ? daysLeft : 0;
});

// --- Utils ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatPrice = (price) => {
  const priceValue = parseFloat(price);
  if (isNaN(priceValue)) return "N/A";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(priceValue);
};

const openConfirmationModal = (
  message,
  handler,
  btnText,
  btnClass,
  actionType
) => {
  confirmationMessage.value = message;
  confirmActionHandler.value = handler;
  confirmButtonText.value = btnText;
  confirmButtonClass.value = btnClass;
  confirmActionType.value = actionType;
  showConfirmationModal.value = true;
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
  confirmationMessage.value = "";
  confirmActionType.value = "";
};

// --- API ---
const loadCurrentSubscription = async (showLoader = true) => {
  if (showLoader) isLoading.value = true;
  error.value = null;
  try {
    const { subscription: sub } = await getCurrentSubscription();
    subscription.value = sub;
  } catch (err) {
    console.error("Error fetching subscription:", err);
    if (
      err.message?.includes("404") ||
      err.message?.includes("No active subscription")
    ) {
      error.value = "You do not have an active subscription.";
      subscription.value = null;
    } else {
      error.value = err.message || "Failed to load subscription.";
      showError(error.value);
    }
  } finally {
    if (showLoader) isLoading.value = false;
  }
};

const loadAvailablePlans = async () => {
  isPlanLoading.value = true;
  try {
    const plans = await fetchUserPlans();
    availablePlans.value = plans
      .filter((p) => p.code !== currentPlanCode.value && p.active)
      .sort((a, b) => a.price - b.price);
  } catch (err) {
    showError(err.message || "Failed to load plans.");
  } finally {
    isPlanLoading.value = false;
  }
};

// --- Actions ---
const handlePause = async () => {
  actionStates.value.pause = true;
  try {
    const { subscription: sub } = await pauseSubscription();
    subscription.value = sub;
    showSuccess("Subscription paused successfully.");
  } catch (err) {
    showError(err.message || "Unable to pause subscription.");
  } finally {
    actionStates.value.pause = false;
    closeConfirmationModal();
  }
};

const handleResume = async () => {
  actionStates.value.resume = true;
  try {
    const { subscription: sub } = await resumeSubscription();
    subscription.value = sub;
    showSuccess("Subscription resumed successfully.");
  } catch (err) {
    showError(err.message || "Unable to resume subscription.");
  } finally {
    actionStates.value.resume = false;
    closeConfirmationModal();
  }
};

const openPauseConfirm = () => {
  openConfirmationModal(
    "Pause your subscription to temporarily stop usage. You can resume anytime.",
    handlePause,
    "Pause Subscription",
    "bg-golden-brown text-white hover:bg-charcoal",
    "pause"
  );
};

const openResumeConfirm = () => {
  openConfirmationModal(
    "Resume your subscription to continue service. Billing resumes immediately.",
    handleResume,
    "Resume Subscription",
    "bg-brand-green text-white hover:bg-brand-green/80",
    "resume"
  );
};

const handlePlanChange = async () => {
  showPlanChangeModal.value = true;
  // No need to reload from API — just ensure isCurrent flag is set correctly
  availablePlans.value = availablePlans.value.map((p) => ({
    ...p,
    isCurrent: p.code === subscription.value?.plan?.code,
  }));
};


const closePlanChangeModal = () => {
  showPlanChangeModal.value = false;
  newPlanCode.value = null;
};

const submitPlanChange = async () => {
  if (!newPlanCode.value) {
    showError("Please select a new plan first.");
    return;
  }

  const newPlan = availablePlans.value.find(
    (p) => p.code === newPlanCode.value
  );
  const confirmMsg = `Change from ${subscription.value.plan?.name} to ${newPlan?.name}?`;

  openConfirmationModal(
    confirmMsg,
    async () => {
      actionStates.value.planChange = true;
      try {
        const response = await changeSubscriptionPlan({
          newPlanCode: newPlanCode.value,
          paymentGateway: "PAYSTACK",
        });

        if (
          response.payment?.authorization_url ||
          response.payment?.checkoutUrl
        ) {
          // Redirect for immediate payment if required
          window.location.href =
            response.payment.authorization_url || response.payment.checkoutUrl;
          return;
        }

        await loadCurrentSubscription();
        showSuccess(response.message || "Plan changed successfully!");
        closePlanChangeModal();
      } catch (err) {
        showError(err.message || "Plan change failed.");
      } finally {
        actionStates.value.planChange = false;
        closeConfirmationModal();
      }
    },
    "Confirm Change",
    "bg-navy-blue text-white hover:bg-charcoal",
    "planChange"
  );
};

const handleCancelAutoRenew = async () => {
  actionStates.value.cancel = true;
  try {
    await cancelAutoPayment(subscription.value.subId, {
      reason: "User cancelled auto-renewal",
    });
    // Reload subscription without showing the full loader to avoid a flash
    await loadCurrentSubscription(false);
    showSuccess("Auto-renewal cancelled successfully!");
  } catch (err) {
    showError(err.message || "Failed to cancel auto-renewal.");
  } finally {
    actionStates.value.cancel = false;
    closeConfirmationModal();
  }
};

const openCancelConfirm = () => {
  openConfirmationModal(
    "Cancel auto-renewal to stop future subscription charges. You can resubscribe anytime.",
    handleCancelAutoRenew,
    "Cancel Auto-Renewal",
    "bg-red-600 text-white hover:bg-red-700",
    "cancel"
  );
};

// --- Lifecycle ---
let refreshInterval = null;

onMounted(async () => {
  await loadCurrentSubscription();
  await loadAvailablePlans(); // ⬅ Prefetch all plans for modal

  const justSubscribed =
    route.query.status === "success" ||
    route.query.reference ||
    localStorage.getItem("subscribing") === "true";

  if (justSubscribed) {
    showSuccess("Payment confirmed! Refreshing your subscription...");
    await loadCurrentSubscription();
    localStorage.removeItem("subscribing");
    router.replace({ query: {} });
  }

  // Auto-refresh every 60s
  refreshInterval = setInterval(() => {
    loadCurrentSubscription(false);
  }, 60000);
});


onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>

<template>
  <section class="min-h-screen py-8 md:py-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 md:mb-12">
        <h1
          class="text-4xl md:text-3xl font-bold text-navy-blue mb-2"
          style="font-family: var(--font-display)"
        >
          My Subscription
        </h1>
        <p class="text-charcoal text-md">
          Manage your subscription plan and preferences
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-20"
      >
        <GradientLoader v-if="isLoading">
          Loading your subscription...
        </GradientLoader>
      </div>

      <!-- No Active Subscription -->
      <div v-else-if="error" class="space-y-8">
        <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <font-awesome-icon
                :icon="faTimesCircle"
                class="w-6 h-6 text-red-500"
              />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-red-800">
                No Active Subscription
              </h3>
              <p class="text-red-700 mt-2">{{ error }}</p>
              <p class="text-charcoal mt-3">
                You can subscribe to a plan below to get started.
              </p>
            </div>
          </div>
        </div>

        <!-- Dynamically load plan page below -->
        <Suspense>
          <template #default>
            <PlansPage />
          </template>
          <template #fallback>
            <div class="flex flex-col items-center justify-center py-12">
              <div class="relative w-10 h-10 mb-4">
                <div
                  class="absolute inset-0 border-4 border-t-4 border-navy-blue/20 rounded-full animate-spin"
                  style="border-top-color: var(--color-golden-brown)"
                ></div>
              </div>
              <p class="text-charcoal">Loading available plans...</p>
            </div>
          </template>
        </Suspense>
      </div>

      <!-- Active Subscription -->
      <div v-else-if="subscription" class="space-y-6">
        <div
          class="bg-white rounded-2xl overflow-hidden border border-gray-100"
        >
          <!-- Header -->
          <div class="bg-charcoal p-6 md:p-8 text-white">
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <p class="text-sm font-semibold opacity-90 mb-2">
                  Current Plan
                </p>
                <h2
                  class="text-3xl md:text-4xl font-bold"
                  style="font-family: var(--font-display)"
                >
                  {{ subscription.plan?.name || "N/A" }}
                </h2>
              </div>
              <div
                class="flex items-center gap-3 bg-white/20 px-4 py-3 rounded-full w-fit"
              >
                <font-awesome-icon
                  :icon="faCircle"
                  class="w-3 h-3"
                  :class="{
                    'text-brand-green': isSubscriptionActive,
                    'text-golden-brown': isSubscriptionPaused,
                  }"
                />
                <span class="font-semibold text-white">
                  {{ subscription.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="p-6 md:p-8">
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              <!-- Renewal Date -->
              <div
                class="bg-gradient-to-br from-cream to-bone-white p-5 rounded-xl border border-gray-200 hover:border-golden-brown transition-colors"
              >
                <div class="flex items-center justify-between mb-3">
                  <font-awesome-icon
                    :icon="faCalendarAlt"
                    class="w-5 h-5 text-golden-brown"
                  />
                  <span
                    v-if="daysUntilRenewal"
                    class="text-xs font-semibold text-brand-green bg-brand-green/10 px-2 py-1 rounded-full"
                  >
                    {{ daysUntilRenewal }} days
                  </span>
                </div>
                <p class="text-xs text-charcoal font-medium mb-1">
                  Renewal Date
                </p>
                <p class="text-lg font-bold text-navy-blue">
                  {{ formatDate(subscription?.periodEnd) }}
                </p>
              </div>

              <!-- Items Remaining -->
              <div
                class="bg-gradient-to-br from-cream to-bone-white p-5 rounded-xl border border-gray-200 hover:border-golden-brown transition-colors"
              >
                <div class="flex items-center gap-2 mb-3">
                  <font-awesome-icon
                    :icon="faBoxOpen"
                    class="w-5 h-5 text-golden-brown"
                  />
                </div>
                <p class="text-xs text-charcoal font-medium mb-1">
                  Items Remaining
                </p>
                <p class="text-lg font-bold text-navy-blue">
                  <span class="text-2xl">{{ itemsRemaining.remaining }}</span>
                  <span class="text-xs text-golden-brown ml-1">
                    / {{ itemsRemaining.monthly }}
                  </span>
                </p>
              </div>

              <!-- Rollover Limit -->
              <div
                class="bg-gradient-to-br from-cream to-bone-white p-5 rounded-xl border border-gray-200 hover:border-golden-brown transition-colors"
              >
                <div class="flex items-center gap-2 mb-3">
                  <font-awesome-icon
                    :icon="faSync"
                    class="w-5 h-5 text-golden-brown"
                  />
                </div>
                <p class="text-xs text-charcoal font-medium mb-1">
                  Rollover Limit
                </p>
                <p class="text-lg font-bold text-navy-blue">
                  {{ subscription.plan?.rollover_limit_items || 0 }} Items
                </p>
              </div>

              <!-- Monthly Cost -->
              <div
                class="bg-gradient-to-br from-cream to-bone-white p-5 rounded-xl border border-gray-200 hover:border-golden-brown transition-colors"
              >
                <div class="flex items-center gap-2 mb-3">
                  <font-awesome-icon
                    :icon="faClock"
                    class="w-5 h-5 text-golden-brown"
                  />
                </div>
                <p class="text-xs text-charcoal font-medium mb-1">
                  Monthly Cost
                </p>
                <p class="text-lg font-bold text-navy-blue">
                  {{ formatPrice(subscription.plan?.price || 0) }}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div
              class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200"
            >
              <!-- Pause / Resume -->
              <button
                @click="
                  isSubscriptionActive
                    ? openPauseConfirm()
                    : openResumeConfirm()
                "
                :disabled="actionStates.pause || actionStates.resume"
                class="flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
                :class="
                  isSubscriptionActive
                    ? 'bg-golden-brown/10 text-golden-brown hover:bg-golden-brown hover:text-navy-blue border border-golden-brown hover:border-golden-brown'
                    : 'bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white border border-brand-green hover:border-brand-green'
                "
              >
                <font-awesome-icon
                  :icon="
                    actionStates.pause || actionStates.resume
                      ? faSpinner
                      : isSubscriptionActive
                      ? faPause
                      : faPlay
                  "
                  :class="{
                    'animate-spin': actionStates.pause || actionStates.resume,
                  }"
                  class="w-4 h-4"
                />
                <span>
                  {{
                    actionStates.pause
                      ? "Pausing..."
                      : actionStates.resume
                      ? "Resuming..."
                      : isSubscriptionActive
                      ? "Pause"
                      : "Resume"
                  }}
                </span>
              </button>

              <!-- Change Plan -->
              <button
                v-if="isSubscriptionActive"
                @click="handlePlanChange"
                :disabled="actionStates.planChange"
                class="flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed bg-navy-blue text-white hover:bg-charcoal border border-navy-blue hover:border-charcoal"
              >
                <font-awesome-icon :icon="faExchangeAlt" class="w-4 h-4" />
                <span>Change Plan</span>
              </button>

              <!-- Cancel Auto-Renew -->
              <button
                @click="openCancelConfirm"
                :disabled="actionStates.cancel || isAutoRenewCancelled"
                class="flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 border border-red-300 hover:border-red-600 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                <font-awesome-icon
                  :icon="actionStates.cancel ? faSpinner : faTimesCircle"
                  :class="{ 'animate-spin': actionStates.cancel }"
                  class="w-4 h-4"
                />
                <span>
                  {{
                    isAutoRenewCancelled
                      ? "Auto-Renew Cancelled"
                      : actionStates.cancel
                      ? "Cancelling..."
                      : "Cancel Auto-Renew"
                  }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6">
          <p class="text-sm md:text-base text-charcoal">
            <span class="font-semibold text-navy-blue">💡 Tip:</span>
            You can pause and resume your subscription anytime without losing
            your balance. Items roll over based on your plan limits.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Plan Change Modal -->
  <div
    v-if="showPlanChangeModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4"
    @click="closePlanChangeModal"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Modal Header -->
      <div
        class="sticky top-0 bg-gradient-to-r from-navy-blue to-charcoal text-white p-6 md:p-8 flex justify-between items-center"
      >
        <div>
          <p class="text-sm font-semibold opacity-90">Upgrade or Downgrade</p>
          <h3
            class="text-2xl md:text-3xl font-bold mt-1"
            style="font-family: var(--font-display)"
          >
            Change Your Plan
          </h3>
        </div>
        <button
          @click="closePlanChangeModal"
          class="text-white hover:text-golden-brown transition-colors"
        >
          <font-awesome-icon :icon="faTimesCircle" class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 md:p-8">
        <h3 class="text-xl font-bold text-navy-blue mb-6">Your Current Plan</h3>

        <div
          v-if="subscription?.plan"
          class="bg-cream border-l-4 border-golden-brown rounded-xl p-4 md:p-6 mb-8"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-navy-blue">
                {{ subscription.plan.name }}
              </p>
              <p class="text-charcoal text-sm mt-1">
                {{ subscription.plan.monthly_items }} items/month •
                {{ formatPrice(subscription.plan.price) }}
              </p>
            </div>
            <font-awesome-icon
              :icon="faCheckCircle"
              class="w-6 h-6 text-brand-green flex-shrink-0"
            />
          </div>
        </div>

        <h4 class="text-lg font-bold text-navy-blue mb-4">Available Plans</h4>

        <div
          v-if="isPlanLoading"
          class="flex flex-col items-center justify-center py-12"
        >
          <div class="relative w-10 h-10 mb-4">
            <div
              class="absolute inset-0 border-4 border-t-4 border-navy-blue/20 rounded-full animate-spin"
              style="border-top-color: var(--color-golden-brown)"
            ></div>
          </div>
          <p class="text-charcoal">Loading available plans...</p>
        </div>

        <div v-else>
          <div
            v-for="plan in availablePlans"
            :key="plan.code"
            class="w-full p-4 md:p-6 rounded-xl border-2 mb-3"
            :class="
              plan.isCurrent
                ? 'border-golden-brown bg-cream'
                : 'border-gray-200 bg-white hover:border-golden-brown transition-all'
            "
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg font-bold text-navy-blue">{{ plan.name }}</p>
                <p class="text-sm text-charcoal">
                  {{ plan.monthly_items }} items/month •
                  {{ formatPrice(plan.price_ngn) }}
                </p>

                
              </div>
              <div v-if="plan.isCurrent">
                <font-awesome-icon
                  :icon="faCheckCircle"
                  class="w-5 h-5 text-brand-green"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <div
    v-if="showConfirmationModal"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4"
    @click="closeConfirmationModal"
  >
    <div class="bg-white rounded-2xl w-full max-w-lg" @click.stop>
      <div
        class="bg-charcoal text-bone-white p-6 flex justify-between items-center"
      >
        <h3 class="text-xl font-bold" style="font-family: var(--font-display)">
          Confirm Action
        </h3>
        <button @click="closeConfirmationModal" class="text-bone-white/80">
          <font-awesome-icon :icon="faTimesCircle" class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6">
        <p class="text-charcoal text-base mb-6 leading-relaxed">
          {{ confirmationMessage }}
        </p>

        <div class="flex gap-3">
          <button
            @click="closeConfirmationModal"
            class="flex-1 py-3 px-4 rounded-xl font-bold border border-gray-300 text-charcoal hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="confirmActionHandler"
            :class="confirmButtonClass"
            :disabled="actionStates[confirmActionType]"
            class="flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <font-awesome-icon
              :icon="
                actionStates[confirmActionType] ? faSpinner : faCheckCircle
              "
              :class="{ 'animate-spin': actionStates[confirmActionType] }"
              class="w-4 h-4"
            />
            <span>{{ confirmButtonText }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom color variable mapping for the dynamic classes */
.text-brand-green {
  color: #27b8a7;
}
.bg-brand-green {
  background-color: #27b8a7;
}
.bg-brand-green\/10 {
  background-color: rgba(39, 184, 167, 0.1);
}
.border-brand-green {
  border-color: #27b8a7;
}

.text-red-600 {
  color: #dc2626;
}
.border-red-600 {
  border-color: #dc2626;
}
.hover\:bg-brand-green\/80:hover {
  background-color: rgba(39, 184, 167, 0.8);
}

/* Ensure custom colors are accessible via Tailwind classes where not defined as variables */
.text-navy-blue {
  color: var(--color-navy-blue, #00022e);
}
.bg-navy-blue {
  background-color: var(--color-navy-blue, #00022e);
}

.text-golden-brown {
  color: var(--color-golden-brown, #996515);
}
.bg-golden-brown {
  background-color: var(--color-golden-brown, #996515);
}

.text-charcoal {
  color: var(--color-charcoal, #302e2d);
}
.bg-charcoal {
  background-color: var(--color-charcoal, #302e2d);
}

.bg-cream {
  background-color: var(--color-cream, #fdfbd4);
}
.bg-bone-white {
  background-color: var(--color-bone-white, #f6f4f1);
}

/* Standard Tailwind overrides */
button:disabled {
  pointer-events: none;
  filter: grayscale(0.5);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

div[v-if] {
  animation: fadeIn 0.3s ease-out;
}
</style>
