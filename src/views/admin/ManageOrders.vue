<script setup>
import { ref, onMounted, computed, watch } from "vue";
import {
  getAllOrdersAdmin,
  adminUpdateOrderStatus,
  adminCancelOrder,
} from "@/services/api.js";
import { useToast } from "@/composables/useToast";

// --- Reactive State ---
const allOrders = ref([]);
const loading = ref(false);
const updatingOrderId = ref(null);
const error = ref(null);
const selectedStatus = ref("");
const searchPhone = ref("");
const selectedDate = ref("");
const page = ref(1);
const limit = 20;

// --- Modal State ---
const showCancelModal = ref(false);
const showStatusModal = ref(false);
const selectedOrderForAction = ref(null);
const selectedNewStatus = ref("");
const adminCancelNote = ref(""); // 📝 Admin note for cancellation

// --- Toast Handling (safe fallback) ---
let addToast;
try {
  const toast = useToast();
  addToast =
    toast?.addToast ||
    ((config) =>
      console.log(`[${config.type?.toUpperCase()}]: ${config.message}`));
} catch (err) {
  console.error("Toast composable error:", err);
  addToast = (config) =>
    console.log(`[${config.type?.toUpperCase()}]: ${config.message}`);
}

// --- Order Statuses ---
const statuses = [
  "Pending Payment",
  "Booked",
  "Picked Up",
  "In Cleaning",
  "Ready",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

// --- Helpers ---
function formatTotal(order) {
  const total =
    order.totals?.grandTotal ??
    (order.items || []).reduce(
      (sum, i) => sum + (i.price * i.quantity || 0),
      0
    );
  return total.toLocaleString();
}


async function fetchOrders() {
  loading.value = true;
  error.value = null;
  // ✅ 1. Gather parameters from reactive state
  const params = {
    page: page.value,
    limit: limit,
    status: selectedStatus.value || undefined, // Only include if set
    phone: searchPhone.value || undefined,   // Only include if set
    // Note: The backend *doesn't* support filtering by date, so we'll ignore selectedDate for the API call for now.
  };

  try {
    // ✅ 2. Pass parameters to the API call
    const data = await getAllOrdersAdmin(params);
    
    // ✅ 3. Update allOrders with the results from the *current* page
    allOrders.value = data.orders || []; 

    // ⚠️ CRITICAL: To fix client-side filtering being applied to a subset, 
    // you should change the frontend logic to use the backend's results directly 
    // and rely on the backend's total/totalPages for pagination controls.

    // A better implementation would be:
    // allOrders.value = data.orders || [];
    // total.value = data.total; // Assumes a `total` ref exists
    // totalPages.value = data.totalPages; // Assumes a `totalPages` ref exists

  } catch (err) {
    // ... error handling
  } finally {
    loading.value = false;
  }
}

// And remove the client-side filtering/pagination logic entirely:
// const filteredOrders = computed(() => { ... }); // REMOVE
// const paginatedOrders = computed(() => { ... }); // REMOVE
// const totalPages = computed(() => ... ); // REMOVE

// --- Filters ---
const filteredOrders = computed(() => {
  return allOrders.value.filter((order) => {
    const matchesStatus =
      !selectedStatus.value || order.status === selectedStatus.value;
    const matchesPhone =
      !searchPhone.value ||
      order.userPhone?.toLowerCase().includes(searchPhone.value.toLowerCase());
    const matchesDate =
      !selectedDate.value ||
      new Date(order.createdAt).toISOString().slice(0, 10) ===
        selectedDate.value;

    return matchesStatus && matchesPhone && matchesDate;
  });
});

// --- Pagination ---
const paginatedOrders = computed(() => {
  const start = (page.value - 1) * limit;
  return filteredOrders.value.slice(start, start + limit);
});
const totalPages = computed(() =>
  Math.ceil(filteredOrders.value.length / limit)
);
const canGoPrev = computed(() => page.value > 1);
const canGoNext = computed(() => page.value < totalPages.value);
function nextPage() {
  if (canGoNext.value) page.value++;
}
function prevPage() {
  if (canGoPrev.value) page.value--;
}
watch([selectedStatus, searchPhone, selectedDate], () => {
  page.value = 1;
});

// --- Cancel Order Logic ---
function openCancelModal(order) {
  selectedOrderForAction.value = order;
  adminCancelNote.value = ""; // reset note each time
  showCancelModal.value = true;
}
function closeCancelModal() {
  showCancelModal.value = false;
  selectedOrderForAction.value = null;
}
async function confirmCancelOrder() {
  if (!selectedOrderForAction.value) return;
  const orderId = selectedOrderForAction.value.orderId; // ✅ FIXED
  updatingOrderId.value = orderId;

  try {
    await adminCancelOrder(orderId, {
      note: adminCancelNote.value?.trim() || "Cancelled by admin",
      reason: "Admin cancellation",
    });

    // Local update
    const orderIndex = allOrders.value.findIndex((o) => o.orderId === orderId);
    if (orderIndex !== -1) allOrders.value[orderIndex].status = "Cancelled";

    addToast({ type: "success", message: "Order cancelled successfully." });
    closeCancelModal();
    setTimeout(fetchOrders, 1000);
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Failed to cancel order.";
    console.error("Cancel error:", message);
    addToast({ type: "error", message });
    await fetchOrders();
  } finally {
    updatingOrderId.value = null;
  }
}

// --- Status Update Logic ---
function openStatusModal(order) {
  selectedOrderForAction.value = order;
  selectedNewStatus.value = order.status;
  showStatusModal.value = true;
}
function closeStatusModal() {
  showStatusModal.value = false;
  selectedOrderForAction.value = null;
  selectedNewStatus.value = "";
}
async function confirmStatusUpdate() {
  if (!selectedOrderForAction.value || !selectedNewStatus.value) return;
  const order = selectedOrderForAction.value;
  const orderIdentifier = order.orderId || order._id;
  const newStatus = selectedNewStatus.value;

  if (newStatus === order.status) {
    addToast({ type: "info", message: "No changes made to order status." });
    closeStatusModal();
    return;
  }

  updatingOrderId.value = order._id;
  closeStatusModal();

  try {
    await adminUpdateOrderStatus(orderIdentifier, { status: newStatus });

    const idx = allOrders.value.findIndex((o) => o._id === order._id);
    if (idx !== -1) allOrders.value[idx].status = newStatus;

    addToast({ type: "success", message: `Order updated to ${newStatus}.` });
    setTimeout(fetchOrders, 1000);
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to update order status.";
    console.error("Status update error:", message);
    addToast({ type: "error", message });
    await fetchOrders();
  } finally {
    updatingOrderId.value = null;
  }
}

// --- Clear Filters ---
function clearFilters() {
  selectedStatus.value = "";
  searchPhone.value = "";
  selectedDate.value = "";
  addToast({ type: "success", message: "Filters cleared." });
}

// --- Lifecycle ---
onMounted(fetchOrders);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">Manage All Orders</h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-5 items-center">
      <input
        v-model="searchPhone"
        type="text"
        placeholder="Search by phone..."
        class="border p-2 rounded w-48"
      />
      <select v-model="selectedStatus" class="border p-2 rounded">
        <option value="">All Statuses</option>
        <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
      </select>
      <input
        v-model="selectedDate"
        type="date"
        class="border p-2 rounded"
        title="Filter by Date Created"
      />
      <button
        @click="fetchOrders"
        :disabled="loading"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? "Loading..." : "Refresh" }}
      </button>
      <button
        @click="clearFilters"
        class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
      >
        Clear Filters
      </button>
    </div>

    <!-- Orders Table -->
    <div
      v-if="!loading && !error && filteredOrders.length"
      class="overflow-x-auto"
    >
      <table
        class="min-w-full bg-white border rounded-lg shadow text-sm text-gray-800"
      >
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3">Order ID</th>
            <th class="p-3">User Phone</th>
            <th class="p-3">Status</th>
            <th class="p-3">Total</th>
            <th class="p-3">Created</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in paginatedOrders"
            :key="order._id"
            class="border-t hover:bg-gray-50 transition"
            :class="{
              'opacity-60 cursor-wait': updatingOrderId === order._id,
            }"
          >
            <td class="p-3">{{ order.orderId || order._id.slice(-6) }}</td>
            <td class="p-3">{{ order.userPhone }}</td>
            <td class="p-3 font-medium">
              <span
                :class="{
                  'text-gray-700': order.status === 'Pending Payment',
                  'text-yellow-600': order.status === 'Booked',
                  'text-blue-600': ['Picked Up', 'In Cleaning'].includes(
                    order.status
                  ),
                  'text-purple-600': order.status === 'Ready',
                  'text-indigo-600': order.status === 'Out For Delivery',
                  'text-green-600': order.status === 'Delivered',
                  'text-red-600': order.status === 'Cancelled',
                }"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="p-3">₦{{ formatTotal(order) }}</td>
            <td class="p-3">
              {{ new Date(order.createdAt).toLocaleString() }}
            </td>
            <td class="p-3 text-center space-x-2">
              <template
                v-if="!['Delivered', 'Cancelled'].includes(order.status)"
              >
                <button
                  @click="openCancelModal(order)"
                  :disabled="updatingOrderId === order._id"
                  class="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Cancel
                </button>
                <button
                  @click="openStatusModal(order)"
                  :disabled="updatingOrderId === order._id"
                  class="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Change Status
                </button>
              </template>
              <template v-else>
                <span class="text-gray-400 text-sm italic">No actions</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cancel Modal -->
    <Transition name="fade">
      <div
        v-if="showCancelModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click="closeCancelModal"
      >
        <div
          class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          @click.stop
        >
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Cancel Order</h2>
          <p class="text-gray-600 mb-4">
            Are you sure you want to cancel order
            <strong class="text-gray-800">{{
              selectedOrderForAction?.orderId ||
              selectedOrderForAction?._id.slice(-6)
            }}</strong
            >?
          </p>

          <p class="text-sm text-gray-500 mb-4">
            Customer: {{ selectedOrderForAction?.userPhone }}
          </p>

          <!-- 📝 Admin Note Input -->
          <label class="block text-sm text-gray-700 font-medium mb-2">
            Admin Note (optional):
          </label>
          <textarea
            v-model="adminCancelNote"
            placeholder="Reason for cancellation..."
            rows="3"
            class="w-full border rounded p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
          ></textarea>

          <div class="flex justify-end gap-3">
            <button
              @click="closeCancelModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              No, Keep Order
            </button>
            <button
              @click="confirmCancelOrder"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Yes, Cancel Order
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Status Modal -->
    <Transition name="fade">
      <div
        v-if="showStatusModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click="closeStatusModal"
      >
        <div
          class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          @click.stop
        >
          <h2 class="text-xl font-semibold mb-4 text-gray-800">
            Change Order Status
          </h2>
          <p class="text-sm text-gray-600 mb-4">
            Order:
            <strong>{{
              selectedOrderForAction?.orderId ||
              selectedOrderForAction?._id.slice(-6)
            }}</strong>
          </p>
          <p class="text-sm text-gray-600 mb-6">
            Current:
            <strong class="text-blue-600">{{
              selectedOrderForAction?.status
            }}</strong>
          </p>

          <div class="space-y-2 mb-6">
            <label
              v-for="status in statuses"
              :key="status"
              class="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 transition"
              :class="{
                'bg-blue-50 border-blue-500': selectedNewStatus === status,
                'border-gray-300': selectedNewStatus !== status,
              }"
            >
              <input
                type="radio"
                :value="status"
                v-model="selectedNewStatus"
                class="mr-3 h-4 w-4 text-blue-600"
              />
              <span class="text-gray-800">{{ status }}</span>
            </label>
          </div>

          <div class="flex justify-end gap-3">
            <button
              @click="closeStatusModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              @click="confirmStatusUpdate"
              :disabled="!selectedNewStatus"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #e5e7eb;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
