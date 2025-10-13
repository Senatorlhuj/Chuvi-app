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
              @click="router.push({ name: 'ItemSelection' })"
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
              <span class="text-navy-blue font-medium">{{
                item.serviceName
              }}</span>
              <span class="text-xs text-charcoal/70 ml-2"
                >[{{ item.serviceCode }}]</span
              >
              <span class="text-xs text-charcoal/70 ml-2"
                >({{ orderPayload.pricingModel }})</span
              >
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
                  {{ orderPayload.pickup?.address?.city }} ,
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
                  {{ orderPayload.delivery?.address?.line1 }} ,
                  {{ orderPayload.delivery?.address?.city }} ,
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
              <span class="text-golden-brown ml-1">{{
                orderPayload.couponCode
              }}</span>
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
                  typeof file === 'string' ? file : URL.createObjectURL(file)
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
              <span>Service Fee (1%):</span>
              <span>₦{{ serviceFee.toLocaleString() }}</span>
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
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>

        <svg
          v-else-if="overlayState === 'failed'"
          class="h-10 w-10 mb-4 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-8a2 2 0 114 0 2 2 0 01-4 0z" clip-rule="evenodd" />
        </svg>

        <p class="text-lg font-semibold text-cream">
          {{ overlayMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useOrderItems } from "@/composables/useOrderItems";
import { authorizedFetch } from "@/services/api.js";
import CustomSelect from "@/components/atoms/CustomSelect.vue";
import { useUser } from "@/composables/useUser";

const { user, loadUser } = useUser();
const isAwaitingPayment = ref(false);
const overlayMessage = ref("Waiting for payment confirmation...");
const overlayState = ref("waiting"); // 'waiting' | 'success' | 'failed'
let pollingInterval = null;
let pollingTimeout = null;

const router = useRouter();
const { orderPayload, totalItemCount } = useOrderItems();
const isSubmitting = ref(false);

// --- PAYMENT OPTIONS ---
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

// --- COMPUTED TOTALS ---
const subtotal = computed(() =>
  orderPayload.value.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )
);
const deliveryFee = computed(() => (subtotal.value < 10000 ? 1000 : 0));
const serviceFee = computed(() => Math.round(subtotal.value * 0.01));
const discount = computed(() =>
  orderPayload.value.couponCode ? Math.round(subtotal.value * 0.1) : 0
);
const finalTotal = computed(() =>
  Math.max(
    0,
    subtotal.value + deliveryFee.value + serviceFee.value - discount.value
  )
);
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

// --- POLLING (uses api/orders/track/:orderId) ---
const pollOrderStatus = (orderId) => {
  // clear any previous
  if (pollingInterval) clearInterval(pollingInterval);
  if (pollingTimeout) clearTimeout(pollingTimeout);

  // stop polling after 120s (2 minutes)
  pollingTimeout = setTimeout(() => {
    if (pollingInterval) clearInterval(pollingInterval);
    overlayMessage.value = "Timed out waiting for payment confirmation. Please check your payment and try again.";
    overlayState.value = "failed";
    setTimeout(() => { isAwaitingPayment.value = false; }, 3000);
  }, 120000);

  pollingInterval = setInterval(async () => {
    try {
      // use the correct endpoint as you confirmed
      const resp = await authorizedFetch(`api/orders/track/${orderId}`, {
        method: "GET",
      });

      console.log("Polling response:", resp);
      const paymentStatus = resp?.order?.payment?.status;
      const orderStatus = resp?.order?.status;

      // success conditions (backend sets payment.status = "PAID" on webhook)
      if (paymentStatus === "PAID" || orderStatus === "Booked") {
        clearInterval(pollingInterval);
        clearTimeout(pollingTimeout);
        overlayState.value = "success";
        overlayMessage.value = "✅ Payment confirmed! Redirecting...";
        setTimeout(() => {
          isAwaitingPayment.value = false;
          router.push({ name: "OrderConfirmation", params: { id: orderId } });
        }, 1200);
        return;
      }

      // failure conditions
      if (paymentStatus === "FAILED" || orderStatus === "Pending") {
        clearInterval(pollingInterval);
        clearTimeout(pollingTimeout);
        overlayState.value = "failed";
        overlayMessage.value = "❌ Payment failed. Please try again.";
        setTimeout(() => {
          isAwaitingPayment.value = false;
        }, 3000);
        return;
      }
    } catch (err) {
      // log full error for easier debugging
      console.error("Polling error:", err);
    }
  }, 4000);
};

// --- SUBMIT ORDER ---
const submitOrder = async () => {
  if (!(await canSubmit())) return;
  if (finalTotal.value <= 0 || isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    let payload = {
      ...orderPayload.value,
      finalTotal: finalTotal.value,
      subtotal: subtotal.value,
      deliveryFee: deliveryFee.value,
      serviceFee: serviceFee.value,
      discount: discount.value,
      payment: { ...orderPayload.value.payment },
    };

    payload = cleanPayload(payload);

    console.log("Payload sent to backend:", JSON.stringify(payload, null, 2));

    const response = await authorizedFetch("api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    console.log("Order creation response:", response);

    const orderId = response?.order?._id || response?.order?.id || response?.id;

    // if backend returned checkout url -> open in new tab and poll using /api/orders/track/:orderId
    if (response?.order?.payment?.checkoutUrl) {
      isAwaitingPayment.value = true;
      overlayState.value = "waiting";
      overlayMessage.value = "Redirecting you to payment...";

      // open payment in a new tab
      window.open(response.order.payment.checkoutUrl, "_blank");

      // start polling using the confirmed endpoint
      if (orderId) pollOrderStatus(orderId);
      else {
        console.warn("No orderId returned — cannot poll. Hiding overlay in 3s.");
        setTimeout(() => { isAwaitingPayment.value = false; }, 3000);
      }
    } else {
      // fallback: if backend didn't return checkoutUrl, navigate directly (create may already mark paid)
      router.push({
        name: "OrderConfirmation",
        params: { id: orderId },
      });
    }
  } catch (err) {
    console.error("Order submission failed:", err);
    // attempt to show friendly message returned from server (if any)
    if (err.message) {
      overlayState.value = "failed";
      overlayMessage.value = `Order failed: ${err.message}`;
      isAwaitingPayment.value = true;
      setTimeout(() => { isAwaitingPayment.value = false; }, 4000);
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Auto-set gateway/mode when method changes
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
