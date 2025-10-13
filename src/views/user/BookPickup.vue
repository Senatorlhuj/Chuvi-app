<template>
  <div class="p-6 md:p-10 text-center">
    <h1 class="text-3xl md:text-4xl text-navy-blue font-font-display">
      Your Clean Clothes Await
    </h1>

    <router-link :to="{ name: 'ItemSelection' }">
      <button
        class="mt-8 py-3 px-8 bg-pure-gold text-navy-blue font-bold rounded-full hover:shadow-lg transition-transform duration-300 hover:scale-105"
      >
        Start a New Order Now
      </button>
    </router-link>

    <!-- ORDER HISTORY -->
    <div class="mt-12 text-left max-w-4xl mx-auto">
      <h2 class="text-2xl font-semibold text-navy-blue mb-4">
        Your Order History
      </h2>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="text-charcoal/70 text-center py-6 animate-pulse"
      >
        Loading your previous orders...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-red-500 text-center py-6">
        Failed to load order history: {{ error }}
      </div>

      <!-- Empty State -->
      <div
        v-else-if="orders.length === 0"
        class="text-charcoal/70 text-center py-6"
      >
        You have no previous orders.
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order._id"
          class="p-5 rounded-xl bg-cream shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
        >
          <div
            class="flex flex-col sm:flex-row justify-between sm:items-center mb-3"
          >
            <span class="font-semibold text-navy-blue text-base sm:text-lg">
              ORDER ID: <b> {{ order.orderId }}</b>
            </span>
            <span class="text-sm text-charcoal/70 mt-1 sm:mt-0">
              {{ new Date(order.createdAt).toLocaleDateString() }}
            </span>
          </div>

          <ul class="text-sm text-charcoal/80 space-y-1">
            <li v-for="item in order.items" :key="item.serviceCode">
              {{ item.quantity }} × {{ item.serviceName }} ({{
                item.serviceTier
              }})
            </li>
          </ul>

          <div
            class="mt-4 flex justify-between items-center font-semibold text-navy-blue"
          >
            <span>Total:</span>
            <span>₦{{ (order.totals?.grandTotal ?? 0).toLocaleString() }}</span>
            <p class="text-sm text-charcoal/70">
              Subtotal ₦{{ order.totals?.itemsTotal.toLocaleString() }} +
              Delivery ₦{{ order.totals?.deliveryFee.toLocaleString() }}
            </p>
          </div>

          <div class="mt-4 flex flex-wrap justify-end gap-2">
            <button
              v-if="order.status === 'PENDING'"
              @click="cancelOrder(order._id)"
              class="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
              :disabled="cancelling[order._id]"
            >
              <span v-if="cancelling[order._id]">Cancelling...</span>
              <span v-else>Cancel Order</span>
            </button>

            <button
              @click="viewOrderDetails(order._id)"
              class="px-4 py-2 text-sm bg-navy-blue text-white rounded-md hover:bg-navy-700 transition"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUser } from "@/composables/useUser";
import { getUserOrders, cancelUserOrder } from "@/services/api.js";
import { useRouter } from "vue-router";

const router = useRouter();
const { user, loadUser } = useUser();

const orders = ref([]);
const isLoading = ref(false);
const error = ref(null);
const cancelling = ref({}); // Track cancel state per order

// Fetch user's orders
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    await loadUser();

    // ✅ Wait until user phone is actually populated
    if (!user.value || !user.value.phone) {
      console.warn("⚠️ User phone is missing after loadUser:", user.value);
      throw new Error("User phone number not found. Please re-login.");
    }

    console.log("📞 Calling getUserOrders with:", user.value.phone);

    const response = await getUserOrders(user.value.phone);
    console.log("📦 getUserOrders returned:", response);

    if (Array.isArray(response)) {
      orders.value = response;
    } else if (response && Array.isArray(response.orders)) {
      orders.value = response.orders;
    } else {
      console.warn("⚠️ Unexpected response format:", response);
      orders.value = [];
    }
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    error.value = err.message || "Failed to load your orders.";
  } finally {
    isLoading.value = false;
  }
};

// Cancel an order
const cancelOrder = async (orderId) => {
  if (!confirm("Are you sure you want to cancel this order?")) return;

  try {
    cancelling.value[orderId] = true;
    await cancelUserOrder(orderId, { note: "Cancelled via app" });

    // Reflect update locally
    orders.value = orders.value.map((order) =>
      order._id === orderId ? { ...order, status: "CANCELLED" } : order
    );
  } catch (err) {
    console.error("Failed to cancel order:", err);
    alert("Failed to cancel order. Please try again.");
  } finally {
    cancelling.value[orderId] = false;
  }
};

// Go to order details
const viewOrderDetails = (orderId) => {
  router.push({ name: "OrderDetails", params: { id: orderId } });
};

onMounted(fetchOrders);
</script>
