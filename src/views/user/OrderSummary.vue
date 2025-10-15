<template>
  <div class="p-4 sm:p-6 lg:p-10 min-h-screen">
    <h1 class="text-3xl font-font-display font-bold mb-6 text-navy-blue">
      Review & Checkout
    </h1>

    <div class="grid md:grid-cols-3 gap-6">
      <!-- LEFT SIDE -->
      <div class="md:col-span-2 space-y-6">
        <!-- ITEMS -->
        <div class="p-6 rounded-lg bg-red-900/10 border border-golden-brown/30">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-charcoal">
              Selected Items ({{ totalItemCount }} Items)
            </h2>
            <button
              @click="router.push({ name: 'BookPickup' })"
              class="text-sm text-golden-brown hover:underline font-extrabold cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div
            v-for="item in orderPayload.items"
            :key="item.serviceCode"
            class="flex justify-between py-2 border-b border-input last:border-b-0"
          >
            <div>
              <span class="text-navy-blue font-medium">
                {{ item.serviceName }}
              </span>
              <span class="text-xs text-charcoal/70 ml-2">
                [{{ item.serviceCode }}]
              </span>
              <span class="text-xs text-charcoal/70 ml-2">
                ({{ orderPayload.pricingModel }})
              </span>
            </div>
            <span class="text-charcoal">
              {{ item.quantity }} × ₦{{ item.price?.toLocaleString() }}
            </span>
          </div>

          <p class="mt-4 font-bold text-lg text-navy-blue flex justify-between">
            <span>Subtotal (Estimated):</span>
            <span>₦{{ subtotal.toLocaleString() }}</span>
          </p>
          <p class="text-xs text-charcoal/70 mt-1">
            * Price excludes express charges and final adjustments.
          </p>
        </div>

        <!-- PICKUP & DELIVERY -->
        <div class="p-6 rounded-lg bg-red-900/10 border border-golden-brown/30">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-charcoal">
              Pickup & Delivery
            </h2>
            <button
              @click="router.push({ name: 'PickupDelivery' })"
              class="text-sm text-golden-brown hover:underline font-extrabold cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div class="space-y-5">
            <div class="flex items-start">
              <i class="fas fa-box-open text-golden-brown w-5 mt-1"></i>
              <div class="ml-3">
                <p class="font-semibold text-charcoal">Pickup</p>
                <p class="text-sm text-charcoal/80">
                  {{ orderPayload.pickup?.date }} ({{
                    orderPayload.pickup?.window
                  }})
                </p>
                <p class="text-sm text-charcoal/60">
                  {{ orderPayload.pickup?.address?.line1 }},
                  {{ orderPayload.pickup?.address?.city }},
                  {{ orderPayload.pickup?.address?.state }}
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <i class="fas fa-truck text-golden-brown w-5 mt-1"></i>
              <div class="ml-3">
                <p class="font-semibold text-charcoal">Delivery</p>
                <p class="text-sm text-charcoal/80">
                  {{ orderPayload.delivery?.date }} ({{
                    orderPayload.delivery?.window
                  }})
                </p>
                <p class="text-sm text-charcoal/60">
                  {{ orderPayload.delivery?.address?.line1 }},
                  {{ orderPayload.delivery?.address?.city }},
                  {{ orderPayload.delivery?.address?.state }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- COUPON + PHOTOS -->
        <div
          v-if="orderPayload.couponCode || orderPayload.photos?.length"
          class="p-6 rounded-lg bg-red-900/10 border border-golden-brown/30"
        >
          <h2
            class="text-xl font-semibold text-charcoal border-b border-golden-brown pb-2 mb-4"
          >
            Extras
          </h2>

          <div v-if="orderPayload.couponCode" class="mb-3">
            <p class="text-sm text-charcoal">
              <span class="font-semibold">Coupon:</span>
              <span class="text-golden-brown ml-1">
                {{ orderPayload.couponCode }}
              </span>
            </p>
          </div>

          <div v-if="orderPayload.photos?.length">
            <p class="text-sm font-semibold text-charcoal mb-2">
              Uploaded Photos:
            </p>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
              <img
                v-for="(file, i) in orderPayload.photos"
                :key="i"
                :src="
                  typeof file === 'string'
                    ? file
                    : win?.URL.createObjectURL(file)
                "
                class="h-24 w-full object-cover rounded-lg border border-golden-brown shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div class="md:col-span-1 sticky top-4 h-fit space-y-6">
        <div
          class="p-6 rounded-lg bg-charcoal border border-golden-brown/30 text-bone-white py-4"
        >
          <h2
            class="text-2xl font-bold border-b border-cream/50 pb-4 mb-4 flex items-center"
          >
            Final Cost
          </h2>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Item Subtotal:</span>
              <span>₦{{ subtotal.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery Fee:</span>
              <span>₦{{ deliveryFee.toLocaleString() }}</span>
            </div>
            <div
              v-if="orderPayload.couponCode"
              class="flex justify-between text-pure-gold font-bold"
            >
              <span>Coupon Discount:</span>
              <span>- ₦{{ discount.toLocaleString() }}</span>
            </div>
          </div>

          <div class="pt-3 border-t border-cream/50">
            <p class="flex justify-between font-bold text-lg text-pure-gold">
              <span>GRAND TOTAL:</span>
              <span>₦{{ finalTotal.toLocaleString() }}</span>
            </p>
          </div>

          <!-- PAYMENT METHOD -->
          <div class="space-y-4 mt-4">
            <CustomSelect
              v-model="orderPayload.payment.method"
              :options="paymentMethods"
              label="Payment Method"
              placeholder="Select a Payment Method"
              required
            />

            <CustomSelect
              v-if="orderPayload.payment.method"
              v-model="orderPayload.payment.gateway"
              :options="paymentGateways"
              label="Payment Gateway"
              placeholder="Select a Gateway"
              required
            />

            <CustomSelect
              v-if="orderPayload.payment.gateway"
              v-model="orderPayload.payment.mode"
              :options="paymentModes"
              label="Payment Mode"
              placeholder="Select a Mode"
              required
            />

            <p v-if="isPaymentInvalid" class="text-sm text-red-700 mt-2">
              Please complete all payment selections.
            </p>
          </div>

          <button
            @click="submitOrder"
            :disabled="finalTotal <= 0 || isSubmitting"
            class="mt-4 py-3 px-4 w-full rounded-lg font-bold transition-colors disabled:opacity-50 cursor-pointer"
            :class="[
              finalTotal > 0 && !isSubmitting
                ? 'bg-pure-gold text-navy-blue hover:bg-pure-gold/90'
                : 'bg-charcoal text-cream/70',
            ]"
          >
            <span v-if="isSubmitting">Submitting Order...</span>
            <span v-else>Place Order & Pay</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay when awaiting payment -->
    <div
      v-if="isAwaitingPayment"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-white"
    >
      <div class="flex flex-col items-center">
        <svg
          v-if="overlayState === 'waiting'"
          class="animate-spin h-10 w-10 text-pure-gold mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>

        <svg
          v-else-if="overlayState === 'success'"
          class="h-10 w-10 mb-4 text-pure-gold"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>

        <svg
          v-else-if="overlayState === 'failed'"
          class="h-10 w-10 mb-4 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-8a2 2 0 114 0 2 2 0 01-4 0z"
            clip-rule="evenodd"
          />
        </svg>

        <p class="text-lg font-semibold text-cream">
          {{ overlayMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useOrderItems } from "@/composables/useOrderItems";
import { useOrderStore } from "@/stores/useOrderStore";
import { authorizedFetch, previewOrder } from "@/services/api.js";
import CustomSelect from "@/components/atoms/CustomSelect.vue";
import { useUser } from "@/composables/useUser";

const { user, loadUser } = useUser();
const isAwaitingPayment = ref(false);
const win = typeof window !== "undefined" ? window : undefined;
const orderStore = useOrderStore();

const overlayMessage = ref("Waiting for payment confirmation...");
const overlayState = ref("waiting");
let pollingInterval = null;
let pollingTimeout = null;

const router = useRouter();
const { orderPayload, totalItemCount } = useOrderItems();
// --- DEFAULT PAYMENT SELECTIONS ---
if (!orderPayload.value.payment) {
  orderPayload.value.payment = {};
}

if (!orderPayload.value.payment.method) {
  orderPayload.value.payment.method = "BANK_TRANSFER";
}

if (!orderPayload.value.payment.gateway) {
  orderPayload.value.payment.gateway = "PAYSTACK";
}

if (!orderPayload.value.payment.mode) {
  orderPayload.value.payment.mode = "FULL";
}

const isSubmitting = ref(false);

const paymentMethods = [
  { label: "Debit/Credit Card", value: "CARD" },
  { label: "Bank Transfer", value: "BANK_TRANSFER" },
];
const paymentGateways = [
  { label: "Paystack", value: "PAYSTACK" },
  { label: "Monnify", value: "MONNIFY" },
];
const paymentModes = [
  { label: "Full Payment", value: "FULL" },
  { label: "Installment", value: "INSTALLMENT" },
];

// --- COMPUTED TOTALS (no service fee) ---
const subtotal = computed(() =>
  orderPayload.value.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )
);
// --- BACKEND TOTALS ---
const deliveryFee = ref(0);
const discount = ref(0);
const finalTotal = ref(0);

const fetchPreviewTotals = async () => {
  try {
    const payload = cleanPayload(orderPayload.value);
    console.log("📦 Sending preview payload:", payload);
    const previewData = await previewOrder(payload);

    console.log("📬 Received preview data:", previewData);
    if (previewData?.totals) {
      deliveryFee.value = previewData.totals.deliveryFee || 0;
      discount.value = previewData.totals.discount || 0;
      finalTotal.value = previewData.totals.grandTotal || 0;
    } else {
      console.warn("⚠️ Unexpected preview response:", previewData);
    }
  } catch (err) {
    console.error("❌ Failed to fetch order preview:", err);
  }
};

// Fetch preview totals whenever key parts of the payload change
watch(
  () => [
    orderPayload.value.items,
    orderPayload.value.pickup,
    orderPayload.value.delivery,
    orderPayload.value.couponCode,
  ],
  fetchPreviewTotals,
  { deep: true, immediate: true }
);
onMounted(fetchPreviewTotals);

const isPaymentInvalid = computed(() => {
  const payment = orderPayload.value.payment;
  return !payment.method || !payment.gateway || !payment.mode;
});

// --- CHECK SUBSCRIPTION ---
const canSubmit = async () => {
  if (orderPayload.value.pricingModel === "SUBSCRIPTION") {
    await loadUser();
    if (!user.value?.subscription?.active) {
      alert(
        "You cannot submit a subscription order without an active subscription."
      );
      return false;
    }
  }
  return true;
};

// --- CLEAN PAYLOAD ---
const cleanPayload = (payload) => {
  const copy = JSON.parse(JSON.stringify(payload));
  if (copy.pickup?.address) {
    if (!copy.pickup.address.landmark) delete copy.pickup.address.landmark;
    if (!copy.pickup.address.zone) delete copy.pickup.address.zone;
  }
  if (copy.delivery?.address) {
    if (!copy.delivery.address.landmark) delete copy.delivery.address.landmark;
    if (!copy.delivery.address.zone) delete copy.delivery.address.zone;
  }
  if (!copy.couponCode) delete copy.couponCode;
  return copy;
};

// --- POLLING ---
const pollOrderStatus = (orderId) => {
  if (pollingInterval) clearInterval(pollingInterval);
  if (pollingTimeout) clearTimeout(pollingTimeout);

  pollingTimeout = setTimeout(() => {
    if (pollingInterval) clearInterval(pollingInterval);
    overlayMessage.value = "Timed out waiting for payment confirmation.";
    overlayState.value = "failed";
    setTimeout(() => {
      isAwaitingPayment.value = false;
    }, 3000);
  }, 120000);

  pollingInterval = setInterval(async () => {
    try {
      const resp = await authorizedFetch(`api/orders/track/${orderId}`, {
        method: "GET",
      });
      const paymentStatus = resp?.order?.payment?.status;
      const orderStatus = resp?.order?.status;

      if (paymentStatus === "PAID" || orderStatus === "Booked") {
        clearInterval(pollingInterval);
        clearTimeout(pollingTimeout);
        overlayState.value = "success";
        overlayMessage.value = "Payment confirmed! Redirecting...";
        setTimeout(() => {
          isAwaitingPayment.value = false;
          orderStore.setOrder(orderId, resp.order);
          router.push({ name: "OrderSuccess", params: { orderId } });
        }, 1200);
      } else if (paymentStatus === "FAILED") {
        clearInterval(pollingInterval);
        clearTimeout(pollingTimeout);
        overlayState.value = "failed";
        overlayMessage.value = "❌ Payment failed. Please try again.";
        setTimeout(() => {
          isAwaitingPayment.value = false;
        }, 3000);
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  }, 4000);
};

// --- SUBMIT ORDER ---
// --- SUBMIT ORDER ---
const submitOrder = async () => {
  if (!(await canSubmit())) return;
  if (finalTotal.value <= 0 || isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    // ✅ Construct backend-compatible payload
    const payload = {
      items: orderPayload.value.items.map((item) => ({
        serviceCode: item.serviceCode,
        serviceName: item.serviceName,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        express: item.express || false,
        sameDay: item.sameDay || false,
        addOns: item.addOns || [],
      })),

      pricingModel: orderPayload.value.pricingModel || "RETAIL",
      serviceTier: orderPayload.value.serviceTier || "STANDARD",

      pickup: orderPayload.value.pickup,
      delivery: orderPayload.value.delivery,

      payment: {
        method: orderPayload.value.payment.method,
        mode: orderPayload.value.payment.mode,
        gateway: orderPayload.value.payment.gateway,
      },

      totals: {
        itemsTotal: subtotal.value,
        addOnsTotal: 0,
        deliveryFee: deliveryFee.value,
        discount: discount.value,
        grandTotal: finalTotal.value || subtotal.value,
      },

      photos:
        Array.isArray(orderPayload.value.photos) &&
        orderPayload.value.photos.length > 0
          ? orderPayload.value.photos.filter((p) => typeof p === "string")
          : [],
    };

    // Clean up payload (optional)
    const cleaned = cleanPayload(payload);
    console.log(
      "🟢 Payload sent to backend:",
      JSON.stringify(cleaned, null, 2)
    );

    // ✅ Send to backend
    const response = await authorizedFetch("api/orders", {
      method: "POST",
      body: JSON.stringify(cleaned),
    });

    console.log("🟢 Order response:", response);

    const orderId = response?.order?._id || response?.order?.id || response?.id;

    // ✅ Handle payment redirect or direct confirmation
    if (response?.order?.payment?.checkoutUrl) {
      isAwaitingPayment.value = true;
      overlayState.value = "waiting";
      overlayMessage.value = "Redirecting you to payment...";
      window.open(response.order.payment.checkoutUrl, "_blank");

      if (orderId) pollOrderStatus(orderId);
    } else {
      orderStore.setOrder(orderId, response.order);
      router.push({ name: "OrderSuccess", params: { orderId } });
    }
  } catch (err) {
    console.error("❌ Order submission failed:", err);
    overlayState.value = "failed";
    overlayMessage.value = `Order failed: ${err.message}`;
    isAwaitingPayment.value = true;

    setTimeout(() => {
      isAwaitingPayment.value = false;
    }, 4000);
  } finally {
    isSubmitting.value = false;
  }
};

watch(
  () => orderPayload.value.payment.method,
  (method) => {
    if (method) {
      orderPayload.value.payment.gateway = "PAYSTACK";
      orderPayload.value.payment.mode = "FULL";
    } else {
      orderPayload.value.payment.gateway = "";
      orderPayload.value.payment.mode = "";
    }
  }
);

onBeforeUnmount(() => {
  if (pollingInterval) clearInterval(pollingInterval);
  if (pollingTimeout) clearTimeout(pollingTimeout);
});
</script>
