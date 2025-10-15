<template>
  <div class="p-6 md:p-10">
    <h2 class="text-2xl font-semibold text-navy-blue mb-6 text-center">
      Your Order History
    </h2>

    <!-- Tabs -->
    <div class="flex justify-center gap-4 mb-8 border-b pb-2">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="px-4 py-2 rounded-t-md text-sm font-medium transition-all"
        :class="[
          activeTab === tab
            ? 'bg-navy-blue text-white shadow-md'
            : 'text-gray-600 hover:text-navy-blue hover:bg-gray-100',
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="text-center text-charcoal/70 py-10 animate-pulse"
    >
      Loading your orders...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center text-red-500 py-10">
      {{ error }}
    </div>

    <!-- No Orders -->
    <div
      v-else-if="filteredOrders.length === 0"
      class="text-center text-charcoal/70 py-10"
    >
      No {{ activeTab.toLowerCase() }} orders found.
    </div>

    <!-- Orders Grid -->
    <div
      v-else
      class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto"
    >
      <div
        v-for="order in filteredOrders"
        :key="order._id"
        class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-semibold text-navy-blue">
              {{ order.orderId || order._id.slice(-6) }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ new Date(order.createdAt).toLocaleDateString() }}
            </p>
          </div>

          <span
            class="px-3 py-1 rounded-full text-xs font-semibold capitalize"
            :class="statusClass(order.status)"
          >
            {{ order.status }}
          </span>
        </div>

        <!-- Dynamic Headline -->
        <div class="mb-3">
          <p
            v-if="['Booked', 'Out For Delivery'].includes(order.status)"
            class="text-blue-700 font-semibold"
          >
            {{
              order.status === "Booked" ? "Order Confirmed" : "Order Shipped"
            }}
          </p>
          <p
            v-else-if="order.status === 'Delivered'"
            class="text-green-700 font-semibold"
          >
            Order Delivered
          </p>

          <p
            v-else-if="order.status === 'Picked Up'"
            class="text-blue-700 font-semibold"
          >
            Order Picked Up
          </p>
        </div>

        <!-- Order Info -->
        <div class="text-sm text-gray-700 mb-3 space-y-1">
          <p>
            <strong>Total:</strong>
            ₦{{
              (
                order?.totals?.total ||
                order?.totals?.grandTotal ||
                order?.total ||
                0
              ).toLocaleString()
            }}
          </p>

          <!-- For Cancelled Orders: Show minimal info -->
          <template v-if="order.status === 'Cancelled'">
            <p>
              <span class="font-medium">Services:</span>
              <span
                v-if="order.items && order.items.length"
                class="text-gray-600"
              >
                {{
                  order.items
                    .map((item) => item.serviceName || item.name)
                    .join(", ")
                }}
              </span>
              <span v-else class="text-gray-500">No items</span>
            </p>
          </template>

          <!-- For Active/Completed Orders: Show full details -->
          <template v-else>
            <p>
              <span class="font-medium">Items:</span>
              {{ order.items?.length || 0 }}
            </p>

            <ul
              class="ml-4 list-disc text-gray-600"
              v-if="order.items && order.items.length"
            >
              <li
                v-for="item in order.items"
                :key="item._id"
                class="py-2 flex justify-between text-sm text-gray-700"
              >
                <span
                  >{{ item.quantity }} × {{ item.serviceName }}
                  {{ item.serviceTier }}</span
                >
                <span
                  >₦{{
                    (item.price || item.subtotal || 0).toLocaleString()
                  }}</span
                >
              </li>
            </ul>
          </template>
        </div>

        <!-- Footer -->
        <div class="flex flex-wrap justify-between items-center mt-4 gap-3">
          <div v-if="['Delivered', 'Picked Up'].includes(order.status)">
            <div class="text-sm text-gray-500">
              <p>Have any complaint?</p>
              <button
                @click="openComplaintModal(order)"
                class="mt-2 text-navy-blue font-medium hover:underline"
              >
                Leave a complaint
              </button>
            </div>
          </div>

          <div class="flex gap-2 ml-auto">
            <!-- Active Orders -->
            <div
              v-if="
                ['Booked', 'Out For Delivery', 'Picked Up'].includes(
                  order.status
                )
              "
              class="flex justify-center gap-3"
            >
              <button
                @click="openCancelModal(order)"
                class="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Cancel Order
              </button>
              <button
                @click="
                  router.push({
                    name: 'TrackOrder',
                    params: { id: order.orderId },
                  })
                "
                class="px-4 py-2 text-sm bg-navy-blue text-white rounded-md hover:bg-charcoal transition"
              >
                Track Order
              </button>
            </div>

            <!-- Completed Orders -->
            <template v-else-if="order.status === 'Delivered'">
              <button
                @click="downloadReceipt(order)"
                class="px-4 py-2 bg-navy-blue text-white rounded hover:bg-navy-700 transition"
              >
                <span v-if="loadingReceipt[order._id]">Opening...</span>
                <span v-else>E-Receipt</span>
              </button>

              <button
                @click="openReviewModal(order)"
                class="px-4 py-2 text-sm bg-navy-blue text-white rounded-md hover:bg-navy-700 transition"
              >
                Leave Review
              </button>
            </template>

            <!-- Cancelled -->
            <template v-else-if="order.status === 'Cancelled'">
              <button
                @click="openOrderDetails(order.orderId)"
                class="text-sm text-blue-600 hover:underline font-medium"
              >
                View Details
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Complaint Modal -->
    <div
      v-if="showComplaintModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeComplaintModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h2 class="text-xl font-semibold mb-4 text-gray-800">
          Submit a Complaint
        </h2>

        <p class="text-gray-600 mb-2">
          Regarding order
          <strong class="text-gray-800">{{
            selectedComplaintOrder?.orderId ||
            selectedComplaintOrder?._id.slice(-6)
          }}</strong>
        </p>

        <textarea
          v-model="complaintMessage"
          placeholder="Describe your issue..."
          rows="4"
          class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-navy-blue focus:outline-none resize-none mb-4"
        ></textarea>

        <div class="flex justify-end gap-3">
          <button
            @click="closeComplaintModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            @click="submitComplaint"
            :disabled="submittingComplaint"
            class="px-4 py-2 bg-navy-blue text-white rounded hover:bg-navy-700 transition disabled:opacity-50"
          >
            <span v-if="submittingComplaint">Submitting...</span>
            <span v-else>Submit</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel Modal -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
            selectedOrder?.orderId || selectedOrder?._id.slice(-6)
          }}</strong
          >?
        </p>

        <!-- Reason Selection -->
        <div class="space-y-2 mb-4">
          <p class="text-gray-700 font-medium mb-2">Select a reason:</p>
          <div
            v-for="reason in cancelReasons"
            :key="reason"
            class="flex items-center gap-2"
          >
            <input
              type="radio"
              :id="reason"
              :value="reason"
              v-model="selectedReason"
              class="text-navy-blue focus:ring-navy-blue"
            />
            <label :for="reason" class="text-gray-700">{{ reason }}</label>
          </div>

          <!-- 'Other' reason -->
          <div class="mt-2">
            <label class="flex items-center gap-2">
              <input
                type="radio"
                value="Other"
                v-model="selectedReason"
                class="text-navy-blue focus:ring-navy-blue"
              />
              <span class="text-gray-700">Other</span>
            </label>

            <textarea
              v-if="selectedReason === 'Other'"
              v-model="otherReason"
              placeholder="Please specify your reason..."
              rows="3"
              class="w-full mt-2 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-navy-blue focus:outline-none resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 mt-4">
          <button
            @click="closeCancelModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            No, Keep Order
          </button>
          <button
            @click="confirmCancelOrder"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
            :disabled="!selectedReason"
          >
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <transition name="fade">
      <div
        v-if="showReviewModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="closeReviewModal"
      >
        <div
          class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 relative"
          @click.stop
        >
          <button
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            @click="closeReviewModal"
          >
            ✕
          </button>
          <h3 class="text-xl font-semibold mb-4 text-gray-800 text-center">
            Leave a Review
          </h3>

          <!-- Stars -->
          <div class="flex justify-center mb-4">
            <i
              v-for="n in 5"
              :key="n"
              class="fa-star text-2xl cursor-pointer transition"
              :class="[
                n <= reviewRating ? 'fas text-yellow-400' : 'far text-gray-400',
              ]"
              @click="reviewRating = n"
            ></i>
          </div>

          <!-- Comment -->
          <textarea
            v-model="reviewComment"
            rows="4"
            placeholder="Write your feedback..."
            class="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-navy-blue outline-none"
          ></textarea>

          <!-- Submit -->
          <button
            @click="submitReview"
            :disabled="submitting"
            class="mt-4 w-full bg-navy-blue text-white py-3 rounded-md font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {{ submitting ? "Submitting..." : "Submit Review" }}
          </button>
        </div>
      </div>
    </transition>
  </div>

  <!-- Order Details Modal -->
  <div
    v-if="showOrderModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">
      <button
        @click="closeOrderModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <i class="ri-close-line text-xl"></i>
      </button>

      <h2 class="text-lg font-semibold mb-3">Order Details</h2>

      <!-- Guarded to prevent null reference -->
      <div v-if="selectedOrder">
        <div class="space-y-2 text-sm">
          <p><strong>Order ID:</strong> {{ selectedOrder.orderId }}</p>
          <p>
            <strong>Status:</strong>
            <span
              :class="statusClass(selectedOrder.status)"
              class="px-2 py-1 rounded text-xs font-semibold capitalize"
              >{{ selectedOrder.status }}</span
            >
          </p>
          <p>
            <strong>Date & Time:</strong>
            {{
              new Date(selectedOrder.createdAt).toLocaleString("en-NG", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            }}
          </p>

          <p>
            <strong>Total:</strong>
            ₦{{
              (
                selectedOrder?.totals?.total ||
                selectedOrder?.totals?.grandTotal ||
                selectedOrder?.total ||
                0
              ).toLocaleString()
            }}
          </p>
        </div>

        <hr class="my-4" />

        <p class="font-medium mb-2">
          Items ({{ selectedOrder.items?.length || 0 }})
        </p>
        <div
          v-if="selectedOrder.items && selectedOrder.items.length"
          class="space-y-2"
        >
          <div
            v-for="(item, index) in selectedOrder.items"
            :key="index"
            class="flex justify-between text-sm py-2 border-b last:border-b-0"
          >
            <span
              >{{ item.quantity }} × {{ item.serviceName || item.name }}
              {{ item.serviceTier }}</span
            >
            <span
              >₦{{ (item.price || item.subtotal || 0).toLocaleString() }}</span
            >
          </div>
        </div>
        <div v-else class="text-sm text-gray-500">No items available.</div>

        <!-- Cancellation Details -->
        <div
          v-if="selectedOrder.status === 'Cancelled'"
          class="border-t pt-4 mt-4 bg-red-50 p-3 rounded-lg"
        >
          <h3 class="text-sm font-semibold text-red-600 mb-2">
            Cancellation Details
          </h3>

          <div
            v-if="
              selectedOrder.cancellationReason &&
              selectedOrder.cancelledBy !== 'admin'
            "
          >
            <p class="text-xs text-gray-600 mb-1">
              <strong>Cancelled by:</strong> You
            </p>
            <p class="text-sm text-gray-700">
              <strong>Reason:</strong> {{ selectedOrder.cancellationReason }}
            </p>
          </div>

          <div v-else-if="selectedOrder.cancelledBy === 'admin'">
            <p class="text-xs text-gray-600 mb-1">
              <strong>Cancelled by:</strong> Administrator
            </p>
            <p class="text-sm text-gray-700">
              <strong>Admin Note:</strong>
              {{
                selectedOrder.cancellationReason ||
                "No reason provided by admin"
              }}
            </p>
          </div>

          <div v-else>
            <p class="text-sm text-gray-600">
              This order was cancelled.
              {{ selectedOrder.cancellationReason || "No reason provided." }}
            </p>
          </div>

          <p
            v-if="selectedOrder.cancelledAt"
            class="text-xs text-gray-500 mt-2"
          >
            <strong>Cancelled on:</strong>
            {{
              new Date(selectedOrder.cancelledAt).toLocaleString("en-NG", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            }}
          </p>
        </div>
        <div class="flex justify-end mt-6">
          <button
            @click="closeOrderModal"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
          >
            Close
          </button>
        </div>
      </div>

      <!-- Fallback in case selectedOrder is missing -->
      <div v-else class="text-gray-500 text-sm text-center py-8">
        No order details available.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "@/composables/useUser";
import {
  getUserOrders,
  cancelUserOrder,
  createReview,
  createIssue,
  getOrderReceipt,
} from "@/services/api.js";
import { useToast } from "@/composables/useToast";

const router = useRouter();
const { user, loadUser } = useUser();
const { showSuccess, showError, showInfo } = useToast();

const tabs = ["Active", "Completed", "Cancelled"];
const activeTab = ref("Active");
const orders = ref([]);
const isLoading = ref(false);
const error = ref(null);
const cancelling = ref({});
const showCancelModal = ref(false);
const selectedOrder = ref({});
const showOrderModal = ref(false);
const loadingReceipt = ref({});

const showComplaintModal = ref(false);
const complaintMessage = ref("");
const selectedComplaintOrder = ref(null);
const submittingComplaint = ref(false);

// Review modal state
const showReviewModal = ref(false);
const reviewRating = ref(0);
const reviewComment = ref("");
const submitting = ref(false);
const reviewOrderId = ref(null);

const cancelReasons = [
  "Changed my mind",
  "Found a cheaper alternative",
  "Order taking too long",
  "Wrong order placed",
  "Poor service experience",
];

const selectedReason = ref("");
const otherReason = ref("");

// Fetch orders
async function fetchOrders() {
  try {
    isLoading.value = true;
    await loadUser();
    const res = await getUserOrders(user.value.phone);
    orders.value = res?.orders || res || [];
  } catch (err) {
    error.value = err.message;
    showError(
      "Couldn't fetch order history, please check your internet connection."
    );
  } finally {
    isLoading.value = false;
  }
}

const filteredOrders = computed(() => {
  if (activeTab.value === "Active") {
    return orders.value.filter((o) =>
      ["Booked", "Out For Delivery", "Picked Up"].includes(o.status)
    );
  } else if (activeTab.value === "Completed") {
    return orders.value.filter((o) => o.status === "Delivered");
  } else {
    return orders.value.filter((o) => o.status === "Cancelled");
  }
});

function openCancelModal(order) {
  selectedOrder.value = order;
  showCancelModal.value = true;
}

function closeCancelModal() {
  showCancelModal.value = false;
  selectedOrder.value = null;
  selectedReason.value = "";
  otherReason.value = "";
}

// Cancel order
async function confirmCancelOrder() {
  if (!selectedOrder.value) return;

  // ⚡ FIX APPLIED: Use the human-readable orderId for the API call
  const orderId = selectedOrder.value.orderId;

  // Build reason message
  let reasonMessage = selectedReason.value;
  if (selectedReason.value === "Other") {
    if (!otherReason.value.trim()) {
      showError("Please specify your reason.");
      return;
    }
    reasonMessage = `Other: ${otherReason.value.trim()}`;
  }

  cancelling.value[orderId] = true;
  closeCancelModal();

  try {
    // The API service call now uses the human-readable orderId
    await cancelUserOrder(orderId, { reason: reasonMessage });
    orders.value = orders.value.map((o) =>
      // The update logic must use orderId to find the order if we used orderId as the key for 'cancelling'
      o.orderId === orderId
        ? { ...o, status: "Cancelled", cancellationReason: reasonMessage }
        : o
    );

    showSuccess("Order cancelled successfully.");
  } catch (err) {
    console.error(err);
    showError("Failed to cancel order.");
  } finally {
    cancelling.value[orderId] = false;
  }
}
function openOrderDetails(orderId) {
  const foundOrder = orders.value.find(
    (o) => o.orderId === orderId || o._id === orderId
  );
  if (!foundOrder) {
    showError("Order not found in local data.");
    return;
  }
  selectedOrder.value = foundOrder;
  showOrderModal.value = true;
}

function closeOrderModal() {
  showOrderModal.value = false;
  selectedOrder.value = null;
}

async function downloadReceipt(order) {
  const id = order._id || order.orderId;
  loadingReceipt.value[id] = true;
  try {
    const blob = await getOrderReceipt(order.orderId);

    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
    showSuccess("E-Receipt opened in a new tab!");
  } catch (err) {
    console.error("Receipt Error:", err);
    showError(err.message || "Failed to open E-Receipt");
  } finally {
    loadingReceipt.value[id] = false;
  }
}

// Review modal handlers
function openReviewModal(order) {
  reviewOrderId.value = order.orderId;
  showReviewModal.value = true;
}

function closeReviewModal() {
  showReviewModal.value = false;
  reviewRating.value = 0;
  reviewComment.value = "";
  reviewOrderId.value = null;
}

async function submitReview() {
  if (!reviewRating.value) {
    showError("Please select a rating!");
    return;
  }
  submitting.value = true;
  try {
    const res = await createReview({
      rating: reviewRating.value,
      comment: reviewComment.value,
      orderId: reviewOrderId.value,
    });
    if (res.success) {
      showSuccess("Review submitted successfully!");
      closeReviewModal();
    } else {
      throw new Error(res.message);
    }
  } catch (err) {
    showError("Failed to submit review.");
  } finally {
    submitting.value = false;
  }
}

function openComplaintModal(order) {
  selectedComplaintOrder.value = order;
  complaintMessage.value = "";
  showComplaintModal.value = true;
}

function closeComplaintModal() {
  showComplaintModal.value = false;
  complaintMessage.value = "";
  selectedComplaintOrder.value = null;
}

async function submitComplaint() {
  if (!complaintMessage.value.trim()) {
    showError("Please enter your complaint message.");
    return;
  }

  if (!selectedComplaintOrder.value) return;

  submittingComplaint.value = true;
  try {
    const payload = {
      fullName: user.value?.fullName || "Unknown User",
      phone: user.value?.phone || "Unknown",
      order: selectedComplaintOrder.value._id,
      message: complaintMessage.value.trim(),
    };

    await createIssue(payload);

    showSuccess("Your complaint has been submitted successfully.");
    closeComplaintModal();
  } catch (err) {
    showError(err.message || "Failed to submit complaint.");
  } finally {
    submittingComplaint.value = false;
  }
}

function statusClass(status) {
  return {
    "bg-blue-100 text-blue-700":
      status === "Booked" || status === "Out For Delivery",
    "bg-green-100 text-green-700":
      status === "Delivered" || status === "Picked Up",
    "bg-red-100 text-red-700": status === "Cancelled",
  };
}

onMounted(fetchOrders);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
