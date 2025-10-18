<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <!-- Header -->
    <header
      class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Orders Dashboard</h1>
        <p class="text-gray-500">
          Monitor, manage, and update all customer orders
        </p>
      </div>
      <button
        @click="fetchOrders"
        :disabled="loading"
        class="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? "Refreshing..." : "Refresh Orders" }}
      </button>
    </header>

    <!-- Filters -->
    <section
      class="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-8"
    >
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Filters</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2"
            >Phone Number</label
          >
          <input
            v-model="searchPhone"
            type="text"
            placeholder="Search by phone..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2"
            >Status</label
          >
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          >
            <option value="">All Statuses</option>
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2"
            >Date Created</label
          >
          <input
            v-model="selectedDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          />
        </div>

        <div class="flex items-end gap-2">
          <button
            @click="clearFilters"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Clear
          </button>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center"
      >
        <p class="text-sm text-gray-500 mb-1">Total Orders</p>
        <p class="text-2xl font-semibold text-blue-600">
          {{ allOrders.length }}
        </p>
      </div>
      <div
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center"
      >
        <p class="text-sm text-gray-500 mb-1">Showing</p>
        <p class="text-2xl font-semibold text-blue-600">
          {{ paginatedOrders.length }}
        </p>
      </div>
      <div
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center"
      >
        <p class="text-sm text-gray-500 mb-1">Page</p>
        <p class="text-2xl font-semibold text-blue-600">
          {{ page }} / {{ totalPages || 1 }}
        </p>
      </div>
      <div
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center"
      >
        <p class="text-sm text-gray-500 mb-1">Active</p>
        <p class="text-2xl font-semibold text-green-600">
          {{
            allOrders.filter(
              (o) => !["Delivered", "Cancelled"].includes(o.status)
            ).length
          }}
        </p>
      </div>
    </section>

    <!-- Loading -->
    <section v-if="loading" class="flex justify-center py-20">
      <div class="text-center">
        <div
          class="h-10 w-10 border-4 border-blue-300 border-t-transparent rounded-full animate-spin mx-auto mb-3"
        ></div>
        <p class="text-gray-600">Loading orders...</p>
      </div>
    </section>

    <!-- Error -->
    <section
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center"
    >
      {{ error }}
    </section>

    <!-- Empty -->
    <section
      v-else-if="!filteredOrders.length"
      class="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500"
    >
      No orders found. Try adjusting your filters.
    </section>

    <!-- Orders List -->
    <section v-else>
      <!-- Desktop Table -->
      <div
        class="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
      >
        <table class="w-full border-collapse text-sm">
          <thead class="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th class="p-3 font-semibold">Order ID</th>
              <th class="p-3 font-semibold">Phone</th>
              <th class="p-3 font-semibold">Status</th>
              <th class="p-3 font-semibold">Total</th>
              <th class="p-3 font-semibold">Date</th>
              <th class="p-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in paginatedOrders"
              :key="order._id"
              :class="[
                'border-t border-gray-100 hover:bg-gray-50 transition',
                updatingOrderId === order._id ? 'opacity-60' : '',
              ]"
            >
              <td class="p-3 font-medium text-gray-800">
                {{ order.orderId || order._id.slice(-6) }}
              </td>
              <td class="p-3 text-gray-700">{{ order.userPhone }}</td>
              <td class="p-3">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    statusColors[order.status]?.bg || 'bg-gray-100',
                    statusColors[order.status]?.text || 'text-gray-700',
                  ]"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="p-3 font-semibold text-gray-800">
                ₦{{ formatTotal(order) }}
              </td>
              <td class="p-3 text-gray-600">
                {{ new Date(order.createdAt).toLocaleDateString() }}
              </td>
              <td class="p-3 text-center space-x-2">
                <template
                  v-if="!['Delivered', 'Cancelled'].includes(order.status)"
                >
                  <button
                    @click="openStatusModal(order)"
                    class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                  >
                    Update
                  </button>
                  <button
                    @click="openCancelModal(order)"
                    class="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </template>
                <template v-else>
                  <span class="text-gray-400 text-xs italic">No actions</span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="space-y-4 md:hidden">
        <div
          v-for="order in paginatedOrders"
          :key="order._id"
          :class="[
            'bg-white border border-gray-200 rounded-xl shadow-sm p-4 transition',
            updatingOrderId === order._id ? 'opacity-60' : '',
          ]"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold text-gray-800">
              #{{ order.orderId || order._id.slice(-6) }}
            </h3>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                statusColors[order.status]?.bg || 'bg-gray-100',
                statusColors[order.status]?.text || 'text-gray-700',
              ]"
            >
              {{ order.status }}
            </span>
          </div>

          <p class="text-sm text-gray-500">
            Phone: <span class="text-gray-800">{{ order.userPhone }}</span>
          </p>
          <p class="text-sm text-gray-500">
            Total:
            <span class="text-gray-800 font-semibold"
              >₦{{ formatTotal(order) }}</span
            >
          </p>
          <p class="text-sm text-gray-500">
            Date:
            <span class="text-gray-800">{{
              new Date(order.createdAt).toLocaleDateString()
            }}</span>
          </p>

          <div class="flex gap-2 mt-4">
            <template v-if="!['Delivered', 'Cancelled'].includes(order.status)">
              <button
                @click="openStatusModal(order)"
                class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Update
              </button>
              <button
                @click="openCancelModal(order)"
                class="flex-1 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </template>
            <template v-else>
              <span class="text-gray-400 text-sm italic w-full text-center"
                >No actions</span
              >
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- Pagination -->
    <div
      v-if="!loading && filteredOrders.length > 0"
      class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3"
    >
      <button
        @click="prevPage"
        :disabled="!canGoPrev"
        class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        ← Previous
      </button>
      <p class="text-gray-500 text-sm">Page {{ page }} of {{ totalPages }}</p>
      <button
        @click="nextPage"
        :disabled="!canGoNext"
        class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        Next →
      </button>
    </div>

    <!-- Cancel Modal -->
    <Transition name="modal">
      <div
        v-if="showCancelModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        @click="closeCancelModal"
      >
        <div
          class="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
          @click.stop
        >
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Cancel Order</h2>
          <p class="text-gray-600 mb-4">
            Are you sure you want to cancel this order?
          </p>

          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-500 mb-1">Order ID</p>
            <p class="font-semibold text-gray-800">
              {{
                selectedOrderForAction?.orderId ||
                selectedOrderForAction?._id.slice(-6)
              }}
            </p>
            <p class="text-sm text-gray-500 mt-3 mb-1">Customer Phone</p>
            <p class="text-gray-800">{{ selectedOrderForAction?.userPhone }}</p>
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Cancellation Reason</label
          >
          <textarea
            v-model="adminCancelNote"
            rows="3"
            placeholder="Enter reason..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
          ></textarea>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="closeCancelModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Keep Order
            </button>
            <button
              @click="confirmCancelOrder"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Status Modal -->
    <Transition name="modal">
      <div
        v-if="showStatusModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        @click="closeStatusModal"
      >
        <div
          class="bg-white rounded-xl shadow-lg w-full max-w-md p-6 overflow-y-auto max-h-[90vh]"
          @click.stop
        >
          <h2 class="text-xl font-semibold text-gray-800 mb-3">
            Update Order Status
          </h2>
          <p class="text-gray-600 mb-4">Choose the new status for this order</p>

          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-500 mb-1">Current Status</p>
            <p class="font-medium text-gray-800">
              {{ selectedOrderForAction?.status }}
            </p>
          </div>

          <div class="space-y-2 mb-4">
            <label
              v-for="status in statuses"
              :key="status"
              class="flex items-center p-2 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
              :class="
                selectedNewStatus === status
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              "
            >
              <input
                type="radio"
                :value="status"
                v-model="selectedNewStatus"
                class="mr-3 accent-blue-600 cursor-pointer"
              />
              <span class="text-gray-700 font-medium">{{ status }}</span>
            </label>
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Status Change Note</label
          >
          <textarea
            v-model="adminStatusNote"
            rows="2"
            placeholder="Enter note..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          ></textarea>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="closeStatusModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              @click="confirmStatusUpdate"
              :disabled="!selectedNewStatus"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

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
const adminCancelNote = ref("");
const adminStatusNote = ref("");

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

const statusColors = {
  "Pending Payment": {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
  },
  Booked: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-400" },
  "Picked Up": { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-400" },
  "In Cleaning": {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    dot: "bg-cyan-400",
  },
  Ready: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-400" },
  "Out For Delivery": {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    dot: "bg-indigo-400",
  },
  Delivered: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  Cancelled: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" },
};

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
  const params = {
    page: page.value,
    limit: limit,
    status: selectedStatus.value || undefined,
    phone: searchPhone.value || undefined,
  };

  try {
    const data = await getAllOrdersAdmin(params);
    allOrders.value = data.orders || [];
  } catch (err) {
    error.value = err.message || "Failed to fetch orders";
    console.error("Fetch error:", err);
    addToast({ type: "error", message: error.value });
  } finally {
    loading.value = false;
  }
}

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
  adminCancelNote.value = "";
  showCancelModal.value = true;
}
function closeCancelModal() {
  showCancelModal.value = false;
  selectedOrderForAction.value = null;
}

async function confirmCancelOrder() {
  if (!selectedOrderForAction.value) return;
  const orderId = selectedOrderForAction.value.orderId;
  updatingOrderId.value = orderId;

  try {
    await adminCancelOrder(orderId, {
      note: adminCancelNote.value?.trim() || "Cancelled by admin",
      reason: "Admin cancellation",
    });

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
  adminStatusNote.value = "";
  showStatusModal.value = true;
}
function closeStatusModal() {
  showStatusModal.value = false;
  selectedOrderForAction.value = null;
  selectedNewStatus.value = "";
  adminStatusNote.value = "";
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
    await adminUpdateOrderStatus(orderIdentifier, {
      status: newStatus,
      note:
        adminStatusNote.value?.trim() ||
        `Status changed to ${newStatus} by admin.`,
    });

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
