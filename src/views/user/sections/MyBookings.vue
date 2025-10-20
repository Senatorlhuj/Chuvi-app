<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <header class="border-b border-charcoal/10 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 sm:gap-3">
            <button
              @click="goBack"
              class="p-2 hover:bg-charcoal/5 rounded-lg transition-all duration-200 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
              title="Go back"
              aria-label="Go back to previous page"
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
            <div class="min-w-0 flex-1">
              <h1
                class="text-lg sm:text-xl lg:text-2xl font-bold text-navy-blue truncate"
                aria-label="Order History"
              >
                Order History
              </h1>
              <p class="text-xs sm:text-sm text-charcoal/70 mt-0.5 truncate">
                Track and manage your orders
              </p>
            </div>
          </div>
          <div class="text-right hidden sm:block flex-shrink-0">
            <p class="text-xs text-charcoal/60">Total Orders</p>
            <p
              class="text-lg sm:text-xl font-bold text-golden-brown"
              aria-live="polite"
            >
              {{ orders.length }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <!-- Filter Tabs Section -->
      <section class="mb-6 sm:mb-8" aria-label="Filter orders">
        <!-- Desktop Tabs -->
        <div
          class="hidden sm:flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          role="tablist"
          aria-label="Order status filters"
        >
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-golden-brown/50',
              activeTab === tab
                ? 'bg-charcoal text-bone-white shadow-md scale-[1.02]'
                : 'bg-white text-charcoal hover:bg-charcoal/5 border border-charcoal/15',
            ]"
            :aria-selected="activeTab === tab"
            :aria-controls="`${tab.toLowerCase()}-orders`"
            :id="`tab-${tab.toLowerCase()}`"
            role="tab"
          >
            <span class="flex items-center gap-2 flex-shrink-0">
              <i
                :class="[
                  'text-sm flex-shrink-0',
                  tab === 'Active'
                    ? 'fa-solid fa-bolt'
                    : tab === 'Completed'
                    ? 'fa-solid fa-circle-check'
                    : 'fa-solid fa-circle-xmark',
                ]"
                aria-hidden="true"
              ></i>
              <span class="flex-shrink-0">{{ tab }}</span>
            </span>
            <span
              class="ml-2 text-xs bg-charcoal/10 px-2 py-1 rounded-full font-semibold min-w-[24px] text-center"
              :class="
                activeTab === tab
                  ? 'bg-bone-white/20 text-bone-white'
                  : 'text-charcoal'
              "
            >
              {{ getTabCount(tab) }}
            </span>
          </button>
        </div>

        <!-- Mobile Filter Dropdown -->
        <div class="sm:hidden w-full">
          <CustomSelect
            v-model="activeTab"
            :options="tabOptions"
            label="Filter orders by status"
            placeholder="Select order status"
            width-class="w-full"
          />
        </div>
      </section>

      <!-- Orders List Section -->
      <section
        :id="`${activeTab.toLowerCase()}-orders`"
        role="tabpanel"
        :aria-labelledby="`tab-${activeTab.toLowerCase()}`"
      >
        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="flex flex-col items-center justify-center py-12 sm:py-16"
          aria-live="polite"
          aria-label="Loading orders"
        >
          <div class="relative w-12 h-12 sm:w-14 sm:h-14 mb-4">
            <div
              class="absolute inset-0 bg-gradient-to-r from-golden-brown to-pure-gold rounded-full animate-spin"
              style="mask-image: conic-gradient(transparent 25%, black)"
              aria-hidden="true"
            ></div>
          </div>
          <p class="text-charcoal/70 font-medium text-sm sm:text-base">
            Loading your orders...
          </p>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="bg-white border-2 border-golden-brown rounded-2xl p-4 sm:p-6 text-center"
          role="alert"
          aria-live="assertive"
        >
          <i
            class="fa-solid fa-triangle-exclamation text-2xl sm:text-3xl text-golden-brown mb-3"
            aria-hidden="true"
          ></i>
          <p class="text-charcoal font-medium text-sm sm:text-base mb-4">
            {{ error }}
          </p>
          <button
            @click="fetchOrders"
            class="px-5 py-2.5 bg-charcoal text-bone-white rounded-lg hover:bg-navy-blue transition-colors text-sm font-medium min-h-[44px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
          >
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredOrders.length === 0"
          class="text-center py-12 sm:py-16 px-4"
          aria-live="polite"
        >
          <i
            class="fa-solid fa-box-open text-4xl sm:text-5xl text-charcoal/30 mb-4"
            aria-hidden="true"
          ></i>
          <p class="text-charcoal text-base font-semibold mb-2">
            No {{ activeTab.toLowerCase() }} orders
          </p>
          <p class="text-charcoal/60 text-sm max-w-xs mx-auto mb-6">
            {{ getEmptyMessage() }}
          </p>
          <button
            v-if="activeTab !== 'Active'"
            @click="activeTab = 'Active'"
            class="px-5 py-2.5 bg-charcoal text-bone-white rounded-lg hover:bg-navy-blue transition-colors text-sm font-medium min-h-[44px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
          >
            View Active Orders
          </button>
        </div>

        <!-- Orders Grid -->
        <div
          v-else
          class="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          role="list"
          aria-label="List of orders"
        >
          <div
            v-for="order in filteredOrders"
            :key="order._id"
            class="bg-white rounded-2xl transition-all duration-300 border border-charcoal/10 overflow-hidden hover:shadow-md hover:border-golden-brown/20 group"
            role="listitem"
          >
            <!-- Status Indicator Bar -->
            <div
              class="h-1.5 bg-gradient-to-r"
              :class="getStatusGradient(order.status)"
              aria-hidden="true"
            ></div>

            <!-- Order Header - Always Visible -->
            <div
              class="p-4 sm:p-5 cursor-pointer hover:bg-charcoal/2 transition-colors"
              @click="toggleOrderDetails(order._id)"
              @keydown.enter="toggleOrderDetails(order._id)"
              @keydown.space="toggleOrderDetails(order._id)"
              :aria-expanded="
                expandedOrderId === order._id || windowWidth >= 1024
              "
              :aria-controls="'order-details-' + order._id"
              tabindex="0"
              role="button"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap mb-2">
                    <h3 class="text-base font-bold text-navy-blue truncate">
                      {{ order.orderId || `#${order._id.slice(-6)}` }}
                    </h3>
                    <span
                      class="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide inline-flex items-center gap-1.5 flex-shrink-0"
                      :class="getStatusBadge(order.status)"
                    >
                      <i
                        class="fa-solid text-xs"
                        :class="getStatusIconClass(order.status)"
                        aria-hidden="true"
                      ></i>
                      <span class="hidden xs:inline truncate max-w-[80px]">
                        {{ order.status }}
                      </span>
                    </span>
                  </div>
                  <div class="flex items-center gap-4 text-xs text-charcoal/60">
                    <span class="flex items-center gap-1.5">
                      <i class="fa-solid fa-calendar" aria-hidden="true"></i>
                      {{
                        new Date(order.createdAt).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }}
                    </span>
                    <span class="flex items-center gap-1.5">
                      <i class="fa-solid fa-clock" aria-hidden="true"></i>
                      {{
                        new Date(order.createdAt).toLocaleTimeString("en-NG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }}
                    </span>
                  </div>
                </div>
                <div class="text-right flex-shrink-0 min-w-[80px]">
                  <p
                    class="text-xs text-charcoal/60 uppercase tracking-wide mb-1"
                  >
                    Total
                  </p>
                  <p class="text-lg font-bold text-golden-brown">
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

              <!-- Expand Indicator for Mobile -->
              <div
                class="flex justify-between items-center mt-3 sm:hidden pt-2 border-t border-charcoal/5"
              >
                <span class="text-xs text-charcoal/50">
                  {{ order.items?.length || 0 }} item{{
                    order.items?.length !== 1 ? "s" : ""
                  }}
                </span>
                <i
                  class="fa-solid fa-chevron-down text-charcoal/40 transition-transform duration-300"
                  :class="{ 'rotate-180': expandedOrderId === order._id }"
                  aria-hidden="true"
                ></i>
              </div>
            </div>

            <!-- Expandable Order Details -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-[800px] opacity-100"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="max-h-[800px] opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div
                v-if="expandedOrderId === order._id || windowWidth >= 1024"
                :id="'order-details-' + order._id"
                class="border-t border-charcoal/10 px-4 sm:px-5 py-4 space-y-4 overflow-hidden"
              >
                <!-- Status Message -->
                <div
                  class="p-3 rounded-xl flex items-start gap-3"
                  :class="getStatusMessageBg(order.status)"
                >
                  <i
                    class="fa-solid mt-0.5 flex-shrink-0"
                    :class="[
                      getStatusIconClass(order.status),
                      getStatusTextColor(order.status),
                    ]"
                    aria-hidden="true"
                  ></i>
                  <p
                    class="text-xs font-medium flex-1"
                    :class="getStatusTextColor(order.status)"
                  >
                    {{ getStatusMessage(order.status) }}
                  </p>
                </div>

                <!-- Order Items -->
                <div>
                  <p
                    class="text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-3"
                  >
                    Order Items ({{ order.items?.length || 0 }})
                  </p>
                  <div
                    class="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin"
                  >
                    <template v-if="order.items && order.items.length">
                      <div
                        v-for="item in order.items"
                        :key="item._id"
                        class="flex items-center gap-3 p-2.5 bg-charcoal/2 rounded-lg border border-charcoal/5"
                      >
                        <div
                          class="w-8 h-8 bg-golden-brown rounded-full flex items-center justify-center text-bone-white text-xs font-bold flex-shrink-0"
                          aria-hidden="true"
                        >
                          {{ item.quantity }}
                        </div>
                        <div class="flex-grow min-w-0">
                          <p class="font-medium text-charcoal text-sm truncate">
                            {{ item.serviceName || item.name }}
                          </p>
                          <p
                            v-if="item.serviceTier"
                            class="text-xs text-charcoal/50 mt-0.5"
                          >
                            {{ item.serviceTier }}
                          </p>
                        </div>
                        <p
                          class="font-semibold text-charcoal text-sm flex-shrink-0"
                        >
                          ₦{{
                            (item.price || item.subtotal || 0).toLocaleString()
                          }}
                        </p>
                      </div>
                    </template>
                    <div
                      v-else
                      class="text-center py-4 text-charcoal/40 text-sm"
                    >
                      No items found
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div
                  class="flex flex-col gap-2.5 pt-4 border-t border-charcoal/10"
                >
                  <!-- Support Button -->
                  <button
                    v-if="['Delivered', 'Picked Up'].includes(order.status)"
                    @click="openComplaintModal(order)"
                    class="w-full py-2.5 px-4 bg-white text-golden-brown rounded-lg hover:bg-golden-brown/5 border border-golden-brown/30 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
                  >
                    <i
                      class="fa-solid fa-triangle-exclamation"
                      aria-hidden="true"
                    ></i>
                    <span>Report an Issue</span>
                  </button>

                  <!-- Track & Cancel Buttons -->
                  <template
                    v-if="
                      [
                        'Pending Payment',
                        'Booked',
                        'Picked Up',
                        'In Cleaning',
                        'Ready',
                        'Out For Delivery',
                      ].includes(order.status)
                    "
                  >
                    <button
                      @click="trackOrder(order.orderId)"
                      class="w-full py-3 px-4 bg-charcoal text-bone-white rounded-lg font-semibold text-sm transition-all hover:bg-navy-blue min-h-[48px] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
                    >
                      <i
                        class="fa-solid fa-location-dot"
                        aria-hidden="true"
                      ></i>
                      <span>Track Order</span>
                    </button>
                    <button
                      @click="openCancelModal(order)"
                      class="w-full py-2.5 px-4 bg-white text-golden-brown rounded-lg border border-golden-brown/30 text-sm font-medium transition-colors hover:bg-golden-brown/5 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
                    >
                      Cancel Order
                    </button>
                  </template>

                  <!-- Delivered Actions -->
                  <template v-else-if="order.status === 'Delivered'">
                    <div class="grid grid-cols-2 gap-2.5">
                      <button
                        @click="downloadReceipt(order)"
                        :disabled="loadingReceipt[order._id]"
                        class="py-2.5 px-3 bg-white text-golden-brown rounded-lg border border-golden-brown/30 font-medium hover:bg-golden-brown/5 transition-colors flex items-center justify-center gap-1.5 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i
                          v-if="loadingReceipt[order._id]"
                          class="fa-solid fa-spinner animate-spin"
                          aria-hidden="true"
                        ></i>
                        <i
                          v-else
                          class="fa-solid fa-file-lines"
                          aria-hidden="true"
                        ></i>
                        <span>E-Receipt</span>
                      </button>
                      <button
                        @click="openReviewModal(order)"
                        class="py-2.5 px-3 bg-charcoal text-bone-white rounded-lg font-medium hover:bg-navy-blue transition-colors flex items-center justify-center gap-1.5 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
                      >
                        <i class="fa-solid fa-star" aria-hidden="true"></i>
                        <span>Review</span>
                      </button>
                    </div>
                  </template>

                  <!-- Cancelled Actions -->
                  <template v-else-if="order.status === 'Cancelled'">
                    <button
                      @click="openOrderDetails(order.orderId)"
                      class="w-full py-3 px-4 bg-charcoal/5 text-charcoal rounded-lg border border-charcoal/10 font-medium hover:bg-charcoal/10 transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
                    >
                      View Details
                    </button>
                  </template>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </section>
    </main>

    <!-- Report Issue Modal -->
    <div
      v-if="showComplaintModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      @click="closeComplaintModal"
    >
      <div
        class="bg-bone-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
        @click.stop
      >
        <!-- Drag Handle for Mobile -->
        <div
          class="sm:hidden flex justify-center py-2 sticky top-0 bg-bone-white border-b border-charcoal/10"
        >
          <div class="w-12 h-1 bg-charcoal/30 rounded-full"></div>
        </div>

        <!-- Header -->
        <div
          class="bg-charcoal p-4 sm:p-6 text-bone-white flex items-center justify-between flex-shrink-0"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-triangle-exclamation text-xl sm:text-2xl"></i>
            <h2 class="text-lg sm:text-xl font-bold">Report Issue</h2>
          </div>
          <button
            @click="closeComplaintModal"
            class="p-2 hover:bg-black/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
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

        <!-- Scrollable Content -->
        <div class="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <p class="text-sm text-charcoal/60 mb-2">Order</p>
            <div
              class="px-4 py-3 bg-white rounded-xl border border-charcoal/10"
            >
              <p class="font-bold text-charcoal text-sm sm:text-base">
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
              rows="4"
              class="w-full border border-charcoal/20 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-golden-brown/30 focus:border-transparent outline-none resize-none text-sm text-charcoal placeholder-charcoal/40 min-h-[100px]"
            ></textarea>
            <p class="text-xs text-charcoal/60 mt-2">
              {{ complaintMessage.length }}/500 characters
            </p>
          </div>
        </div>

        <!-- Fixed Bottom Buttons -->
        <div
          class="border-t border-charcoal/10 p-4 sm:p-6 flex flex-col sm:flex-row gap-3 bg-bone-white flex-shrink-0"
        >
          <button
            @click="closeComplaintModal"
            class="flex-1 py-3 bg-charcoal/10 text-charcoal rounded-xl hover:bg-charcoal/20 font-semibold transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
          >
            Cancel
          </button>
          <button
            @click="submitComplaint"
            :disabled="submittingComplaint || !complaintMessage.trim()"
            class="flex-1 py-3 bg-charcoal text-bone-white rounded-xl font-semibold transition-all disabled:opacity-50 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
          >
            {{ submittingComplaint ? "Submitting..." : "Submit Report" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel Modal with improved responsiveness -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-2 sm:p-4"
      @click="closeCancelModal"
    >
      <div
        class="bg-bone-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div
          class="sticky top-0 bg-charcoal p-4 sm:p-6 text-bone-white flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-hand text-xl sm:text-2xl"></i>
            <h2 class="text-lg sm:text-xl font-bold">Cancel Order</h2>
          </div>
          <button
            @click="closeCancelModal"
            class="p-2 hover:bg-black/10 rounded-lg transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
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

        <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <p class="text-sm text-charcoal/60 mb-2">Cancelling Order</p>
            <div
              class="px-4 py-3 bg-white rounded-xl border border-charcoal/10"
            >
              <p class="font-bold text-charcoal text-sm sm:text-base">
                {{ selectedOrder?.orderId || selectedOrder?._id.slice(-6) }}
              </p>
            </div>
          </div>

          <div
            class="p-3 sm:p-4 bg-white border border-golden-brown/30 rounded-xl"
          >
            <p class="text-xs sm:text-sm text-charcoal">
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
            <div class="space-y-2 sm:space-y-3">
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
                  class="flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 border-charcoal/10 cursor-pointer transition-all peer-checked:border-golden-brown peer-checked:bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
                >
                  <div
                    class="w-5 h-5 rounded-full border-2 border-charcoal/30 flex items-center justify-center peer-checked:border-golden-brown/30 peer-checked:bg-charcoal flex-shrink-0"
                  >
                    <span
                      v-if="selectedReason === reason"
                      class="w-2 h-2 bg-bone-white rounded-full"
                    ></span>
                  </div>
                  <span class="text-xs sm:text-sm font-medium text-charcoal">{{
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
                  class="flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 border-charcoal/10 cursor-pointer transition-all peer-checked:border-golden-brown/30 peer-checked:bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
                >
                  <div
                    class="w-5 h-5 rounded-full border-2 border-charcoal/30 flex items-center justify-center peer-checked:border-golden-brown peer-checked:bg-charcoal flex-shrink-0"
                  >
                    <span
                      v-if="selectedReason === 'Other'"
                      class="w-2 h-2 bg-bone-white rounded-full"
                    ></span>
                  </div>
                  <span class="text-xs sm:text-sm font-medium text-charcoal"
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

          <div
            class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-charcoal/10"
          >
            <button
              @click="closeCancelModal"
              class="flex-1 py-3 bg-charcoal/10 text-charcoal rounded-xl hover:bg-charcoal/20 font-semibold transition-colors cursor-pointer min-h-[48px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
            >
              Keep Order
            </button>
            <button
              @click="confirmCancelOrder"
              :disabled="!selectedReason"
              class="flex-1 py-3 bg-charcoal text-bone-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[48px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal with improved responsiveness -->
    <div
      v-if="showReviewModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-2 sm:p-4"
      @click="closeReviewModal"
    >
      <div
        class="bg-bone-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md"
        @click.stop
      >
        <div
          class="bg-charcoal p-4 sm:p-6 text-bone-white flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-star text-xl sm:text-2xl"></i>
            <h2 class="text-lg sm:text-xl font-bold">Share Your Feedback</h2>
          </div>
          <button
            @click="closeReviewModal"
            class="p-2 hover:bg-black/10 rounded-lg transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
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

        <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div class="text-center">
            <p class="text-sm font-semibold text-charcoal/70 mb-4">
              How would you rate this order?
            </p>
            <div class="flex justify-center gap-2 sm:gap-3">
              <button
                v-for="n in 5"
                :key="n"
                @click="reviewRating = n"
                class="text-2xl sm:text-3xl transition-all duration-200 transform cursor-pointer p-2 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-golden-brown/50 rounded-full"
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
              class="w-full border border-charcoal/20 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-golden-brown/30 focus:border-transparent outline-none resize-none text-sm text-charcoal placeholder-charcoal/40"
            ></textarea>
            <p class="text-xs text-charcoal/60 mt-2">
              {{ reviewComment.length }}/500 characters
            </p>
          </div>

          <button
            @click="submitReview"
            :disabled="submitting || !reviewRating"
            class="w-full py-3 bg-charcoal/30 text-charcoal rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer hover:bg-charcoal hover:text-bone-white transition-all duration-200 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
          >
            <i v-if="!submitting" class="fa-solid fa-sparkles"></i>
            <span>{{ submitting ? "Submitting..." : "Submit Review" }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Order Details Modal with improved responsiveness -->
    <div
      v-if="showOrderModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-2 sm:p-4"
      @click="closeOrderModal"
    >
      <div
        class="bg-bone-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div
          class="sticky top-0 bg-charcoal p-4 sm:p-6 text-bone-white flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-clipboard-list text-xl sm:text-2xl"></i>
            <h2 class="text-lg sm:text-xl font-bold">Order Details</h2>
          </div>
          <button
            @click="closeOrderModal"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
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

        <div v-if="selectedOrder" class="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div class="space-y-3">
            <div class="flex justify-between items-start gap-4">
              <div class="min-w-0 flex-1">
                <p
                  class="text-xs text-charcoal/60 uppercase tracking-widest font-semibold"
                >
                  Order ID
                </p>
                <p
                  class="text-base sm:text-lg font-bold text-charcoal break-all"
                >
                  {{ selectedOrder.orderId }}
                </p>
              </div>
              <span
                :class="getStatusBadge(selectedOrder.status)"
                class="px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase flex-shrink-0"
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
              <p class="text-sm sm:text-base text-charcoal">
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
              <p class="text-xl sm:text-2xl font-bold text-golden-brown">
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
              class="space-y-2 sm:space-y-3"
            >
              <div
                v-for="(item, index) in selectedOrder.items"
                :key="index"
                class="p-3 sm:p-4 bg-white rounded-xl border border-charcoal/10"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div
                    class="w-6 h-6 sm:w-8 sm:h-8 bg-golden-brown rounded-full flex items-center justify-center text-bone-white text-xs font-bold flex-shrink-0 leading-none"
                  >
                    {{ item.quantity }}
                  </div>
                  <p
                    class="font-semibold text-charcoal text-sm sm:text-base min-w-0"
                  >
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
            class="border-t border-charcoal/10 pt-4 sm:pt-6"
          >
            <div
              class="p-3 sm:p-4 bg-white border border-charcoal/10 rounded-xl"
            >
              <p
                class="text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-3"
              >
                Cancellation Details
              </p>

              <div class="space-y-2 text-xs sm:text-sm">
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
            class="w-full py-3 bg-charcoal/10 hover:bg-charcoal/20 text-charcoal font-semibold rounded-xl transition-all cursor-pointer min-h-[48px] focus:outline-none focus:ring-2 focus:ring-golden-brown/50"
          >
            Close
          </button>
        </div>

        <div v-else class="p-8 sm:p-12 text-center">
          <p class="text-charcoal/60">No order details available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
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
import CustomSelect from "@/components/atoms/CustomSelect.vue";

const router = useRouter();
const { user, loadUser } = useUser();
const { showSuccess, showError, showInfo } = useToast();

// Reactive state
const tabs = ["Active", "Completed", "Cancelled"];
const activeTab = ref("Active");
const orders = ref([]);
const isLoading = ref(false);
const error = ref(null);
const cancelling = ref({});
const showCancelModal = ref(false);
const selectedOrder = ref(null);
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
const expandedOrderId = ref(null);
const windowWidth = ref(window.innerWidth);
const cancelReasons = [
  "Changed my mind",
  "Found a cheaper alternative",
  "Order taking too long",
  "Wrong order placed",
  "Poor service experience",
];
const selectedReason = ref("");
const otherReason = ref("");

// Computed properties
const tabOptions = computed(() => {
  return tabs.map((tab) => ({
    label: `${tab} (${getTabCount(tab)})`,
    value: tab,
  }));
});

const filteredOrders = computed(() => {
  if (activeTab.value === "Active") {
    return orders.value.filter((o) =>
      [
        "Pending Payment",
        "Booked",
        "Picked Up",
        "In Cleaning",
        "Ready",
        "Out For Delivery",
      ].includes(o.status)
    );
  } else if (activeTab.value === "Completed") {
    return orders.value.filter((o) => o.status === "Delivered");
  } else {
    return orders.value.filter((o) => o.status === "Cancelled");
  }
});

// Methods
function getTabCount(tab) {
  if (tab === "Active") {
    return orders.value.filter((o) =>
      [
        "Pending Payment",
        "Booked",
        "Picked Up",
        "In Cleaning",
        "Ready",
        "Out For Delivery",
      ].includes(o.status)
    ).length;
  } else if (tab === "Completed") {
    return orders.value.filter((o) => o.status === "Delivered").length;
  } else {
    return orders.value.filter((o) => o.status === "Cancelled").length;
  }
}

function getEmptyMessage() {
  const messages = {
    active: "You don't have any active orders at the moment",
    completed: "Start placing orders to see them here",
    cancelled: "No cancelled orders yet",
  };
  return messages[activeTab.value.toLowerCase()] || "No orders found";
}

function getStatusIconClass(status) {
  const icons = {
    "Pending Payment": "fa-credit-card",
    Booked: "fa-calendar-check",
    "Picked Up": "fa-hand-holding",
    "In Cleaning": "fa-soap",
    Ready: "fa-box",
    "Out For Delivery": "fa-truck-fast",
    Delivered: "fa-box-archive",
    Cancelled: "fa-circle-xmark",
  };
  return icons[status] || "fa-info-circle";
}

function getStatusMessage(status) {
  const messages = {
    "Pending Payment": "Waiting for payment confirmation",
    Booked: "Order confirmed and waiting to be processed",
    "Picked Up": "Order picked up successfully",
    "In Cleaning": "Your items are being cleaned",
    Ready: "Order is ready for delivery",
    "Out For Delivery": "Your order is on the way",
    Delivered: "Order successfully delivered",
    Cancelled: "Order has been cancelled",
  };
  return messages[status] || status;
}

function getStatusMessageBg(status) {
  const bgClasses = {
    "Pending Payment": "bg-amber-50 border border-amber-200",
    Booked: "bg-amber-50 border border-amber-200",
    "Picked Up": "bg-amber-50 border border-amber-200",
    "In Cleaning": "bg-amber-50 border border-amber-200",
    Ready: "bg-amber-50 border border-amber-200",
    "Out For Delivery": "bg-amber-50 border border-amber-200",
    Delivered: "bg-green-50 border border-green-200",
    Cancelled: "bg-charcoal/5 border border-charcoal/10",
  };
  return bgClasses[status] || "bg-charcoal/5 border border-charcoal/10";
}

function getStatusTextColor(status) {
  const textClasses = {
    "Pending Payment": "text-amber-800",
    Booked: "text-amber-800",
    "Picked Up": "text-amber-800",
    "In Cleaning": "text-amber-800",
    Ready: "text-amber-800",
    "Out For Delivery": "text-amber-800",
    Delivered: "text-green-800",
    Cancelled: "text-charcoal",
  };
  return textClasses[status] || "text-charcoal";
}

function getStatusGradient(status) {
  const gradients = {
    "Pending Payment": "from-amber-400 to-amber-600",
    Booked: "from-amber-400 to-amber-600",
    "Picked Up": "from-amber-400 to-amber-600",
    "In Cleaning": "from-amber-400 to-amber-600",
    Ready: "from-amber-400 to-amber-600",
    "Out For Delivery": "from-amber-400 to-amber-600",
    Delivered: "from-green-400 to-green-600",
    Cancelled: "from-charcoal to-navy-blue",
  };
  return gradients[status] || "from-charcoal to-navy-blue";
}

function getStatusBadge(status) {
  const badges = {
    "Pending Payment": "bg-amber-100 text-amber-800 border border-amber-200",
    Booked: "bg-amber-100 text-amber-800 border border-amber-200",
    "Picked Up": "bg-amber-100 text-amber-800 border border-amber-200",
    "In Cleaning": "bg-amber-100 text-amber-800 border border-amber-200",
    Ready: "bg-amber-100 text-amber-800 border border-amber-200",
    "Out For Delivery": "bg-amber-100 text-amber-800 border border-amber-200",
    Delivered: "bg-green-100 text-green-800 border border-green-200",
    Cancelled: "bg-charcoal/10 text-charcoal border border-charcoal/20",
  };
  return (
    badges[status] || "bg-charcoal/10 text-charcoal border border-charcoal/20"
  );
}

async function fetchOrders() {
  try {
    isLoading.value = true;
    error.value = null;
    await loadUser();
    const res = await getUserOrders(user.value.phone);
    orders.value = res?.orders || res || [];
  } catch (err) {
    error.value = err.message || "Failed to load orders";
    showError(
      "Couldn't fetch order history. Please check your connection and try again."
    );
  } finally {
    isLoading.value = false;
  }
}

function goBack() {
  router.back();
}

function toggleOrderDetails(orderId) {
  expandedOrderId.value = expandedOrderId.value === orderId ? null : orderId;
}

function trackOrder(orderId) {
  router.push({
    name: "TrackOrder",
    params: { id: orderId },
  });
}

function openCancelModal(order) {
  selectedOrder.value = order;
  selectedReason.value = "";
  otherReason.value = "";
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
      showError("Please specify your reason for cancellation.");
      return;
    }
    reasonMessage = `Other: ${otherReason.value.trim()}`;
  }

  cancelling.value[orderId] = true;

  try {
    await cancelUserOrder(orderId, { reason: reasonMessage });
    orders.value = orders.value.map((o) =>
      o.orderId === orderId
        ? {
            ...o,
            status: "Cancelled",
            cancellationReason: reasonMessage,
            cancelledBy: "user",
            cancelledAt: new Date().toISOString(),
          }
        : o
    );
    showSuccess("Order cancelled successfully.");
    closeCancelModal();
  } catch (err) {
    console.error("Cancel order error:", err);
    showError(err.message || "Failed to cancel order. Please try again.");
  } finally {
    cancelling.value[orderId] = false;
  }
}

function openOrderDetails(orderId) {
  const foundOrder = orders.value.find(
    (o) => o.orderId === orderId || o._id === orderId
  );
  if (!foundOrder) {
    showError("Order details not available.");
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
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${order.orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showSuccess("Receipt downloaded successfully!");
  } catch (err) {
    console.error("Receipt download error:", err);
    showError(err.message || "Failed to download receipt. Please try again.");
  } finally {
    loadingReceipt.value[id] = false;
  }
}

function openReviewModal(order) {
  reviewOrderId.value = order.orderId;
  reviewRating.value = 0;
  reviewComment.value = "";
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
    showError("Please select a rating before submitting your review.");
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
      showSuccess("Thank you for your feedback!");
      closeReviewModal();
    } else {
      throw new Error(res.message || "Failed to submit review");
    }
  } catch (err) {
    console.error("Review submission error:", err);
    showError(err.message || "Failed to submit review. Please try again.");
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
    showError("Please describe the issue you're experiencing.");
    return;
  }

  if (!selectedComplaintOrder.value) return;

  submittingComplaint.value = true;
  try {
    const payload = {
      fullName: user.value?.fullName || "Customer",
      email: user.value?.email || "",
      phone: user.value?.phone || "Unknown",
      order: selectedComplaintOrder.value._id,
      message: complaintMessage.value.trim(),
    };

    await createIssue(payload);
    showSuccess(
      "Your complaint has been submitted. We'll get back to you soon."
    );
    closeComplaintModal();
  } catch (err) {
    console.error("Complaint submission error:", err);
    showError(err.message || "Failed to submit complaint. Please try again.");
  } finally {
    submittingComplaint.value = false;
  }
}

// Watchers and lifecycle
watch(activeTab, () => {
  expandedOrderId.value = null;
});

onMounted(() => {
  const handleResize = () => {
    windowWidth.value = window.innerWidth;
  };

  window.addEventListener("resize", handleResize);
  fetchOrders();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Hide scrollbar for Firefox */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* Responsive improvements for extra small screens */
@media (max-width: 360px) {
  .text-xs\.5 {
    font-size: 0.7rem;
  }

  .px-2\.5 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

/* Improved focus styles for better accessibility */
button:focus-visible {
  outline: 2px solid rgba(180, 83, 9, 0.5);
  outline-offset: 2px;
}

/* Smooth transitions for all interactive elements */
button,
[role="button"],
input,
textarea,
select {
  transition: all 0.2s ease-in-out;
}

/* Improved hover states */
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
@media screen and (width <= 1030px) {
  header {
    margin-top: 50px;
  }
}
</style>
