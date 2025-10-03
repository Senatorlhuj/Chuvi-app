<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-bone-white text-charcoal p-4 text-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-24 w-24 text-brand-green mb-6 animate-pulse"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clip-rule="evenodd"
      />
    </svg>
    <h1 class="text-4xl md:text-5xl font-bold mb-4">Success!</h1>
    <p class="text-xl mb-8">Your order has been placed successfully.</p>

    <div
      v-if="orderNumber"
      class="bg-gray-200 text-charcoal p-4 rounded-lg font-mono mb-8"
    >
      Order Number:
      <span class="font-bold">{{ orderNumber }}</span>
    </div>

   <router-link :to="{ name: 'OrderStatus', params: { id: orderNumber } }">
      <button
        class="bg-golden-brown text-bone-white py-4 px-10 rounded-md font-semibold text-lg hover:bg-pure-gold transition-colors cursor-pointer"
      >
        View Order Status
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/useOrderStore';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

// Use a computed to always stay in sync with the store
const orderNumber = computed(() => orderStore.orderNumber);
const orderDetails = computed(() => orderStore.orderData);

onMounted(() => {
  // If the store is empty but the query contains orderNumber, set it
  if (!orderStore.orderNumber && route.query.orderNumber) {
    orderStore.setOrder(route.query.orderNumber, {}); // optional data
  }

  // If there’s no store and no query, redirect back
  if (!orderStore.orderNumber && !route.query.orderNumber) {
    console.error('No order number found. Redirecting to form.');
    router.push({ name: 'BookPickup' }); // adjust to your route name
  }
});
</script>
