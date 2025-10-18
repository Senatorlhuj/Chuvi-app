<template>
  <div
    class="min-h-screen "
  >
    <div
      class="border-b border-charcoal/10 mt-8"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            class="p-2 hover:bg-white rounded-lg transition-colors duration-200 cursor-pointer"
            title="Go back"
          >
            <svg
              class="w-5 h-5 text-charcoal"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-navy-blue">
              Order History
            </h1>
            <p class="text-xs sm:text-sm text-charcoal/70 mt-1">
              Track and manage your orders
            </p>
          </div>
        </div>
        <div class="text-right hidden sm:block">
          <p class="text-xs text-charcoal/60">Total Orders</p>
          <p class="text-2xl font-bold text-golden-brown">
            {{ orders.length }}
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            class="px-6 py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-300 whitespace-nowrap flex items-center gap-2 cursor-pointer"
            :class="[
              activeTab === tab
                ? 'bg-charcoal text-bone-white  scale-105'
                : 'bg-bone-white text-charcoal hover:bg-white border border-charcoal/20 hover:border-golden-brown/30',
            ]"
          >
            <i v-if="tab === 'Active'" class="fa-solid fa-bolt text-lg"></i>
            <i
              v-else-if="tab === 'Completed'"
              class="fa-solid fa-circle-check text-lg"
            ></i>
            <i v-else class="fa-solid fa-circle-xmark text-lg"></i>

            {{ tab }}
            <span
              class="ml-1 text-xs opacity-75 bg-charcoal/10 px-2 py-1 rounded-full font-semibold"
            >
              {{ getTabCount(tab) }}
            </span>
          </button>
        </div>
      </div>

      <div class="transition-all duration-300">
        <div
          v-if="isLoading"
          class="flex flex-col items-center justify-center py-20"
        >
          <div class="relative w-16 h-16 mb-4">
            <div
              class="absolute inset-0 bg-gradient-to-r from-golden-brown to-pure-gold rounded-full animate-spin"
              style="mask-image: conic-gradient(transparent 25%, black)"
            ></div>
          </div>
          <p class="text-charcoal/70 font-medium animate-pulse">
            Loading your orders...
          </p>
        </div>

        <div
          v-else-if="error"
          class="bg-white border-2 border-golden-brown rounded-2xl p-6 text-center"
        >
          <i class="fa-solid fa-triangle-exclamation text-4xl mb-3"></i>
          <p class="text-charcoal font-medium">{{ error }}</p>
          <button
            @click="fetchOrders"
            class="mt-4 px-6 py-2 bg-charcoal text-bone-white rounded-lg hover:bg-navy-blue transition-colors"
          >
            Try Again
          </button>
        </div>

        <div v-else-if="filteredOrders.length === 0" class="text-center py-20">
          <i class="fa-solid fa-box-open text-6xl mb-4"></i>
          <p class="text-charcoal text-lg font-medium mb-2">
            No {{ activeTab.toLowerCase() }} orders found
          </p>
          <p class="text-charcoal/70 text-sm mb-6">{{ getEmptyMessage() }}</p>
          <button
            v-if="activeTab !== 'Active'"
            @click="activeTab = 'Active'"
            class="px-6 py-2 bg-charcoal text-bone-white rounded-lg hover:bg-navy-blue transition-colors"
          >
            View Active Orders
          </button>
        </div>

        <div
          v-else
          class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1"
        >
          <div
            v-for="order in filteredOrders"
            :key="order._id"
            class="group bg-bone-white rounded-2xl  transition-all duration-300 border border-charcoal/10 overflow-hidden hover:border-golden-brown/30"
          >
            <div
              class="h-1 bg-gradient-to-r"
              :class="getStatusGradient(order.status)"
            ></div>

            <div class="p-6 sm:p-8">
              <div
                class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6"
              >
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="text-xl sm:text-xl font-bold text-navy-blue">
                      {{ order.orderId || order._id.slice(-6) }}
                    </h3>
                    <span
                      class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      :class="getStatusBadge(order.status)"
                    >
                      {{ order.status }}
                    </span>
                  </div>
                  <p class="text-sm text-charcoal/60 flex items-center gap-1">
                    <i class="fa-solid fa-calendar"></i>
                    {{
                      new Date(order.createdAt).toLocaleDateString("en-NG", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-charcoal/60 uppercase tracking-wider">
                    Total Amount
                  </p>
                  <p class="text-2xl font-bold text-golden-brown">
                    ₦{{
                      (
                        order?.totals?.total ||
                        order?.totals?.grandTotal ||
                        order?.total ||
                        0
                      ).toLocaleString()
                    }}
                  </p>
                </div>
              </div>

           <div class="mb-6 p-4 rounded-xl" :class="getStatusMessageBg(order.status)">
                <p class="text-sm font-semibold flex items-center gap-2" :class="getStatusTextColor(order.status)">
                  
                  <i class="fa-solid" :class="{
                      // Active/In-Progress
                      'fa-calendar-check': order.status === 'Booked',
                      'fa-truck-fast': order.status === 'Out For Delivery',
                      'fa-hand-holding': order.status === 'Picked Up',
                      
                      // Completed/Final
                      'fa-box-archive': order.status === 'Delivered',
                      'fa-circle-xmark': order.status === 'Cancelled',
                      
                      // Default/Fallback
                      'fa-info-circle': !['Booked', 'Out For Delivery', 'Picked Up', 'Delivered', 'Cancelled'].includes(order.status)
                  }"></i>
                  
                  {{ getStatusMessage(order.status) }}
                </p>
              </div>

              <div class="mb-6">
                <p
                  class="text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-3"
                >
                  Items
                </p>
                <div class="space-y-3">
                  <template v-if="order.items && order.items.length">
                    <div
                      v-for="item in order.items"
                      :key="item._id"
                      class="flex items-center gap-3 p-3 bg-white rounded-lg border border-charcoal/10 group/item hover:bg-charcoal/10 transition-colors"
                    >
                      <div
                        class="flex-shrink-0 w-10 h-10 bg-golden-brown rounded-lg flex items-center justify-center text-bone-white text-sm font-bold"
                      >
                        {{ item.quantity }}
                      </div>
                      <div class="flex-grow min-w-0">
                        <p class="text-sm font-semibold text-charcoal truncate">
                          {{ item.serviceName || item.name }}
                        </p>
                        <p class="text-xs text-charcoal/60">
                          {{ item.serviceTier }}
                        </p>
                      </div>
                      <p class="text-sm font-bold text-charcoal flex-shrink-0">
                        ₦{{
                          (item.price || item.subtotal || 0).toLocaleString()
                        }}
                      </p>
                    </div>
                  </template>
                  <p v-else class="text-sm text-charcoal/60 italic">No items</p>
                </div>
              </div>

              <div class="border-t border-charcoal/10 pt-6 mb-6">
                <div
                  v-if="['Delivered', 'Picked Up'].includes(order.status)"
                  class="mb-6"
                >
                  <p
                    class="text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-3"
                  >
                    Support
                  </p>
                  <button
                    @click="openComplaintModal(order)"
                    class="w-full py-2 px-4 bg-white text-golden-brown rounded-lg hover:bg-pure-gold/20 border border-golden-brown/30 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Report an Issue
                  </button>
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <template
                  v-if="
                    ['Booked', 'Out For Delivery', 'Picked Up'].includes(
                      order.status
                    )
                  "
                >
                  <button
                    @click="
                      router.push({
                        name: 'TrackOrder',
                        params: { id: order.orderId },
                      })
                    "
                    class="w-full py-3 px-4 bg-charcoal text-bone-white rounded-xl font-semibold  transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <i class="fa-solid fa-location-dot"></i>
                    Track Order
                  </button>
                  <button
                    @click="openCancelModal(order)"
                    class="w-full py-2 px-4 bg-white text-golden-brown rounded-lg hover:bg-white/80 border border-golden-brown/30 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Cancel Order
                  </button>
                </template>

                <template v-else-if="order.status === 'Delivered'">
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      @click="downloadReceipt(order)"
                      class="py-3 px-4 bg-white text-golden-brown rounded-xl border border-golden-brown/30 font-semibold hover:bg-white/80 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <i
                        v-if="loadingReceipt[order._id]"
                        class="fa-solid fa-clock-rotate-left animate-spin"
                      ></i>
                      <i v-else class="fa-solid fa-file-lines"></i>
                      E-Receipt
                    </button>
                    <button
                      @click="openReviewModal(order)"
                      class="py-3 px-4 bg-charcoal text-pure-gold rounded-xl border border-pure-gold/40 font-semibold hover:bg-pure-gold/30 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <i class="fa-solid fa-star"></i>
                      Review
                    </button>
                  </div>
                </template>

                <template v-else-if="order.status === 'Cancelled'">
                  <button
                    @click="openOrderDetails(order.orderId)"
                    class="py-3 px-4 bg-charcoal/10 text-charcoal rounded-xl border border-charcoal/20 font-semibold hover:bg-charcoal/20 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showComplaintModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      @click="closeComplaintModal"
    >
      <div
        class="bg-bone-white rounded-t-3xl sm:rounded-2xl  w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div
          class="sticky top-0 bg-charcoal p-6 text-bone-white flex items-center justify-between"
        >
          <div class="flex items-center gap-3 cursor-pointer">
            <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
            <h2 class="text-xl font-bold">Report Issue</h2>
          </div>
          <button
            @click="closeComplaintModal"
            class="p-2 hover:bg-black/10 rounded-lg transition-colors cursor-pointer"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-5">
          <div>
            <p class="text-sm text-charcoal/60 mb-1">Order</p>
            <div
              class="px-4 py-3 bg-white rounded-xl border border-charcoal/10"
            >
              <p class="font-bold text-charcoal">
                {{
                  selectedComplaintOrder?.orderId ||
                  selectedComplaintOrder?._id.slice(-6)
                }}
              </p>
            </div>
          </div>

          <div>
            <label class="text-sm font-semibold text-charcoal mb-2 block"
              >Describe the issue</label
            >
            <textarea
              v-model="complaintMessage"
              placeholder="Tell us what went wrong..."
              rows="5"
              class="w-full border border-charcoal/20 rounded-xl p-4 focus:ring-2 focus:ring-golden-brown/30 focus:border-transparent outline-none resize-none text-sm text-charcoal placeholder-charcoal/40"
            ></textarea>
            <p class="text-xs text-charcoal/60 mt-2">
              {{ complaintMessage.length }}/500 characters
            </p>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              @click="closeComplaintModal"
              class="flex-1 py-3 bg-charcoal/10 text-charcoal rounded-xl hover:bg-charcoal/20 font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="submitComplaint"
              :disabled="submittingComplaint || !complaintMessage.trim()"
              class="flex-1 py-3 bg-charcoal text-bone-white rounded-xl font-semibold transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed "
            >
              {{ submittingComplaint ? "Submitting..." : "Submit Report" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showCancelModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      @click="closeCancelModal"
    >
      <div
        class="bg-bone-white rounded-t-3xl sm:rounded-2xl  w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div
          class="sticky top-0 bg-charcoal p-6 text-bone-white flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-hand text-2xl"></i>
            <h2 class="text-xl font-bold">Cancel Order</h2>
          </div>
          <button
            @click="closeCancelModal"
            class="p-2 hover:bg-black/10 rounded-lg transition-colors cursor-pointer"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <div>
            <p class="text-sm text-charcoal/60 mb-2">Cancelling Order</p>
            <div
              class="px-4 py-3 bg-white rounded-xl border border-charcoal/10"
            >
              <p class="font-bold text-charcoal">
                {{ selectedOrder?.orderId || selectedOrder?._id.slice(-6) }}
              </p>
            </div>
          </div>

          <div class="p-4 bg-white border border-golden-brown/30 rounded-xl">
            <p class="text-sm text-charcoal">
              <strong
                ><i class="fa-solid fa-triangle-exclamation mr-1"></i>
                Note:</strong
              >
              This action cannot be undone
            </p>
          </div>

          <div>
            <p
              class="text-sm font-bold text-charcoal uppercase tracking-widest mb-4"
            >
              Why are you cancelling?
            </p>
            <div class="space-y-3">
              <div
                v-for="reason in cancelReasons"
                :key="reason"
                class="cursor-pointer"
              >
                <input
                  type="radio"
                  :id="`reason-${reason}`"
                  :value="reason"
                  v-model="selectedReason"
                  class="hidden peer"
                />
                <label
                  :for="`reason-${reason}`"
                  class="flex items-center gap-3 p-4 rounded-xl border-2 border-charcoal/10 cursor-pointer transition-all peer-checked:border-golden-brown peer-checked:bg-white"
                >
                  <div
                    class="w-5 h-5 rounded-full border-2 border-charcoal/30 flex items-center justify-center peer-checked:border-golden-brown/30 peer-checked:bg-charcoal"
                  >
                    <span
                      v-if="selectedReason === reason"
                      class="w-2 h-2 bg-bone-white rounded-full"
                    ></span>
                  </div>
                  <span class="text-sm font-medium text-charcoal">{{
                    reason
                  }}</span>
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  id="reason-other"
                  value="Other"
                  v-model="selectedReason"
                  class="hidden peer"
                />
                <label
                  for="reason-other"
                  class="flex items-center gap-3 p-4 rounded-xl border-2 border-charcoal/10 cursor-pointer transition-all peer-checked:border-golden-brown/30 peer-checked:bg-white"
                >
                  <div
                    class="w-5 h-5 rounded-full border-2 border-charcoal/30 flex items-center justify-center peer-checked:border-golden-brown peer-checked:bg-charcoal"
                  >
                    <span
                      v-if="selectedReason === 'Other'"
                      class="w-2 h-2 bg-bone-white rounded-full"
                    ></span>
                  </div>
                  <span class="text-sm font-medium text-charcoal"
                    >Something else</span
                  >
                </label>

                <textarea
                  v-if="selectedReason === 'Other'"
                  v-model="otherReason"
                  placeholder="Please tell us more..."
                  rows="3"
                  class="w-full mt-3 border border-charcoal/20 rounded-xl p-3 text-sm focus:ring-2 focus:ring-golden-brown/30 focus:border-transparent outline-none resize-none text-charcoal placeholder-charcoal/40"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-charcoal/10">
            <button
              @click="closeCancelModal"
              class="flex-1 py-3 bg-charcoal/10 text-charcoal rounded-xl hover:bg-charcoal/20 font-semibold transition-colors cursor-pointer"
            >
              Keep Order
            </button>
            <button
              @click="confirmCancelOrder"
              :disabled="!selectedReason"
              class="flex-1 py-3 bg-charcoal text-bone-white rounded-xl  font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showReviewModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      @click="closeReviewModal"
    >
      <div
        class="bg-bone-white rounded-t-3xl sm:rounded-2xl  w-full sm:max-w-md"
        @click.stop
      >
        <div
          class="bg-charcoal p-6 text-bone-white flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-star text-2xl"></i>
            <h2 class="text-xl font-bold">Share Your Feedback</h2>
          </div>
          <button
            @click="closeReviewModal"
            class="p-2 hover:bg-black/10 rounded-lg transition-colors cursor-pointer"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <div class="text-center">
            <p class="text-sm font-semibold text-charcoal/70 mb-4">
              How would you rate this order?
            </p>
            <div class="flex justify-center gap-3">
              <button
                v-for="n in 5"
                :key="n"
                @click="reviewRating = n"
                class="text-3xl transition-all duration-200 transform cursor-pointer"
                :class="[
                  n <= reviewRating
                    ? 'text-pure-gold scale-110'
                    : 'text-charcoal/30 hover:scale-110',
                ]"
              >
                <i class="fa-solid fa-star"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="text-sm font-semibold text-charcoal mb-2 block"
              >Your feedback</label
            >
            <textarea
              v-model="reviewComment"
              rows="4"
              placeholder="Tell us what you think..."
              class="w-full border border-charcoal/20 rounded-xl p-4 focus:ring-2 focus:ring-golden-brown/30 focus:border-transparent outline-none resize-none text-sm text-charcoal placeholder-charcoal/40"
            ></textarea>
            <p class="text-xs text-charcoal/60 mt-2">
              {{ reviewComment.length }}/500 characters
            </p>
          </div>

          <button
            @click="submitReview"
            :disabled="submitting || !reviewRating"
            class="w-full py-3 bg-charcoal/30 text-charcoal rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer hover:bg-charcoal hover:text-bone-white transition-all duration-200">
            <i v-if="!submitting" class="fa-solid fa-sparkles"></i>
            <span>{{ submitting ? "Submitting..." : "Submit Review" }}</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showOrderModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      @click="closeOrderModal"
    >
      <div
        class="bg-bone-white rounded-t-3xl sm:rounded-2xl  w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div
          class="sticky top-0 bg-charcoal p-6 text-bone-white flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-clipboard-list text-2xl"></i>
            <h2 class="text-xl font-bold">Order Details</h2>
          </div>
          <button
            @click="closeOrderModal"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div v-if="selectedOrder" class="p-6 space-y-6">
          <div class="space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <p
                  class="text-xs text-charcoal/60 uppercase tracking-widest font-semibold"
                >
                  Order ID
                </p>
                <p class="text-lg font-bold text-charcoal">
                  {{ selectedOrder.orderId }}
                </p>
              </div>
              <span
                :class="getStatusBadge(selectedOrder.status)"
                class="px-3 py-1 rounded-full text-xs font-bold uppercase"
              >
                {{ selectedOrder.status }}
              </span>
            </div>

            <div>
              <p
                class="text-xs text-charcoal/60 uppercase tracking-widest font-semibold"
              >
                Date & Time
              </p>
              <p class="text-charcoal">
                {{
                  new Date(selectedOrder.createdAt).toLocaleString("en-NG", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })
                }}
              </p>
            </div>

            <div>
              <p
                class="text-xs text-charcoal/60 uppercase tracking-widest font-semibold"
              >
                Total Amount
              </p>
              <p class="text-2xl font-bold text-golden-brown">
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
          </div>

          <div class="border-t border-charcoal/10"></div>

          <div>
            <p
              class="text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-3"
            >
              Items ({{ selectedOrder.items?.length || 0 }})
            </p>
            <div
              v-if="selectedOrder.items && selectedOrder.items.length"
              class="space-y-3"
            >
              <div
                v-for="(item, index) in selectedOrder.items"
                :key="index"
                class="p-4 bg-white rounded-xl border border-charcoal/10"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div
                    class="w-8 h-8 bg-golden-brown rounded-lg flex items-center justify-center text-bone-white text-xs font-bold"
                  >
                    {{ item.quantity }}
                  </div>
                  <p class="font-semibold text-charcoal">
                    {{ item.serviceName || item.name }}
                  </p>
                </div>
                <p class="text-xs text-charcoal/60 mb-2">
                  {{ item.serviceTier }}
                </p>
                <p class="text-sm font-bold text-charcoal">
                  ₦{{ (item.price || item.subtotal || 0).toLocaleString() }}
                </p>
              </div>
            </div>
            <div v-else class="text-sm text-charcoal/60 italic">
              No items available
            </div>
          </div>

          <div
            v-if="selectedOrder.status === 'Cancelled'"
            class="border-t border-charcoal/10 pt-6"
          >
            <div class="p-4 bg-white border border-charcoal/10 rounded-xl">
              <p
                class="text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-3"
              >
                Cancellation Details
              </p>

              <div class="space-y-2 text-sm">
                <p
                  v-if="selectedOrder.cancelledBy === 'admin'"
                  class="text-charcoal"
                >
                  <strong>Cancelled by:</strong> Administrator
                </p>
                <p v-else class="text-charcoal">
                  <strong>Cancelled by:</strong> You
                </p>
                <p class="text-charcoal">
                  <strong>Reason:</strong>
                  {{ selectedOrder.cancellationReason || "No reason provided" }}
                </p>
                <p
                  v-if="selectedOrder.cancelledAt"
                  class="text-charcoal/60 text-xs pt-2"
                >
                  <i class="fa-solid fa-calendar-alt mr-1"></i>
                  {{
                    new Date(selectedOrder.cancelledAt).toLocaleString(
                      "en-NG",
                      { dateStyle: "medium", timeStyle: "short" }
                    )
                  }}
                </p>
              </div>
            </div>
          </div>

          <button
            @click="closeOrderModal"
            class="w-full py-3 bg-charcoal/10 hover:bg-charcoal/20 text-charcoal font-semibold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

        <div v-else class="p-12 text-center">
          <p class="text-charcoal/60">No order details available</p>
        </div>
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

function getTabCount(tab) {
  if (tab === "Active") {
    return orders.value.filter((o) =>
      ["Booked", "Out For Delivery", "Picked Up"].includes(o.status)
    ).length;
  } else if (tab === "Completed") {
    return orders.value.filter((o) => o.status === "Delivered").length;
  } else {
    return orders.value.filter((o) => o.status === "Cancelled").length;
  }
}

function getEmptyMessage() {
  if (activeTab.value === "Active") {
    return "You don't have any active orders right now";
  } else if (activeTab.value === "Completed") {
    return "You haven't completed any orders yet";
  } else {
    return "You don't have any cancelled orders";
  }
}

function getStatusIcon(status) {
  const icons = {
    Booked: "✓",
    "Out For Delivery": "🚚",
    Delivered: "✓",
    "Picked Up": "✓",
    Cancelled: "✕",
  };
  return icons[status] || "●";
}

function getStatusMessage(status) {
  const messages = {
    Booked: "Order confirmed and waiting to be processed",
    "Out For Delivery": "Your order is on the way",
    Delivered: "Order successfully delivered",
    "Picked Up": "Order picked up successfully",
    Cancelled: "Order has been cancelled",
  };
  return messages[status] || status;
}

function getStatusMessageBg(status) {
  const bgClasses = {
    Booked: "bg-white border border-golden-brown/30",
    "Out For Delivery": "bg-white border border-golden-brown/30",
    Delivered: "bg-white border border-golden-brown/30",
    "Picked Up": "bg-white border border-golden-brown/30",
    Cancelled: "bg-white border border-charcoal/20",
  };
  return bgClasses[status] || "bg-white border border-charcoal/10";
}

function getStatusTextColor(status) {
  const textClasses = {
    Booked: "text-golden-brown",
    "Out For Delivery": "text-golden-brown",
    Delivered: "text-golden-brown",
    "Picked Up": "text-golden-brown",
    Cancelled: "text-charcoal",
  };
  return textClasses[status] || "text-charcoal";
}

function getStatusGradient(status) {
  const gradients = {
    Booked: "from-golden-brown to-pure-gold",
    "Out For Delivery": "from-golden-brown to-pure-gold",
    Delivered: "from-golden-brown to-pure-gold",
    "Picked Up": "from-golden-brown to-pure-gold",
    Cancelled: "from-charcoal to-navy-blue",
  };
  return gradients[status] || "from-charcoal to-navy-blue";
}

function getStatusBadge(status) {
  const badges = {
    Booked: "bg-white text-golden-brown border border-golden-brown/30",
    "Out For Delivery":
      "bg-white text-golden-brown border border-golden-brown/30",
    Delivered: "bg-white text-golden-brown border border-golden-brown/30",
    "Picked Up": "bg-white text-golden-brown border border-golden-brown/30",
    Cancelled: "bg-charcoal/10 text-charcoal border border-charcoal/20",
  };
  return (
    badges[status] || "bg-charcoal/10 text-charcoal border border-charcoal/20"
  );
}

function goBack() {
  router.back();
}

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

async function confirmCancelOrder() {
  if (!selectedOrder.value) return;

  const orderId = selectedOrder.value.orderId;
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
    await cancelUserOrder(orderId, { reason: reasonMessage });
    orders.value = orders.value.map((o) =>
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

    if (!blob) {
      throw new Error("Receipt data is missing. Please try again.");
    }

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
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
