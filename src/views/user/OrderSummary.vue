<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="border-b border-slate-200/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="flex items-center gap-2 text-golden-brown hover:text-charcoal font-medium transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-100"
          >
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>
          <h1 class="text-2xl sm:text-3xl font-bold text-charcoal">
            Review & Checkout
          </h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Column - Order Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Items Section -->
          <section
            class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="bg-gradient-to-r from-red-900/5 to-golden-brown/5 border-b border-slate-200 p-6 flex justify-between items-center"
            >
              <div>
                <h2 class="text-xl font-bold text-charcoal">Order Items</h2>
                <p class="text-sm text-charcoal/70 mt-1">
                  {{ totalItemCount }} service(s) selected
                </p>
              </div>
              <button
                @click="router.push({ name: 'BookPickup' })"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-golden-brown/50 text-golden-brown hover:bg-golden-brown/5 font-semibold transition-colors"
              >
                <i class="fas fa-edit text-sm"></i>
                <span>Edit</span>
              </button>
            </div>

            <div class="p-6 space-y-3">
              <div
                v-for="item in orderPayload.items"
                :key="item.serviceCode"
                class="flex justify-between items-start p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-lg border border-slate-100 hover:border-golden-brown/30 transition-colors"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 class="font-semibold text-charcoal">
                      {{ item.serviceName }}
                    </h3>
                    <span
                      class="text-xs font-mono bg-slate-100 text-charcoal/70 px-2 py-1 rounded"
                      >[{{ item.serviceCode }}]</span
                    >
                    <span
                      v-if="item.express"
                      class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold"
                    >
                      EXPRESS
                    </span>
                    <span
                      v-if="item.sameDay"
                      class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-semibold"
                    >
                      SAME DAY
                    </span>
                  </div>
                  <p class="text-sm text-charcoal/60 mb-1">
                    {{ orderPayload.pricingModel }} Pricing •
                    {{ item.quantity }} {{ item.unit }}
                  </p>
                  <p
                    v-if="item.itemNotes"
                    class="text-xs text-charcoal/50 italic"
                  >
                    Notes: {{ item.itemNotes }}
                  </p>
                  <div v-if="item.addOns?.length" class="mt-2 space-y-1">
                    <p class="text-xs text-charcoal/60 font-semibold">
                      Add-ons:
                    </p>
                    <div
                      v-for="addOn in item.addOns"
                      :key="addOn.key"
                      class="text-xs text-charcoal/50"
                    >
                      + {{ addOn.name }}: ₦{{ addOn.price?.toLocaleString() }}
                    </div>
                  </div>
                </div>
                <div class="text-right ml-4">
                  <p class="font-semibold text-charcoal">
                    ₦{{ calculateItemTotal(item).toLocaleString() }}
                  </p>
                  <p class="text-xs text-charcoal/60 mt-1">
                    {{ item.quantity }} × ₦{{ item.price?.toLocaleString() }}
                  </p>
                  <p
                    v-if="calculateAddOnsTotal(item) > 0"
                    class="text-xs text-green-600 mt-1"
                  >
                    +₦{{ calculateAddOnsTotal(item).toLocaleString() }} add-ons
                  </p>
                </div>
              </div>

              <div class="border-t-2 border-dashed border-slate-200 pt-4 mt-4">
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-charcoal"
                    >Estimated Subtotal</span
                  >
                  <span class="text-xl font-bold text-charcoal"
                    >₦{{ estimatedSubtotal.toLocaleString() }}</span
                  >
                </div>
                <p class="text-xs text-charcoal/60 mt-2">
                  * Final pricing calculated by backend including delivery,
                  discounts, and service fees
                </p>
              </div>
            </div>
          </section>

          <!-- Pickup & Delivery Section -->
          <section
            class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <div
              class="bg-gradient-to-r from-red-900/5 to-golden-brown/5 border-b border-slate-200 p-6 flex justify-between items-center"
            >
              <h2 class="text-xl font-bold text-charcoal">Logistics</h2>
              <button
                @click="router.push({ name: 'PickupDelivery' })"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-golden-brown/50 text-golden-brown hover:bg-golden-brown/5 font-semibold transition-colors"
              >
                <i class="fas fa-edit text-sm"></i>
                <span>Edit</span>
              </button>
            </div>

            <div class="p-6 space-y-6">
              <!-- Pickup -->
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div
                    class="flex items-center justify-center h-12 w-12 rounded-xl bg-golden-brown/10 text-golden-brown"
                  >
                    <i class="fas fa-box-open text-lg"></i>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-charcoal mb-1">Pickup</h3>
                  <p class="text-sm font-semibold text-charcoal">
                    {{ formatDate(orderPayload.pickup?.date) }} ({{
                      orderPayload.pickup?.window
                    }})
                  </p>
                  <p class="text-sm text-charcoal/70 mt-1 break-words">
                    {{ orderPayload.pickup?.address?.line1 }},
                    {{ orderPayload.pickup?.address?.city }},
                    {{ orderPayload.pickup?.address?.state }}
                  </p>
                  <p
                    v-if="orderPayload.pickup?.address?.zone"
                    class="text-xs text-charcoal/50 mt-1"
                  >
                    Zone: {{ orderPayload.pickup?.address?.zone }}
                  </p>
                </div>
              </div>

              <div
                class="h-1 bg-gradient-to-r from-golden-brown/20 to-transparent rounded-full"
              ></div>

              <!-- Delivery -->
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div
                    class="flex items-center justify-center h-12 w-12 rounded-xl bg-golden-brown/10 text-golden-brown"
                  >
                    <i class="fas fa-truck text-lg"></i>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-charcoal mb-1">Delivery</h3>
                  <p class="text-sm font-semibold text-charcoal">
                    {{ formatDate(orderPayload.delivery?.date) }} ({{
                      orderPayload.delivery?.window
                    }})
                  </p>
                  <p class="text-sm text-charcoal/70 mt-1 break-words">
                    {{ orderPayload.delivery?.address?.line1 }},
                    {{ orderPayload.delivery?.address?.city }},
                    {{ orderPayload.delivery?.address?.state }}
                  </p>
                  <p
                    v-if="orderPayload.delivery?.address?.zone"
                    class="text-xs text-charcoal/50 mt-1"
                  >
                    Zone: {{ orderPayload.delivery?.address?.zone }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Service Info Section -->
          <section
            class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <div
              class="bg-gradient-to-r from-red-900/5 to-golden-brown/5 border-b border-slate-200 p-6"
            >
              <h2 class="text-xl font-bold text-charcoal">Service Details</h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-charcoal"
                  >Pricing Model</span
                >
                <span class="text-sm font-semibold text-golden-brown">
                  {{ orderPayload.pricingModel || "RETAIL" }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-charcoal"
                  >Service Tier</span
                >
                <span class="text-sm font-semibold text-golden-brown">
                  {{ orderPayload.serviceTier || "STANDARD" }}
                </span>
              </div>
              <div
                v-if="orderPayload.pricingModel === 'SUBSCRIPTION'"
                class="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p class="text-sm text-blue-700">
                  <i class="fas fa-info-circle mr-1"></i>
                  Subscription pricing applied. Monthly limits and benefits will
                  be calculated.
                </p>
              </div>
            </div>
          </section>

          <!-- Extras Section -->
          <section
            v-if="orderPayload.couponCode || orderPayload.photos?.length"
            class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <div
              class="bg-gradient-to-r from-red-900/5 to-golden-brown/5 border-b border-slate-200 p-6"
            >
              <h2 class="text-xl font-bold text-charcoal">Additional Info</h2>
            </div>

            <div class="p-6 space-y-4">
              <!-- Coupon -->
              <div
                v-if="orderPayload.couponCode"
                class="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-transparent border border-green-200 rounded-lg"
              >
                <span class="text-sm font-medium text-charcoal"
                  >Coupon Applied</span
                >
                <span
                  class="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full"
                  >{{ orderPayload.couponCode }}</span
                >
              </div>

              <!-- Photos -->
              <div v-if="orderPayload.photos?.length">
                <h3 class="text-sm font-semibold text-charcoal mb-3">
                  Uploaded Photos
                </h3>
                <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <div
                    v-for="(file, i) in orderPayload.photos"
                    :key="i"
                    class="relative group"
                  >
                    <img
                      :src="
                        typeof file === 'string'
                          ? file
                          : win?.URL.createObjectURL(file)
                      "
                      class="h-24 w-full object-cover rounded-lg border border-golden-brown/30 shadow-sm group-hover:shadow-md transition-shadow"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column - Summary & Payment -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-6">
            <!-- Cost Summary Card -->
            <div
              class="bg-gradient-to-br from-charcoal to-charcoal/95 rounded-2xl border border-golden-brown/30 p-6 text-bone-white shadow-lg"
            >
              <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
                <span class="text-3xl">💰</span>
                <span>Final Cost</span>
              </h3>

              <div
                v-if="isPreviewLoading"
                class="text-sm text-cream/70 italic py-8"
              >
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Loading your order preview...
              </div>
              <div
                v-else-if="previewError"
                class="text-sm text-red-400 italic py-8"
              >
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ previewError }}
              </div>

              <div v-else class="space-y-4">
                <!-- Estimated Breakdown -->
                <div class="space-y-3 mb-4">
                  <div class="flex justify-between text-sm">
                    <span class="text-cream/80">Items Subtotal</span>
                    <span class="font-semibold"
                      >₦{{ estimatedSubtotal.toLocaleString() }}</span
                    >
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-cream/80">Add-ons Total</span>
                    <span class="font-semibold"
                      >₦{{ estimatedAddOnsTotal.toLocaleString() }}</span
                    >
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-cream/80">Estimated Delivery</span>
                    <span class="font-semibold"
                      >₦{{ deliveryFee.toLocaleString() }}</span
                    >
                  </div>
                  <div
                    v-if="discount > 0"
                    class="flex justify-between text-sm text-pure-gold font-semibold"
                  >
                    <span>Estimated Discount</span>
                    <span>- ₦{{ discount.toLocaleString() }}</span>
                  </div>
                </div>

                <div class="border-t border-cream/30 pt-4 mb-6">
                  <div class="flex justify-between items-center">
                    <span class="text-cream/80">Final Total</span>
                    <span class="text-3xl font-bold text-pure-gold"
                      >₦{{ finalTotal.toLocaleString() }}</span
                    >
                  </div>
                  <p class="text-xs text-cream/60 mt-2 text-center">
                    * Final amount confirmed in preview
                  </p>
                </div>

                <!-- Preview Button -->
                <button
                  @click="fetchPreviewAndShow"
                  :disabled="isPreviewLoading"
                  class="w-full py-3 px-4 rounded-lg bg-pure-gold text-bone-white font-semibold hover:bg-golden-brown/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm border border-golden-brown/30"
                >
                  <i
                    v-if="isPreviewLoading"
                    class="fas fa-spinner fa-spin mr-2"
                  ></i>
                  <span v-if="isPreviewLoading">Loading Preview...</span>
                  <span v-else>
                    <i class="fas fa-calculator mr-2"></i>
                    Get Final Pricing
                  </span>
                </button>
              </div>

              <!-- Payment Options -->
              <div class="space-y-4 mt-6 pt-6 border-t border-cream/30">
                <!-- Payment Method -->
                <div>
                  <label
                    class="text-xs font-semibold text-cream/70 uppercase tracking-wide"
                    >Payment Method</label
                  >
                  <CustomSelect
                    v-model="orderPayload.payment.method"
                    :options="paymentMethods"
                    placeholder="Select a Payment Method"
                    class="mt-2"
                  />
                </div>

                <!-- Payment Gateway -->
                <div>
                  <label
                    class="text-xs font-semibold text-cream/70 uppercase tracking-wide"
                    >Payment Gateway</label
                  >
                  <CustomSelect
                    v-if="orderPayload.payment.method"
                    v-model="orderPayload.payment.gateway"
                    :options="paymentGateways"
                    placeholder="Select a Gateway"
                    class="mt-2"
                  />
                </div>

                <!-- Payment Mode -->
                <div>
                  <label
                    class="text-xs font-semibold text-cream/70 uppercase tracking-wide"
                    >Payment Mode</label
                  >
                  <CustomSelect
                    v-if="orderPayload.payment.gateway"
                    v-model="orderPayload.payment.mode"
                    :options="paymentModes"
                    placeholder="Select a Mode"
                    class="mt-2"
                  />

                  <!-- Installment Info (Fixed 70/30 split) -->
                  <div
                    v-if="orderPayload.payment.mode === 'INSTALLMENT'"
                    class="text-xs text-pure-gold mt-2 bg-golden-brown/10 p-2 rounded-lg"
                  >
                    <i class="fas fa-info-circle mr-1"></i>
                    Installment plan: 70% upfront, 30% on delivery
                  </div>
                </div>

                <p v-if="isPaymentInvalid" class="text-xs text-red-400 mt-2">
                  <i class="fas fa-exclamation-circle mr-1"></i>
                  Please complete all payment selections
                </p>
              </div>
            </div>

            <!-- CTA Button -->
            <button
              @click="submitOrder"
              :disabled="
                finalTotal <= 0 ||
                isSubmitting ||
                isPaymentInvalid ||
                !canPlaceOrder
              "
              class="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              :class="[
                finalTotal > 0 &&
                !isSubmitting &&
                !isPaymentInvalid &&
                canPlaceOrder
                  ? 'bg-gradient-to-r from-pure-gold to-golden-brown text-charcoal hover:shadow-gold/50'
                  : 'bg-charcoal/50 text-cream/70',
              ]"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              <span v-if="isSubmitting">Submitting Order...</span>
              <span v-else>Place Order & Pay</span>
            </button>

            <!-- Validation Messages -->
            <div
              v-if="!canPlaceOrder"
              class="p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p class="text-xs text-red-700">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                Please complete all required fields: addresses, dates, and
                payment information
              </p>
            </div>

            <!-- Trust Badge -->
            <div
              class="p-3 bg-white border border-slate-200 rounded-lg text-center"
            >
              <p class="text-xs text-charcoal/70">
                ✓ Secure payment • No spam • Instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Preview Modal -->
    <div
      v-if="showPreviewModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showPreviewModal = false"
    >
      <div
        class="bg-bone-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div
          class="sticky top-0 bg-bone-white to-golden-brown/5 border-b border-slate-200 z-40 p-6 flex justify-between items-center"
        >
          <h2 class="text-2xl font-bold text-charcoal">Final Order Summary</h2>
          <button
            @click="showPreviewModal = false"
            class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <i class="fas fa-times text-xl text-charcoal"></i>
          </button>
        </div>

        <div v-if="previewDetails" class="p-6 space-y-6">
          <!-- Service Info -->
          <div class="bg-slate-50 rounded-lg p-4">
            <h3 class="font-semibold text-charcoal mb-2">Service Details</h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-charcoal/60">Pricing Model:</span>
                <span class="font-semibold ml-1">{{
                  previewDetails.meta.pricingModel
                }}</span>
              </div>
              <div>
                <span class="text-charcoal/60">First Order:</span>
                <span class="font-semibold ml-1">{{
                  previewDetails.meta.isFirstOrder ? "Yes" : "No"
                }}</span>
              </div>
            </div>
          </div>

          <!-- Final Totals -->
          <div class="space-y-3">
            <h3 class="font-semibold text-charcoal mb-3">
              Final Pricing Breakdown
            </h3>

            <div class="flex justify-between text-charcoal">
              <span>Items Total</span>
              <span class="font-semibold"
                >₦{{
                  (previewDetails.totals.itemsTotal || 0).toLocaleString()
                }}</span
              >
            </div>

            <div class="flex justify-between text-charcoal">
              <span>Add-ons Total</span>
              <span class="font-semibold"
                >₦{{
                  (previewDetails.totals.addOnsTotal || 0).toLocaleString()
                }}</span
              >
            </div>

            <div class="flex justify-between text-charcoal">
              <span>Delivery Fee</span>
              <span class="font-semibold"
                >₦{{
                  (previewDetails.totals.deliveryFee || 0).toLocaleString()
                }}</span
              >
            </div>

            <div
              v-if="previewDetails.totals.discount > 0"
              class="flex justify-between text-charcoal"
            >
              <span>Discount</span>
              <span class="font-semibold text-green-600"
                >- ₦{{
                  (previewDetails.totals.discount || 0).toLocaleString()
                }}</span
              >
            </div>

            <div class="border-t border-slate-200 pt-3 mt-2">
              <div class="flex justify-between text-lg font-bold">
                <span>Grand Total</span>
                <span class="text-pure-gold"
                  >₦{{
                    (previewDetails.totals.grandTotal || 0).toLocaleString()
                  }}</span
                >
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-700">
              <i class="fas fa-info-circle mr-1"></i>
              This is the final amount that will be charged. Includes all
              service fees, delivery costs, and applicable discounts.
            </p>
          </div>
        </div>
        <!-- This closing div was missing -->

        <div v-else class="p-6 text-center text-charcoal/70">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading final pricing
          details...
        </div>

        <!-- Modal Footer -->
        <div
          class="sticky bottom-0 bg-bone-white border-t border-slate-200 p-6"
        >
          <button
            @click="showPreviewModal = false"
            class="w-full py-3 px-4 bg-golden-brown text-bone-white font-semibold rounded-lg hover:bg-golden-brown/90 transition-colors"
          >
            Continue with Order
          </button>
        </div>
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

const showPreviewModal = ref(false);
const previewDetails = ref(null);

const overlayMessage = ref("Waiting for payment confirmation...");
const overlayState = ref("waiting");
const isPreviewLoading = ref(false);
const previewError = ref("");
let pollingInterval = null;
let pollingTimeout = null;

const router = useRouter();
const { orderPayload, totalItemCount } = useOrderItems();

// Initialize payment object with defaults
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

// Calculate item total including add-ons
const calculateItemTotal = (item) => {
  const baseTotal = item.quantity * item.price;
  const addOnsTotal = calculateAddOnsTotal(item);
  return baseTotal + addOnsTotal;
};

// Calculate add-ons total for an item
const calculateAddOnsTotal = (item) => {
  if (!item.addOns || !item.addOns.length) return 0;
  return item.addOns.reduce((sum, addOn) => sum + (addOn.price || 0), 0);
};

// Calculate estimated subtotal (frontend only - for display)
const estimatedSubtotal = computed(() =>
  orderPayload.value.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )
);

// Calculate estimated add-ons total (frontend only - for display)
const estimatedAddOnsTotal = computed(() =>
  orderPayload.value.items.reduce(
    (sum, item) => sum + calculateAddOnsTotal(item),
    0
  )
);

// These will be updated from backend preview
const deliveryFee = ref(0);
const discount = ref(0);
const finalTotal = ref(0);
const itemsTotal = ref(0)

// Enhanced validation computed property
const canPlaceOrder = computed(() => {
  const hasItems = orderPayload.value.items?.length > 0;
  const hasPickupAddress = orderPayload.value.pickup?.address?.line1;
  const hasDeliveryAddress = orderPayload.value.delivery?.address?.line1;
  const hasPickupDate = orderPayload.value.pickup?.date;
  const hasDeliveryDate = orderPayload.value.delivery?.date;
  const hasPaymentMethod = orderPayload.value.payment?.method;
  const hasPaymentGateway = orderPayload.value.payment?.gateway;
  const hasPaymentMode = orderPayload.value.payment?.mode;

  return (
    hasItems &&
    hasPickupAddress &&
    hasDeliveryAddress &&
    hasPickupDate &&
    hasDeliveryDate &&
    hasPaymentMethod &&
    hasPaymentGateway &&
    hasPaymentMode
  );
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fetchPreviewTotals = async () => {
  isPreviewLoading.value = true;
  previewError.value = "";
  previewDetails.value = null;

  try {
    const payload = cleanPayload(orderPayload.value);
    console.log("📦 Sending preview payload:", payload);
    const previewData = await previewOrder(payload);

    console.log("📬 Received preview data:", previewData);

    if (previewData?.totals) {
      previewDetails.value = previewData;
      deliveryFee.value = previewData.totals.deliveryFee || 0;
      discount.value = previewData.totals.discount || 0;
      finalTotal.value = previewData.totals.grandTotal || 0;
    } else {
      console.warn("⚠️ Unexpected preview response:", previewData);
      previewError.value = "Unexpected response from server.";
    }
  } catch (err) {
    console.error("❌ Failed to fetch order preview:", err);
    previewError.value =
      "Failed to load order preview. Please check network/backend.";
  } finally {
    isPreviewLoading.value = false;
  }
};

const fetchPreviewAndShow = async () => {
  isPreviewLoading.value = true;
  previewError.value = "";
  previewDetails.value = null;

  try {
    const payload = cleanPayload(orderPayload.value);
    console.log("📦 Sending preview payload:", payload);

    const data = await previewOrder(payload);
    console.log("📬 Received preview data:", data);

    if (data?.success && data?.totals) {
      previewDetails.value = data;
      showPreviewModal.value = true;

      // Update the main display with backend-calculated values
      deliveryFee.value = data.totals.deliveryFee || 0;
      discount.value = data.totals.discount || 0;
      finalTotal.value = data.totals.grandTotal || 0;
    } else {
      previewError.value = "Unexpected response from server.";
    }
  } catch (err) {
    console.error("❌ Failed to load preview:", err);
    previewError.value = "Failed to fetch preview. Please try again.";
  } finally {
    isPreviewLoading.value = false;
  }
};

const openPreviewModal = () => {
  if (previewDetails.value) {
    showPreviewModal.value = true;
  } else if (previewError.value) {
    alert("Cannot show breakdown: " + previewError.value);
  } else {
    fetchPreviewTotals().then(() => {
      if (previewDetails.value) {
        showPreviewModal.value = true;
      }
    });
  }
};

onMounted(fetchPreviewTotals);

const isPaymentInvalid = computed(() => {
  const payment = orderPayload.value.payment;
  return !payment.method || !payment.gateway || !payment.mode;
});

const canSubmit = async () => {
  // Validate user phone (required by backend)
  if (!user.value?.phone) {
    alert(
      "User phone number is required for order creation. Please update your profile."
    );
    return false;
  }

  // Validate subscription status for subscription orders
  if (orderPayload.value.pricingModel === "SUBSCRIPTION") {
    await loadUser();
    if (user.value?.currentSubscription?.status !== "ACTIVE") {
      alert(
        "You cannot submit a subscription order without an active subscription."
      );
      return false;
    }
  }

  return true;
};

const cleanPayload = (payload) => {
  const copy = JSON.parse(JSON.stringify(payload));

  // Remove empty optional fields
  if (!copy.notes || copy.notes.trim() === "") delete copy.notes;
  if (!copy.couponCode || copy.couponCode.trim() === "") delete copy.couponCode;

  // Clean photos array - keep only uploaded URLs
  if (copy.photos) {
    copy.photos = copy.photos.filter(
      (p) => typeof p === "string" && p.startsWith("http")
    );
    if (copy.photos.length === 0) delete copy.photos;
  }

  // Clean address objects
  ["pickup", "delivery"].forEach((key) => {
    if (copy[key]?.address) {
      const addr = copy[key].address;
      // Remove empty address fields
      Object.keys(addr).forEach((field) => {
        if (!addr[field] && addr[field] !== 0) delete addr[field];
      });
    }
  });

  // Remove any totals that might be present
  if (copy.totals) delete copy.totals;

  return copy;
};

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

      const orderStatus = resp?.status;

      if (
        orderStatus === "Booked" ||
        orderStatus === "Picked Up" ||
        orderStatus === "In Cleaning"
      ) {
        clearInterval(pollingInterval);
        clearTimeout(pollingTimeout);
        overlayState.value = "success";
        overlayMessage.value = "Order confirmed! Redirecting...";
        setTimeout(() => {
          isAwaitingPayment.value = false;
          orderStore.setOrder(orderId, resp);
          router.push({ name: "OrderSuccess", params: { orderId } });
        }, 1200);
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  }, 4000);
};

const submitOrder = async () => {
  if (!(await canSubmit())) return;
  if (
    finalTotal.value <= 0 ||
    isSubmitting.value ||
    isPaymentInvalid.value ||
    !canPlaceOrder.value
  )
    return;

  try {
    isSubmitting.value = true;

    const totalAmount =
      previewDetails.value?.totals?.grandTotal || finalTotal.value || 0;

    const rawPayload = {
      items: orderPayload.value.items.map((item) => ({
        serviceCode: item.serviceCode,
        serviceName: item.serviceName,
        quantity: item.quantity,
        unit: item.unit,
        itemNotes: item.itemNotes,
        price: item.price,
        express: item.express || false,
        sameDay: item.sameDay || false,
        addOns: item.addOns || [],
      })),

      pricingModel: orderPayload.value.pricingModel || "RETAIL",
      serviceTier: orderPayload.value.serviceTier || "STANDARD",

      pickup: {
        date: orderPayload.value.pickup.date,
        window: orderPayload.value.pickup.window,
        address: orderPayload.value.pickup.address,
      },

      delivery: {
        date: orderPayload.value.delivery.date,
        window: orderPayload.value.delivery.window,
        address: orderPayload.value.delivery.address,
      },

      notes: orderPayload.value.notes || "",
      couponCode: orderPayload.value.couponCode || null,
      userName: orderPayload.value.userName || user.value?.fullName,

      payment: {
        method: orderPayload.value.payment.method,
        mode: orderPayload.value.payment.mode,
        gateway: orderPayload.value.payment.gateway,
        amountPaid: 0,
        balance: totalAmount,
        transactionId: null,
        checkoutUrl: null,
        failedAttempts: 0,
        installments: [],
      },

      photos: Array.isArray(orderPayload.value.photos)
        ? orderPayload.value.photos.filter(
            (p) => typeof p === "string" && p.startsWith("http")
          )
        : [],
    };

    // Handle installment structure (70/30 split as backend expects)
    if (rawPayload.payment.mode === "INSTALLMENT") {
      const upfrontAmount = Math.round(totalAmount * 0.7);
      const deliveryAmount = totalAmount - upfrontAmount;

      rawPayload.payment.installments = [
        {
          label: "Upfront Payment",
          dueDate: new Date(),
          amount: upfrontAmount,
          status: "PAID",
        },
        {
          label: "Delivery Payment",
          dueDate: new Date(orderPayload.value.delivery.date),
          amount: deliveryAmount,
          status: "PENDING",
        },
      ];

      rawPayload.payment.amountPaid = upfrontAmount;
      rawPayload.payment.balance = deliveryAmount;
    }

    const cleaned = cleanPayload(rawPayload);
    console.log(
      "🟢 Final payload to backend:",
      JSON.stringify(cleaned, null, 2)
    );

    const response = await authorizedFetch("api/orders", {
      method: "POST",
      body: JSON.stringify(cleaned),
    });

    console.log("🟢 Order response:", response);

    const orderId = response?.order?.orderId;

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
    overlayMessage.value = `Order failed: ${
      err.message || "An unknown error occurred"
    }`;
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

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: "BookPickup" });
  }
};

onBeforeUnmount(() => {
  if (pollingInterval) clearInterval(pollingInterval);
  if (pollingTimeout) clearTimeout(pollingTimeout);
});
</script>
