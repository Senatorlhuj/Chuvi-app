<template>
  <div
    class="min-h-screen "
  >
    <div
      class=" border-b border-charcoal/10 mt-8"
    >
      <div
        class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Go back"
          >
            <svg
              class="w-5 h-5 text-[#171413]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-[#171413]">
              Track Order
            </h1>
            <p class="text-xs sm:text-sm text-[#959190] mt-1">
              #{{ orderNumber }}
            </p>
          </div>
        </div>
        <div class="text-right hidden sm:block">
          <p class="text-xs text-[#959190] uppercase tracking-wider">
            Current Status
          </p>
          <p class="text-lg font-bold text-[#d1671f]">{{ currentStatus }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="relative w-16 h-16 mb-4">
          <div
            class="absolute inset-0 bg-gradient-to-r from-[#d1671f] to-[#d1671f] rounded-full animate-spin"
            style="mask-image: conic-gradient(transparent 25%, black)"
          ></div>
        </div>
        <p class="text-[#959190] font-medium animate-pulse">
          Loading order status...
        </p>
      </div>

      <div
        v-else-if="error"
        class="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center"
      >
        <i class="fa-solid fa-triangle-exclamation text-5xl mb-4 text-red-600"></i>
        <p class="text-red-700 font-semibold text-lg mb-4">{{ error }}</p>
        <button
          @click="fetchOrderStatus"
          class="px-6 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#D41C1C] transition-colors font-medium cursor-pointer"
        >
          Try Again
        </button>
      </div>

      <div v-else-if="!loading && !error" class="space-y-8">
        <div
          class="bg-white rounded-2xl  border border-gray-200 overflow-hidden"
        >
          <div
            class="bg-charcoal text-bone-white px-6 sm:px-8 py-4"
          >
            <h2
              class="text-lg sm:text-xl font-bold text-white flex items-center gap-2"
            >
              <i class="fa-solid fa-location-dot"></i> Order Progress
            </h2>
          </div>

          <div class="p-6 sm:p-8">
            <div class="hidden md:block">
              <div class="relative">
                <div class="absolute top-6 left-0 w-full h-1 bg-gray-200">
                  <div
                    class="h-full bg-[#16A34A] text-bone-white transition-all duration-500"
                    :style="{
                      width: `${
                        (currentStepIndex / (steps.length - 1)) * 100
                      }%`,
                    }"
                  ></div>
                </div>

                <div class="grid grid-cols-6 gap-0 relative z-10">
                  <div
                    v-for="(step, index) in steps"
                    :key="index"
                    class="flex flex-col items-center"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 mb-3"
                      :class="{
                        'bg-gradient-to-br from-[#d1671f] to-[#d1671f] text-white scale-110':
                          index === currentStepIndex,
                        'bg-[#16A34A] text-white': index < currentStepIndex,
                        'bg-gray-200 text-[#959190]': index > currentStepIndex,
                      }"
                    >
                      <span v-if="index < currentStepIndex">✓</span>
                      <span v-else-if="index === currentStepIndex">
                        <span class="animate-pulse">●</span>
                      </span>
                      <span v-else>{{ index + 1 }}</span>
                    </div>

                    <span
                      class="text-xs sm:text-sm font-semibold text-center transition-colors duration-300"
                      :class="{
                        'text-[#d1671f]': index === currentStepIndex,
                        'text-[#16A34A]': index < currentStepIndex,
                        'text-[#959190]': index > currentStepIndex,
                      }"
                    >
                      {{ step }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="md:hidden space-y-4">
              <div
                v-for="(step, index) in steps"
                :key="index"
                class="flex gap-4 relative"
              >
                <div class="relative flex flex-col items-center">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300  flex-shrink-0"
                    :class="{
                      'bg-goden-brown text-white scale-100':
                        index === currentStepIndex,
                      'bg-[#16A34A] text-white': index < currentStepIndex,
                      'bg-gray-200 text-[#959190]': index > currentStepIndex,
                    }"
                  >
                    <span v-if="index < currentStepIndex">✓</span>
                    <span v-else-if="index === currentStepIndex">
                      <span class="animate-pulse">●</span>
                    </span>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <div
                    v-if="index < steps.length - 1"
                    class="w-1 flex-grow transition-colors duration-300"
                    :class="{
                      'bg-gradient-to-b from-[#d1671f] to-[#d1671f]':
                        index < currentStepIndex,
                      'bg-gray-200': index >= currentStepIndex,
                    }"
                  ></div>
                </div>

                <div class="flex-grow pb-8">
                  <p
                    class="font-semibold transition-colors duration-300 pt-1"
                    :class="{
                      'text-[#d1671f]': index === currentStepIndex,
                      'text-[#16A34A]': index < currentStepIndex,
                      'text-[#959190]': index > currentStepIndex,
                    }"
                  >
                    {{ step }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl  border border-gray-200 overflow-hidden"
        >
          <div
            class="bg-charcoal/10  px-6 sm:px-8 py-4"
          >
            <h2
              class="text-lg sm:text-xl font-bold text-charcoal flex items-center gap-2"
            >
              <i class="fa-solid fa-note-sticky"></i> Staff Notes
            </h2>
          </div>

          <div class="p-6 sm:p-8">
            <div v-if="pickupNotes" class="space-y-4">
              <div
                class="bg-violet-50 border-l-4 border-[#8B5CF6] p-4 rounded-r-lg"
              >
                <p class="text-[#171413] leading-relaxed">{{ pickupNotes }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-[#959190] text-sm italic">
                No notes from staff yet
              </p>
            </div>

            <div v-if="photoUrl" class="mt-6">
              <p class="text-sm font-semibold text-[#171413] mb-3">
                <i class="fa-solid fa-camera mr-2"></i> Photo from Staff
              </p>
              <div
                class="relative rounded-xl overflow-hidden  border border-gray-200 max-w-md"
              >
                <img
                  :src="photoUrl"
                  alt="Order photo from staff"
                  class="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            class="bg-white rounded-2xl  border border-gray-200 p-6"
          >
            <p
              class="text-xs font-bold text-[#959190] uppercase tracking-widest mb-2"
            >
              Order Number
            </p>
            <p class="text-2xl font-bold text-[#171413]">#{{ orderNumber }}</p>
          </div>

          <div
            class="bg-white rounded-2xl border border-gray-200 p-6"
          >
            <p
              class="text-xs font-bold text-[#959190] uppercase tracking-widest mb-2"
            >
              Current Status
            </p>
            <div class="flex items-center gap-2">
              <div
                class="w-3 h-3 rounded-full bg-[#d1671f] animate-pulse"
              ></div>
              <p class="text-2xl font-bold text-[#d1671f]">
                {{ currentStatus }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            v-if="currentStepIndex < 2"
            @click="openCancelModal"
            class="flex-1 py-4 px-6 bg-charcoal text-bone-white rounded-xl font-semibold  transition-all duration-300 flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-ban"></i>
            Cancel Order
          </button>

          <button
            @click="fetchOrderStatus"
            class="flex-1 py-4 px-6 bg-white border-2 border-gray-200 text-[#171413] rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <i class="fa-solid fa-rotate-right"></i>
            Refresh Status
          </button>
        </div>

        <div
          v-if="currentStepIndex >= 2"
          class="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <i class="fa-solid fa-circle-info text-xl flex-shrink-0 text-[#d1671f]"></i>
          <p class="text-[#d1671f] text-sm">
            This order is too far in processing to be cancelled. Please contact
            support if you need assistance.
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="showCancelModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      @click="closeCancelModal"
    >
      <div
        class="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div
          class="sticky top-0 bg-gradient-to-r from-[#DC2626] to-[#DC2626] p-6 text-white flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-ban text-2xl"></i>
            <h2 class="text-xl font-bold">Cancel Order</h2>
          </div>
          <button
            @click="closeCancelModal"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <div>
            <p class="text-sm text-[#959190] mb-2">Cancelling Order</p>
            <div class="px-4 py-3 bg-red-50 rounded-xl border border-red-200">
              <p class="font-bold text-[#171413]">#{{ orderNumber }}</p>
            </div>
          </div>

          <div
            class="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
          >
            <i class="fa-solid fa-triangle-exclamation text-xl flex-shrink-0 text-red-700"></i>
            <p class="text-sm text-red-800">
              <strong>Important:</strong> This action cannot be undone
            </p>
          </div>

          <div>
            <p
              class="text-sm font-bold text-[#171413] uppercase tracking-widest mb-4"
            >
              Why are you cancelling?
            </p>
            <div class="space-y-3">
              <div
                v-for="reason in cancellationReasons"
                :key="reason"
                class="cursor-pointer"
              >
                <input
                  type="radio"
                  :id="`reason-${reason}`"
                  :value="reason"
                  v-model="selectedReason"
                  class="hidden peer"
                />
                <label
                  :for="`reason-${reason}`"
                  class="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 cursor-pointer transition-all peer-checked:border-[#DC2626] peer-checked:bg-red-50"
                >
                  <div
                    class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-[#DC2626] peer-checked:bg-[#DC2626]"
                  >
                    <span
                      v-if="selectedReason === reason"
                      class="w-2 h-2 bg-white rounded-full"
                    ></span>
                  </div>
                  <span class="text-sm font-medium text-[#171413]">{{
                    reason
                  }}</span>
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  id="reason-other"
                  value="Other"
                  v-model="selectedReason"
                  class="hidden peer"
                />
                <label
                  for="reason-other"
                  class="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 cursor-pointer transition-all peer-checked:border-[#DC2626] peer-checked:bg-red-50"
                >
                  <div
                    class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-[#DC2626] peer-checked:bg-[#DC2626]"
                  >
                    <span
                      v-if="selectedReason === 'Other'"
                      class="w-2 h-2 bg-white rounded-full"
                    ></span>
                  </div>
                  <span class="text-sm font-medium text-[#171413]"
                    >Other reason</span
                  >
                </label>

                <textarea
                  v-if="selectedReason === 'Other'"
                  v-model="otherReason"
                  placeholder="Tell us why you're cancelling..."
                  rows="3"
                  class="w-full mt-3 border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#DC2626] focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              @click="closeCancelModal"
              class="flex-1 py-3 bg-gray-100 text-[#171413] rounded-xl hover:bg-gray-200 font-semibold transition-colors"
            >
              Keep Order
            </button>
            <button
              @click="confirmCancelOrder"
              :disabled="
                !selectedReason ||
                (selectedReason === 'Other' && !otherReason.trim()) ||
                isCancelling
              "
              class="flex-1 py-3 bg-gradient-to-r from-[#DC2626] to-[#DC2626] text-white rounded-xl  font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="!isCancelling">
                <i class="fa-solid fa-ban"></i>
              </span>
              <span>{{ isCancelling ? "Cancelling..." : "Cancel Order" }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { trackOrderPublic, cancelUserOrder } from "@/services/api.js";
import { useToast } from "@/composables/useToast";

const route = useRoute();
const router = useRouter();
const { addToast, showError, showSuccess, showWarning } = useToast();

const orderNumber = computed(() => route.params.id);
const loading = ref(false);
const error = ref(null);
const currentStatus = ref("");
const pickupNotes = ref("");
const photoUrl = ref("");

// Cancellation state
const showCancelModal = ref(false);
const selectedReason = ref("");
const otherReason = ref("");
const isCancelling = ref(false);

const cancellationReasons = [
  "I placed a duplicate order.",
  "I changed my mind/no longer need the service.",
  "Order details or services were incorrect.",
];

// Define the step flow
const steps = [
  "Booked",
  "Picked Up",
  "In Cleaning",
  "Ready",
  "Out For Delivery",
  "Delivered",
];

const currentStepIndex = computed(() => {
  const idx = steps.indexOf(currentStatus.value);
  return idx >= 0 ? idx : 0;
});

const orderData = ref(null);

// Fetch order status
async function fetchOrderStatus() {
  if (!orderNumber.value) return;
  loading.value = true;
  error.value = null;

  try {
    const res = await trackOrderPublic(orderNumber.value);
    console.log("📦 Live tracking response:", res);

    if (!res) throw new Error("Empty response from server");

    currentStatus.value = res.status || "Booked";
    pickupNotes.value = res.notes || "";
    photoUrl.value = res.photoUrl || "";
    orderData.value = res;
  } catch (err) {
    console.error("❌ Track order failed:", err);
    error.value = err.message || "Failed to fetch tracking info.";
    addToast({ type: "error", message: error.value });
  } finally {
    loading.value = false;
  }
}

// Polling
let pollInterval = null;

onMounted(() => {
  fetchOrderStatus();
  pollInterval = setInterval(fetchOrderStatus, 20000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});

// Navigation
function goBack() {
  router.back();
}

// Cancellation functions
function openCancelModal() {
  if (currentStepIndex.value < 2) {
    showCancelModal.value = true;
  } else {
    addToast({
      type: "warning",
      message: "This order is too far in processing to be cancelled.",
    });
  }
}

function closeCancelModal() {
  showCancelModal.value = false;
  selectedReason.value = "";
  otherReason.value = "";
}

async function confirmCancelOrder() {
  if (!orderData.value || !orderData.value.orderId) {
    addToast({
      type: "error",
      message: "Cannot find valid Order ID for cancellation.",
    });
    return;
  }

  let reasonMessage = selectedReason.value;
  if (selectedReason.value === "Other") {
    if (!otherReason.value.trim()) {
      addToast({
        type: "warning",
        message: "Please specify your reason in the 'Other' field.",
      });
      return;
    }
    reasonMessage = `Other: ${otherReason.value.trim()}`;
  }

  isCancelling.value = true;
  const idToUse = orderData.value.orderId;

  try {
    await cancelUserOrder(idToUse, { reason: reasonMessage });

    currentStatus.value = "Cancelled";
    showSuccess(`Order #${idToUse} has been successfully cancelled.`);

    router.push({ name: "orderHistory" });
  } catch (err) {
    console.error("❌ Cancellation failed:", err);
    showError(err.message || "Failed to cancel order. Please try again.");
  } finally {
    isCancelling.value = false;
    closeCancelModal();
  }
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
