<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <div class="bg-charcoal text-bone-white p-6 sm:p-8 md:p-10 ">
      <div class="max-w-7xl mx-auto">
        <h1 
          class="text-4xl sm:text-5xl font-bold mb-2"
          style="font-family: 'Bricolage Grotesque', sans-serif"
        >
          Dashboard Overview
        </h1>
        <p class="text-bone-white opacity-80 text-sm sm:text-base">Welcome back! Here's your business at a glance</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      <!-- Primary Metrics Row -->
      <section>
        <h2 class="text-lg sm:text-xl font-semibold text-charcoal mb-4 flex items-center gap-2">
          <font-awesome-icon icon="fa-solid fa-chart-bar" class="text-golden-brown" />
          Order Metrics
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <SummaryCard
            title="Total Orders"
            :value="orderTotals.totalOrders"
            icon="fa-solid fa-box"
            color="bg-charcoal"
          />
          <SummaryCard
            title="Pending Orders"
            :value="orderTotals.pendingOrders"
            icon="fa-solid fa-clock"
            color="bg-golden-brown"
          />
          <SummaryCard
            title="Orders In Progress"
            :value="orderTotals.inProgressOrders"
            icon="fa-solid fa-truck-moving"
            color="bg-pure-gold text-charcoal"
          />
        </div>
      </section>

      <!-- Secondary Metrics Row -->
      <section>
        <h2 class="text-lg sm:text-xl font-semibold text-charcoal mb-4 flex items-center gap-2">
          <font-awesome-icon icon="fa-solid fa-chart-line" class="text-golden-brown" />
          Engagement & Issues
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <SummaryCard
            title="Avg. Rating"
            :value="reviewSummary.averageRating"
            icon="fa-solid fa-star-half-stroke"
            color="bg-navy-blue"
          />
          <SummaryCard
            title="Total Reviews"
            :value="reviewSummary.totalReviews"
            icon="fa-solid fa-comment-dots"
            color="bg-[#797979]"
          />
          <SummaryCard
            title="Open Issues"
            :value="issueStats.open"
            icon="fa-solid fa-triangle-exclamation"
            color="bg-red-600"
          />
        </div>
      </section>

      <!-- Quick Actions Section -->
      <section class="bg-[#f6f6f6]  rounded-2xl p-6 sm:p-8 ">
        <h3 class="text-2xl sm:text-3xl font-semibold text-charcoal mb-6 flex items-center gap-2">
          <font-awesome-icon icon="fa-solid fa-bolt" class="text-golden-brown" />
          Quick Actions
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <router-link
            :to="{ name: 'AdminEmployeeCreate' }"
            class="group p-6 bg-golden-brown rounded-xl border-2 border-transparent hover:border-golden-brown transition-all duration-300  active:scale-95 cursor-pointer"
          >
            <div class="flex flex-col items-center text-center">
              <font-awesome-icon icon="fa-solid fa-user-plus" class="text-3xl text-bone-white group-hover:text-pure-gold mb-3 transition-colors duration-300" />
              <p class="font-semibold text-bone-white group-hover:text-pure-gold transition-colors duration-300">Create Employee</p>
            </div>
          </router-link>

          <router-link
            :to="{ name: 'AdminCouponManager' }"
            class="group p-6 bg-golden-brown rounded-xl border-2 border-transparent hover:border-golden-brown transition-all duration-300  active:scale-95 cursor-pointer"
          >
            <div class="flex flex-col items-center text-center">
              <font-awesome-icon icon="fa-solid fa-tag" class="text-3xl text-bone-white group-hover:text-pure-gold mb-3 transition-colors duration-300" />
              <p class="font-semibold text-bone-white group-hover:text-pure-gold transition-colors duration-300">Manage Coupons</p>
            </div>
          </router-link>

          <router-link
            :to="{ name: 'ManageOrders' }"
            class="group p-6 bg-golden-brown rounded-xl border-2 border-transparent hover:border-golden-brown transition-all duration-300  active:scale-95 cursor-pointer"
          >
            <div class="flex flex-col items-center text-center">
              <font-awesome-icon icon="fa-solid fa-truck-ramp-box" class="text-3xl text-bone-white group-hover:text-pure-gold mb-3 transition-colors duration-300" />
              <p class="font-semibold text-bone-white group-hover:text-pure-gold transition-colors duration-300">Update Order Status</p>
            </div>
          </router-link>
        </div>
      </section>

      <!-- Stats Summary Footer -->
      <section class="bg-[#242424] rounded-2xl p-6 sm:p-8 text-bone-white ">
        <h3 class="text-xl font-semibold mb-6 flex items-center gap-2">
          <font-awesome-icon icon="fa-solid fa-list-check" class="text-golden-brown" />
          Summary
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div class="border-l-4 border-golden-brown pl-4">
            <p class="text-bone-white opacity-80 text-sm mb-1">Total Orders</p>
            <p class="text-3xl sm:text-4xl font-bold">{{ orderTotals.totalOrders }}</p>
          </div>
          <div class="border-l-4 border-pure-gold pl-4">
            <p class="text-bone-white opacity-80 text-sm mb-1">Total Issues</p>
            <p class="text-3xl sm:text-4xl font-bold">{{ issueStats.total }}</p>
          </div>
          <div class="border-l-4 border-golden-brown pl-4">
            <p class="text-bone-white opacity-80 text-sm mb-1">Customer Rating</p>
            <p class="text-3xl sm:text-4xl font-bold">{{ reviewSummary.averageRating }}<span class="text-xl">/5</span></p>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SummaryCard from "@/components/admin/SummaryCard.vue";

import { 
  getReviewSummary, 
  getOrdersTotalAdmin, 
  getIssueStats 
} from "@/services/api.js";

// State Management
const orderTotals = ref({
  totalOrders: "...",
  pendingOrders: "...",
  inProgressOrders: "...",
});

const issueStats = ref({
  total: "...",
  open: "...",
  resolved: "...",
});

const reviewSummary = ref({
  averageRating: "...", 
  totalReviews: "...", 
});

// Data Fetching Logic
const fetchOrderTotals = async () => {
  try {
    const data = await getOrdersTotalAdmin();
    if (data) {
      orderTotals.value.totalOrders = data.total?.toLocaleString() || "0";
      orderTotals.value.pendingOrders = data.pending?.toLocaleString() || "0"; 
      orderTotals.value.inProgressOrders = data.inProgress?.toLocaleString() || "0";
    }
  } catch (error) {
    console.error("Error fetching order totals:", error);
    orderTotals.value.totalOrders = "Error";
    orderTotals.value.pendingOrders = "Error";
    orderTotals.value.inProgressOrders = "Error";
  }
};

const fetchIssueStats = async () => {
  try {
    const data = await getIssueStats();
    issueStats.value.total = data.total?.toLocaleString() || "0";
    issueStats.value.open = data.open?.toLocaleString() || "0";
    issueStats.value.resolved = data.resolved?.toLocaleString() || "0";
  } catch (error) {
    console.error("Error fetching issue stats:", error);
    issueStats.value.total = "Error";
    issueStats.value.open = "Error";
    issueStats.value.resolved = "Error";
  }
};

const fetchReviewSummary = async () => {
  try {
    const data = await getReviewSummary();
    if (data) {
      reviewSummary.value.totalReviews = data.totalReviews?.toLocaleString() || "0";
      reviewSummary.value.averageRating = data.averageRating
        ? parseFloat(data.averageRating).toFixed(1)
        : "0.0";
    }
  } catch (error) {
    console.error("Error fetching review summary:", error);
    reviewSummary.value.totalReviews = "Error";
    reviewSummary.value.averageRating = "Error";
  }
};

// Lifecycle Hook
onMounted(() => {
  fetchOrderTotals();
  fetchIssueStats();
  fetchReviewSummary();
});
</script>

<style scoped>
/* Tailwind color utilities */
.bg-navy-blue {
  @apply bg-[#00022e];
}

.bg-golden-brown {
  @apply bg-[#996515];
}

.bg-charcoal {
  @apply bg-[#302e2d];
}

.bg-pure-gold {
  @apply bg-[#e5b80b];
}

.bg-cream {
  @apply bg-[#fdfbd4];
}

.bg-bone-white {
  @apply bg-[#f6f4f1];
}

.text-charcoal {
  @apply text-[#302e2d];
}

.text-bone-white {
  @apply text-[#f6f4f1];
}

.text-golden-brown {
  @apply text-[#996515];
}

.text-pure-gold {
  @apply text-[#e5b80b];
}

.border-golden-brown {
  @apply border-[#996515];
}

.border-charcoal {
  @apply border-[#302e2d];
}
</style>