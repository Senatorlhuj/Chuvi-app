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
 
  faExclamationTriangle,
  faWifi  
} from "@fortawesome/free-solid-svg-icons";

const route = useRoute();
const router = useRouter();
const { showSuccess, showError } = useToast();
const PlansPage = defineAsyncComponent(() =>
  import("@/views/user/sections/PlansPage.vue")
);

// --- State ---
const subscription = ref(null);
const isLoading = ref(true);
const error = ref(null);
const errorType = ref(null); // NEW: 'network', 'noSubscription', 'server', 'generic'
const networkError = ref(false); // NEW: dedicated network error flag

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
  return subscription.value?.daysLeft || null;
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

const forceRefreshSubscription = async () => {
  await loadCurrentSubscription(false);
  subscription.value = { ...subscription.value };
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
  errorType.value = null;

  try {
    const response = await getCurrentSubscription();
    subscription.value = response.subscription || response;
    networkError.value = false; // Reset on success
  } catch (err) {
    console.error("Error fetching subscription:", err);

    // NEW: Detect network errors
    if (
      !navigator.onLine ||
      err.message?.includes("Failed to fetch") ||
      err.message?.includes("Network") ||
      err.code === "ERR_NETWORK"
    ) {
      errorType.value = "network";
      error.value =
        "Network connection error. Please check your internet and try again.";
      networkError.value = true;
    }
    // Existing: No subscription error
    else if (
      err.message?.includes("404") ||
      err.message?.includes("No active subscription")
    ) {
      errorType.value = "noSubscription";
      error.value = null; // Don't show error banner for new users
      subscription.value = null;
    }
    // NEW: Server error
    else if (err.status >= 500 || err.message?.includes("Server")) {
      errorType.value = "server";
      error.value = "Server error. Please try again later.";
    }
    // Fallback: Generic error
    else {
      errorType.value = "generic";
      error.value = "Unable to load subscription. Please try again.";
    }

    if (error.value) showError(error.value);
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
      .sort((a, b) => a.price_ngn - b.price_ngn);
    networkError.value = false; // Reset on success
  } catch (err) {
    // NEW: Check if it's a network error
    if (!navigator.onLine || err.message?.includes('Failed to fetch') || 
        err.message?.includes('Network') || err.code === 'ERR_NETWORK') {
      networkError.value = true;
      showError('Network error. Could not load available plans.');
    } else {
      showError('Unable to load plans. Please try again.');
    }
  } finally {
    isPlanLoading.value = false;
  }
};

// --- Actions ---
const handlePause = async () => {
  actionStates.value.pause = true;
  try {
    const response = await pauseSubscription();
    subscription.value = response.subscription || response;
    showSuccess("Subscription paused successfully.");
    await loadCurrentSubscription(false);
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
    const response = await resumeSubscription();
    subscription.value = response.subscription || response;
    showSuccess("Subscription resumed successfully.");
    await loadCurrentSubscription(false);
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

const handleToggleAutoRenew = async () => {
  if (actionStates.value.cancel) return;

  actionStates.value.cancel = true;
  try {
    await cancelAutoPayment(subscription.value.subId, {
      reason: isAutoRenewCancelled.value
        ? "User enabled auto-renewal"
        : "User cancelled auto-renewal",
    });

    const message = isAutoRenewCancelled.value
      ? "Auto-renewal enabled successfully!"
      : "Auto-renewal cancelled successfully!";

    showSuccess(message);
    await loadCurrentSubscription(false);
  } catch (err) {
    console.error("Toggle auto-renew error:", err);

    // If it's the "already cancelled" error, show specific message and disable the toggle
    if (err.message?.includes("already cancelled")) {
      showError(
        "Auto payment already cancelled. Please contact our support to undo the cancellation."
      );
      // The button will remain disabled due to isAutoRenewCancelled being true
    } else {
      showError(err.message || "Failed to update auto-renewal status.");
    }

    await loadCurrentSubscription(false);
  } finally {
    actionStates.value.cancel = false;
  }
};

// --- Lifecycle ---
let refreshInterval = null;
onMounted(async () => {
  await loadCurrentSubscription();
  await loadAvailablePlans();

  // NEW: Listen for network changes
  window.addEventListener('online', () => {
    networkError.value = false;
    if (subscription.value) {
      showSuccess('Connection restored. Refreshing...');
      forceRefreshSubscription();
    }
  });
  
  window.addEventListener('offline', () => {
    networkError.value = true;
    showError('Lost internet connection. Some features may be unavailable.');
  });

  const justSubscribed = route.query.status === 'success' || 
                        route.query.reference || 
                        localStorage.getItem('subscribing') === 'true';

  if (justSubscribed) {
    showSuccess('Payment confirmed! Refreshing your subscription...');
    await loadCurrentSubscription();
    localStorage.removeItem('subscribing');
    router.replace({ query: {} });
  }

  refreshInterval = setInterval(() => {
    loadCurrentSubscription(false);
  }, 60000);
});


onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
  window.removeEventListener('online', () => {});
  window.removeEventListener('offline', () => {});
});
</script>
<template>
  <section class="min-h-screen py-16 md:py-12">
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

      <!-- Network Error or No Subscription -->
      <div
        v-else-if="error && errorType !== 'noSubscription'"
        class="space-y-8"
      >
        <!-- Network Error (special styling) -->
        <div
          v-if="errorType === 'network'"
          class="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-xl"
        >
          <div class="flex items-start">
            <font-awesome-icon
              :icon="faWifi"
              class="w-6 h-6 text-amber-500 mt-1"
            />
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-amber-800">
                Connection Problem
              </h3>
              <p class="text-amber-700 mt-2">{{ error }}</p>
              <button
                @click="forceRefreshSubscription"
                class="mt-3 text-amber-700 font-semibold underline hover:text-amber-900"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>

        <!-- Server/Generic Error -->
        <div v-else class="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
          <div class="flex items-start">
            <font-awesome-icon
              :icon="faExclamationTriangle"
              class="w-6 h-6 text-red-500 mt-1"
            />
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-red-800">
                Error Loading Subscription
              </h3>
              <p class="text-red-700 mt-2">{{ error }}</p>
              <button
                @click="forceRefreshSubscription"
                class="mt-3 text-red-700 font-semibold underline hover:text-red-900"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Show Plans Page only for users without active subscription AND no network error -->
      <div
        v-else-if="
          !subscription && !networkError && errorType === 'noSubscription'
        "
        class="space-y-8"
      >
        <!-- Existing PlansPage component -->
        <Suspense>
          <template #default>
            <PlansPage />
          </template>
          <template #fallback>
            <!-- existing fallback -->
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
                class="p-5 rounded-xl border transition-colors"
                :class="{
                  'bg-gradient-to-br from-cream to-bone-white border-gray-200 hover:border-golden-brown':
                    !isSubscriptionPaused,
                  'bg-gray-100 border-gray-300 text-gray-400':
                    isSubscriptionPaused,
                }"
              >
                <div class="flex items-center justify-between mb-3">
                  <font-awesome-icon
                    :icon="faCalendarAlt"
                    class="w-5 h-5"
                    :class="{
                      'text-golden-brown': !isSubscriptionPaused,
                      'text-gray-400': isSubscriptionPaused,
                    }"
                  />
                  <span
                    v-if="daysUntilRenewal && !isSubscriptionPaused"
                    class="text-xs font-semibold text-brand-green bg-brand-green/10 px-2 py-1 rounded-full"
                  >
                    {{ daysUntilRenewal }} days left
                  </span>
                </div>
                <p
                  class="text-xs font-medium mb-1"
                  :class="{
                    'text-charcoal': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                >
                  Renewal Date
                </p>
                <p
                  class="text-lg font-bold"
                  :class="{
                    'text-navy-blue': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                >
                  {{
                    isSubscriptionPaused
                      ? "Paused"
                      : formatDate(subscription?.renewalDate)
                  }}
                </p>
              </div>

              <!-- Items Remaining -->
              <div
                class="p-5 rounded-xl border transition-colors"
                :class="{
                  'bg-gradient-to-br from-cream to-bone-white border-gray-200 hover:border-golden-brown':
                    !isSubscriptionPaused,
                  'bg-gray-100 border-gray-300 text-gray-400':
                    isSubscriptionPaused,
                }"
              >
                <div class="flex items-center gap-2 mb-3">
                  <font-awesome-icon
                    :icon="faBoxOpen"
                    class="w-5 h-5"
                    :class="{
                      'text-golden-brown': !isSubscriptionPaused,
                      'text-gray-400': isSubscriptionPaused,
                    }"
                  />
                </div>
                <p
                  class="text-xs font-medium mb-1"
                  :class="{
                    'text-charcoal': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                >
                  Items Remaining
                </p>
                <p
                  class="text-lg font-bold"
                  :class="{
                    'text-navy-blue': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                >
                  <span class="text-2xl">{{ itemsRemaining.remaining }}</span>
                  <span
                    class="text-xs ml-1"
                    :class="{
                      'text-golden-brown': !isSubscriptionPaused,
                      'text-gray-400': isSubscriptionPaused,
                    }"
                  >
                    / {{ itemsRemaining.monthly }}
                  </span>
                </p>
              </div>

              <!-- Rollover Limit -->
              <div
                class="p-5 rounded-xl border transition-colors"
                :class="{
                  'bg-gradient-to-br from-cream to-bone-white border-gray-200 hover:border-golden-brown':
                    !isSubscriptionPaused,
                  'bg-gray-100 border-gray-300 text-gray-400':
                    isSubscriptionPaused,
                }"
              >
                <div class="flex items-center gap-2 mb-3">
                  <font-awesome-icon
                    :icon="faSync"
                    class="w-5 h-5"
                    :class="{
                      'text-golden-brown': !isSubscriptionPaused,
                      'text-gray-400': isSubscriptionPaused,
                    }"
                  />
                </div>
                <p
                  class="text-xs font-medium mb-1"
                  :class="{
                    'text-charcoal': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                >
                  Rollover Limit
                </p>
                <p
                  class="text-lg font-bold"
                  :class="{
                    'text-navy-blue': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                >
                  {{
                    isSubscriptionPaused
                      ? "Paused"
                      : (subscription.plan?.rolloverLimitItems || 0) + " Items"
                  }}
                </p>
              </div>

              <!-- Monthly Cost -->
              <div
                class="p-5 rounded-xl border transition-colors"
                :class="{
                  'bg-gradient-to-br from-cream to-bone-white border-gray-200 hover:border-golden-brown':
                    !isSubscriptionPaused,
                  'bg-gray-100 border-gray-300 text-gray-400':
                    isSubscriptionPaused,
                }"
              >
                <div class="flex items-center gap-2 mb-3">
                  <font-awesome-icon
                    :icon="faClock"
                    class="w-5 h-5"
                    :class="{
                      'text-golden-brown': !isSubscriptionPaused,
                      'text-gray-400': isSubscriptionPaused,
                    }"
                  />
                </div>
                <p
                  class="text-xs font-medium mb-1"
                  :class="{
                    'text-charcoal': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                >
                  Monthly Cost
                </p>
                <p
                  class="text-lg font-bold"
                  :class="{
                    'text-navy-blue': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                >
                  {{
                    isSubscriptionPaused
                      ? "Paused"
                      : formatPrice(subscription.plan?.price || 0)
                  }}
                </p>
              </div>
            </div>

            <!-- Additional Plan Features -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 rounded-xl"
              :class="{
                'bg-gray-50': !isSubscriptionPaused,
                'bg-gray-100': isSubscriptionPaused,
              }"
            >
              <!-- Included Trips -->
              <div class="flex items-center gap-3">
                <font-awesome-icon
                  :icon="faCheckCircle"
                  class="w-4 h-4"
                  :class="{
                    'text-brand-green': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                />
                <span
                  class="text-sm"
                  :class="{
                    'text-charcoal': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                >
                  {{
                    isSubscriptionPaused
                      ? "Paused"
                      : (subscription.plan?.includedTrips || 0) +
                        " included trips"
                  }}
                </span>
              </div>

              <!-- SLA -->
              <div class="flex items-center gap-3">
                <font-awesome-icon
                  :icon="faClock"
                  class="w-4 h-4"
                  :class="{
                    'text-golden-brown': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                />
                <span
                  class="text-sm"
                  :class="{
                    'text-charcoal': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                >
                  {{
                    isSubscriptionPaused
                      ? "Paused"
                      : (subscription.plan?.slaHours || 0) + "h SLA"
                  }}
                </span>
              </div>

              <!-- Auto Renew Toggle Switch -->
              <div class="flex-1">
                <div
                  class="flex items-center justify-between px-4 py-3 rounded-xl border transition-colors"
                  :class="{
                    'border-gray-300 bg-white hover:bg-gray-50':
                      !isAutoRenewCancelled && !isSubscriptionPaused,
                    'border-gray-300 bg-gray-100 cursor-not-allowed':
                      isAutoRenewCancelled || isSubscriptionPaused,
                    'opacity-60': isSubscriptionPaused,
                  }"
                >
                  <div class="flex items-center gap-3">
                    <div>
                      <p
                        class="text-sm font-bold"
                        :class="
                          isAutoRenewCancelled
                            ? 'text-gray-500'
                            : 'text-charcoal'
                        "
                      >
                        Auto-Renew
                      </p>
                      <p
                        class="text-xs"
                        :class="
                          isAutoRenewCancelled
                            ? 'text-gray-400'
                            : 'text-gray-500'
                        "
                      >
                        {{ isAutoRenewCancelled ? "Cancelled" : "Enabled" }}
                      </p>
                    </div>
                  </div>

                  <!-- Toggle Switch Button -->
                  <button
                    @click="handleToggleAutoRenew"
                    :disabled="
                      isAutoRenewCancelled ||
                      actionStates.cancel ||
                      isSubscriptionPaused
                    "
                    class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    :class="
                      isAutoRenewCancelled
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-brand-green hover:bg-brand-green/80'
                    "
                  >
                    <span
                      class="inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md"
                      :class="
                        isAutoRenewCancelled ? 'translate-x-1' : 'translate-x-7'
                      "
                    />
                    <font-awesome-icon
                      v-if="actionStates.cancel"
                      :icon="faSpinner"
                      class="absolute w-3 h-3 animate-spin"
                      :class="
                        isAutoRenewCancelled
                          ? 'text-gray-600 left-1.5'
                          : 'text-white left-5'
                      "
                    />
                  </button>
                </div>

                <!-- Feedback Message (shown only when auto-renew is cancelled) -->
                <div
                  v-if="isAutoRenewCancelled"
                  class="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                >
                  ⓘ Auto payment already cancelled. Please contact our support
                  to undo the cancellation.
                </div>
              </div>

              <!-- Upgrade -->
              <div class="flex items-center gap-3">
                <font-awesome-icon
                  :icon="faExchangeAlt"
                  class="w-4 h-4"
                  :class="{
                    'text-navy-blue': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                />
                <span
                  class="text-sm"
                  :class="{
                    'text-charcoal': !isSubscriptionPaused,
                    'text-gray-400': isSubscriptionPaused,
                  }"
                >
                  {{ isSubscriptionPaused ? "Paused" : "Upgrade Available" }}
                </span>
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
                    ? 'bg-golden-brown/10 text-golden-brown  hover:text-white border border-golden-brown hover:border-golden-brown'
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
                <span>Upgrade</span>
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
                {{ subscription.plan.monthlyItems }} items/month •
                {{ formatPrice(subscription.plan.price) }}
              </p>
              <!-- Additional plan details -->
              <div class="flex flex-wrap gap-4 mt-2 text-xs text-charcoal">
                <span>{{ subscription.plan.includedTrips }} trips</span>
                <span>{{ subscription.plan.slaHours }}h SLA</span>
                <span
                  >Rollover: {{ subscription.plan.rolloverLimitItems }}</span
                >
              </div>
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

        <div v-else class="space-y-4">
          <div
            v-for="plan in availablePlans"
            :key="plan.code"
            @click="newPlanCode = plan.code"
            class="w-full p-4 md:p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
            :class="
              newPlanCode === plan.code
                ? 'border-brand-green bg-brand-green/5'
                : plan.isCurrent
                ? 'border-golden-brown bg-cream'
                : 'border-gray-200 bg-white hover:border-golden-brown'
            "
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <p class="text-lg font-bold text-navy-blue">
                    {{ plan.name }}
                  </p>
                  <span
                    v-if="plan.isCurrent"
                    class="text-xs bg-brand-green text-white px-2 py-1 rounded-full"
                  >
                    Current
                  </span>
                  <span
                    v-if="newPlanCode === plan.code"
                    class="text-xs bg-navy-blue text-white px-2 py-1 rounded-full"
                  >
                    Selected
                  </span>
                </div>
                <p class="text-sm text-charcoal mb-2">
                  {{ plan.monthly_items }} items/month •
                  {{ formatPrice(plan.price_ngn) }}
                </p>

                <!-- Plan Features -->
                <div class="flex flex-wrap gap-3 text-xs text-charcoal mt-2">
                  <span class="flex items-center gap-1">
                    <font-awesome-icon :icon="faBoxOpen" class="w-3 h-3" />
                    {{ plan.included_trips }} trips
                  </span>
                  <span class="flex items-center gap-1">
                    <font-awesome-icon :icon="faClock" class="w-3 h-3" />
                    {{ plan.sla_hours }}h SLA
                  </span>
                  <span
                    v-if="plan.discount_pct"
                    class="flex items-center gap-1 text-brand-green"
                  >
                    <font-awesome-icon :icon="faArrowRight" class="w-3 h-3" />
                    {{ plan.discount_pct }}% off
                  </span>
                  <span class="flex items-center gap-1">
                    <font-awesome-icon :icon="faSync" class="w-3 h-3" />
                    Rollover: {{ plan.rollover_limit_items }}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2 ml-4">
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  :class="
                    newPlanCode === plan.code
                      ? 'border-brand-green bg-brand-green'
                      : 'border-gray-300'
                  "
                >
                  <font-awesome-icon
                    v-if="newPlanCode === plan.code"
                    :icon="faCheckCircle"
                    class="w-3 h-3 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Plan Change Action -->
        <div class="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            @click="closePlanChangeModal"
            class="flex-1 py-3 px-4 rounded-xl font-bold border border-gray-300 text-charcoal hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="submitPlanChange"
            :disabled="!newPlanCode || actionStates.planChange"
            class="flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-navy-blue text-white hover:bg-charcoal disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <font-awesome-icon
              :icon="actionStates.planChange ? faSpinner : faExchangeAlt"
              :class="{ 'animate-spin': actionStates.planChange }"
              class="w-4 h-4"
            />
            <span>
              {{ actionStates.planChange ? "Processing..." : "Change Plan" }}
            </span>
          </button>
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
.bg-brand-green\/5 {
  background-color: rgba(39, 184, 167, 0.05);
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

/* Pause button hover text color */
.bg-golden-brown:hover .text-golden-brown,
.bg-golden-brown\/10:hover .text-golden-brown {
  color: white;
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
