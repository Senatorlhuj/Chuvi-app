<template>
  <div class="container mx-auto px-4 py-16">
    <div class="bg-bone-white p-8 rounded-xl">
      <h1 class="text-4xl font-bold text-charcoal mb-4">Order Status</h1>
      <div class="text-lg text-gray-600 mb-8">Order #{{ orderNumber }}</div>

      <!-- Loading & Error -->
      <div v-if="loading" class="text-gray-500 text-center py-4 animate-pulse">
        Loading order status...
      </div>
      <div v-if="error" class="text-red-500 text-center py-4">
        {{ error }}
      </div>

      <!-- Progress Tracker -->
      <div
        v-if="!loading && !error"
        class="flex flex-col md:flex-row md:items-center md:justify-between mb-12 relative"
      >
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex md:flex-col items-center relative md:flex-1"
        >
          <!-- Connecting line -->
          <div
            v-if="index > 0"
            class="absolute md:top-1/2 md:left-0 md:w-full md:h-1 bg-gray-300 md:transform md:-translate-y-1/2 left-[38px] top-0 w-[2px] h-full md:static md:w-full md:h-1 md:translate-x-0 md:translate-y-0"
            :class="{ 'bg-golden-brown': index <= currentStepIndex }"
          ></div>

          <!-- Step circle -->
          <div
            class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 flex-shrink-0"
            :class="{
              'bg-golden-brown text-bone-white': index === currentStepIndex,
              'bg-brand-green text-bone-white': index < currentStepIndex,
              'bg-gray-300 text-charcoal': index > currentStepIndex,
            }"
          >
            <span v-if="index < currentStepIndex">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>

          <!-- Step label -->
          <span
            class="ml-6 md:ml-0 md:mt-2 text-sm font-medium text-left md:text-center whitespace-nowrap"
            :class="{
              'text-golden-brown': index === currentStepIndex,
              'text-charcoal': index < currentStepIndex,
              'text-gray-500': index > currentStepIndex,
            }"
          >
            {{ step }}
          </span>
        </div>
      </div>

      <!-- Staff Notes + Image -->
      <div v-if="!loading && !error" class="mt-12 space-y-8">
        <div class="p-6 bg-cream rounded-lg shadow-inner">
          <h3 class="text-2xl font-bold text-charcoal mb-4">
            Notes from Staff
          </h3>
          <p v-if="pickupNotes">{{ pickupNotes }}</p>
          <p v-else class="text-gray-500">No notes yet.</p>

          <div v-if="photoUrl" class="mt-4">
            <img
              :src="photoUrl"
              alt="Order photo from staff"
              class="rounded-lg max-w-full h-auto shadow"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
        
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { trackOrderPublic } from "@/services/api.js"; // ✅ correct endpoint
import { useToast } from "@/composables/useToast";

const route = useRoute();
const router = useRouter();
const { addToast } = useToast();

const orderNumber = computed(() => route.params.id);
const loading = ref(false);
const error = ref(null);
const currentStatus = ref("");
const pickupNotes = ref("");
const photoUrl = ref("");

// ✅ Define the step flow
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

// ✅ Fetch live tracking data
async function fetchOrderStatus() {
  if (!orderNumber.value) return;
  loading.value = true;
  error.value = null;

  try {
    const res = await trackOrderPublic(orderNumber.value);
    console.log("📦 Live tracking response:", res);

    if (!res) throw new Error("Empty response from server");

    // Expect backend returns e.g. { status, notes, photoUrl }
    currentStatus.value = res.status || "Booked";
    pickupNotes.value = res.notes || "";
    photoUrl.value = res.photoUrl || "";
  } catch (err) {
    console.error("❌ Track order failed:", err);
    error.value = err.message || "Failed to fetch tracking info.";
    addToast({ type: "error", message: error.value });
  } finally {
    loading.value = false;
  }
}

// ✅ Real-time updates (polling)
let pollInterval = null;

onMounted(() => {
  fetchOrderStatus();
  pollInterval = setInterval(fetchOrderStatus, 20000); // every 20s
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});


function cancelOrder() {
  router.push({ name: "OrderDetails", params: { id: orderNumber.value } });
  addToast({
    type: "info",
    message: "You can cancel or manage this order from the details page.",
  });
}
</script>

<style scoped>
.bg-cream {
  background-color: #f6f4f1;
}
.bg-bone-white {
  background-color: #fdfcfb;
}
.text-charcoal {
  color: #2f2f2f;
}
.text-golden-brown {
  color: #c39b5a;
}
.bg-golden-brown {
  background-color: #c39b5a;
}
.bg-brand-green {
  background-color: #27b8a7;
}
.shadow-inner {
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
}
.shadow-xl {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
