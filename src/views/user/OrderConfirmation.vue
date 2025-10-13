<template>
  <div class="p-4 sm:p-6 bg-bone-white min-h-screen flex items-start justify-center">
    <div class="w-full max-w-2xl mt-8 p-8 rounded-xl shadow-2xl bg-cream border-4 border-pure-gold">

      <div class="text-center mb-6">
        <i class="fas fa-check-circle text-6xl text-pure-gold mb-4"></i>
        <h1 class="text-3xl font-font-display font-bold text-navy-blue">
          Order Placed Successfully!
        </h1>
        <p class="text-lg text-charcoal mt-2">
          Your laundry service request has been received.
        </p>
      </div>

      <div class="border-y border-golden-brown/50 py-4 mb-6 text-center">
        <p class="text-sm font-medium text-charcoal">Your Reference Order ID:</p>
        <p class="text-3xl font-extrabold text-golden-brown tracking-wider">{{ orderId }}</p>
      </div>

      <div class="space-y-4 p-4 rounded-lg bg-bone-white">
        <h2 class="text-xl font-semibold text-charcoal border-b border-input pb-2">Order Summary</h2>

        <div class="flex justify-between items-center">
          <span class="text-navy-blue font-medium">Total Items:</span>
          <span class="text-charcoal">{{ totalItemCount }}</span>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-navy-blue font-medium">Payment Method:</span>
          <span class="font-bold text-navy-blue">{{ orderPayload.payment.method === 'CASH' ? 'Cash on Delivery' : 'Online Payment' }}</span>
        </div>

        <div class="flex justify-between items-center border-t border-input pt-2">
          <span class="text-2xl font-bold text-navy-blue">Total Amount:</span>
          <span class="text-2xl font-extrabold text-pure-gold">₦{{ finalTotal.toLocaleString() }}</span>
        </div>
      </div>

      <div class="mt-6 p-4 border border-input rounded-lg bg-bone-white text-charcoal text-sm">
        <p class="font-semibold mb-2">What happens next?</p>
        <ul class="list-disc list-inside space-y-1 ml-2">
          <li>We've notified an agent near you.</li>
          <li>The agent will call you shortly to confirm the **Pickup Address** ({{ orderPayload.pickup?.address }}) and **Date** ({{ orderPayload.pickup?.date }}).</li>
          <li>Please have your items ready for collection at the scheduled time.</li>
        </ul>
      </div>

      <button @click="resetAndGoHome"
              class="mt-8 py-3 px-4 w-full rounded-lg font-bold transition-colors bg-navy-blue text-cream hover:bg-navy-blue/90">
        Start New Order
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderItems } from '@/composables/useOrderItems';

const router = useRouter();
const { orderPayload, totalItemCount } = useOrderItems();

// --- Mocking Data & Calculations ---

// 1. Generate a mock order ID
// In a real application, this would come from the API response after submitOrder()
const orderId = ref('CHU-' + Math.floor(Math.random() * 900000 + 100000));

// 2. Recalculate Final Total (A redundancy for safety, using the same logic as the Summary page)
const subtotal = computed(() => {
    return orderPayload.value.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
});
const deliveryFee = computed(() => subtotal.value < 10000 ? 1000 : 0);
const serviceFee = computed(() => Math.round(subtotal.value * 0.01));
const discount = computed(() => orderPayload.value.couponCode ? Math.round(subtotal.value * 0.10) : 0);

const finalTotal = computed(() => {
    let total = subtotal.value + serviceFee.value + deliveryFee.value - discount.value;
    return Math.max(0, total);
});

// --- Action ---

// Function to clear the cart and navigate to the selector page
const resetAndGoHome = () => {
    // 1. Reset the entire payload state (assuming useOrderItems exports a reset function or we reset properties)
    orderPayload.value.items = [];
    orderPayload.value.pickup = null;
    orderPayload.value.delivery = null;
    orderPayload.value.payment.method = 'CASH';
    orderPayload.value.couponCode = '';

    // 2. Navigate back to the item selector
    router.push({ name: 'ItemSelection' });
};
</script>