<template>
  <div class="space-y-8">
    <h2
      class="text-3xl font-bold text-charcoal"
      style="font-family: 'Bricolage Grotesque', sans-serif"
    >
      Dashboard Overview
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard
        title="Total Orders"
        value="1,200"
        icon="fa-solid fa-box"
        color="bg-charcoal"
      />
      <SummaryCard
        title="Pending Pickups"
        value="45"
        icon="fa-solid fa-clock"
        color="bg-golden-brown"
      />
      <SummaryCard
        title="New Employees"
        value="3"
        icon="fa-solid fa-user-plus"
        color="bg-navy-blue"
      />

      <SummaryCard
        title="Total Issues"
        value="12"
        icon="fa-solid fa-triangle-exclamation"
        color="bg-pure-gold"
      />

      <SummaryCard
        title="Total Reviews"
        :value="reviewSummary.totalReviews"
        icon="fa-solid fa-comment-dots"
        color="bg-navy-blue"
      />

      <SummaryCard
        title="Average Ratings"
        :value="reviewSummary.averageRating"
        icon="fa-solid fa-star-half-stroke"
        color="bg-charcoal"
      />
    </div>

    <div class="bg-bone-white p-6 rounded-xl">
      <h3 class="text-2xl font-semibold text-charcoal mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <router-link
          :to="{ name: 'AdminEmployeeCreate' }"
          class="p-4 bg-cream rounded-lg text-center border border-transparent hover:border-golden-brown transition-border"
        >
          <font-awesome-icon
            icon="fa-solid fa-user-plus"
            class="text-3xl mb-2 text-navy-blue"
          />
          <p class="font-medium text-navy-blue">Create Employee</p>
        </router-link>
        <router-link
          :to="{ name: 'AdminCouponManager' }"
          class="p-4 bg-cream rounded-lg text-center border border-transparent hover:border-golden-brown transition-border"
        >
          <font-awesome-icon
            icon="fa-solid fa-tag"
            class="text-3xl mb-2 text-navy-blue"
          />
          <p class="font-medium text-navy-blue">Manage Coupons</p>
        </router-link>
        <router-link
          :to="{ name: 'ManageOrders' }"
          class="p-4 bg-cream rounded-lg text-center border border-transparent hover:border-golden-brown transition-border"
        >
          <font-awesome-icon
            icon="fa-solid fa-truck-ramp-box"
            class="text-3xl mb-2 text-navy-blue"
          />
          <p class="font-medium text-navy-blue">Update Order Status</p>
        </router-link>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl">
      <h3 class="text-2xl font-semibold text-charcoal mb-4">Recent Orders</h3>
      <p class="text-gray-500">Table of recent orders will go here...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SummaryCard from "@/components/admin/SummaryCard.vue";


import { getReviewSummary } from "@/services/api.js";

const reviewSummary = ref({
  averageRating: "...", 
  totalReviews: "...", 
});

const fetchReviewSummary = async () => {
  try {
    const data = await getReviewSummary();

    // The authorizedFetch returns the parsed JSON body on success
    if (data && data.success) {
      reviewSummary.value.totalReviews = data.totalReviews.toLocaleString();

      // Format average rating to one decimal place, or 'N/A' if 0
      reviewSummary.value.averageRating = data.averageRating
        ? parseFloat(data.averageRating).toFixed(1)
        : "0.0";
    } else {
      // Handle success: false from the backend
      console.error("Failed to fetch review summary: success false");
      reviewSummary.value.totalReviews = "Error";
      reviewSummary.value.averageRating = "Error";
    }
  } catch (error) {
    // Handle network errors or errors thrown by authorizedFetch
    console.error("Error fetching review summary:", error);
    reviewSummary.value.totalReviews = "Error";
    reviewSummary.value.averageRating = "Error";
  }
};

onMounted(() => {
  fetchReviewSummary();
});
</script>