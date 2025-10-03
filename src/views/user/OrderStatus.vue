<template>
  <div class="container mx-auto px-4 py-16">
    <div class="bg-bone-white p-8 rounded-xl shadow-xl">
      <h1 class="text-4xl font-bold text-charcoal mb-4">Order Status</h1>
      <div class="text-lg text-gray-600 mb-8">Order #{{ orderNumber }}</div>

      <!-- Progress tracker -->
      <div class="flex items-center justify-between mb-12">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex flex-col items-center relative flex-1"
        >
          <div
            v-if="index > 0"
            class="absolute top-1/2 left-0 w-full h-1 bg-gray-300 transform -translate-y-1/2"
            :class="{ 'bg-golden-brown': index <= currentStepIndex }"
          ></div>

          <div
            class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            :class="{
              'bg-golden-brown text-bone-white': index === currentStepIndex,
              'bg-brand-green text-bone-white': index < currentStepIndex,
              'bg-gray-300 text-charcoal': index > currentStepIndex
            }"
          >
            <span v-if="index < currentStepIndex">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>

          <span
            class="mt-2 text-center text-sm font-medium"
            :class="{
              'text-golden-brown': index === currentStepIndex,
              'text-charcoal': index < currentStepIndex,
              'text-gray-500': index > currentStepIndex
            }"
          >
            {{ step }}
          </span>
        </div>
      </div>

      <div class="mt-12 space-y-8">
        <div class="p-6 bg-cream rounded-lg shadow-inner">
          <h3 class="text-2xl font-bold text-charcoal mb-4">Notes from Staff</h3>
          <p v-if="pickupNotes">{{ pickupNotes }}</p>
          <p v-else class="text-gray-500">No notes yet.</p>
          <div v-if="photoUrl" class="mt-4">
            <img
              :src="photoUrl"
              alt="Order photo from staff"
              class="rounded-lg max-w-full h-auto"
            />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="rescheduleOrder"
            class="w-full bg-navy-blue text-bone-white py-3 px-6 rounded-md font-semibold hover:bg-charcoal transition-colors"
          >
            Reschedule
          </button>
          <button
            @click="cancelOrder"
            class="w-full bg-red-600 text-bone-white py-3 px-6 rounded-md font-semibold hover:bg-red-700 transition-colors"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/useOrderStore';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

// Get the order number from the URL param or store
const orderNumber = computed(() => route.params.id || orderStore.orderNumber);

// If you also want to update the store (optional)
onMounted(() => {
  if (!orderStore.orderNumber && route.params.id) {
    orderStore.setOrder(route.params.id, {}); // optional data
  }
});

// Simulate API data
const currentStatus = ref('In Cleaning');
const pickupNotes = ref('Your items have been picked up...');
const photoUrl = ref('');
const steps = ['Booked', 'Picked Up', 'In Cleaning', 'Ready', 'Out for Delivery', 'Delivered'];
const currentStepIndex = computed(() => steps.indexOf(currentStatus.value));

const rescheduleOrder = () => alert('Reschedule logic');
const cancelOrder = () => alert('Cancel order logic');

// Optionally fetch order data here:
onMounted(() => {
  // api.get(`/orders/${orderNumber.value}`).then(...)
});

</script>
