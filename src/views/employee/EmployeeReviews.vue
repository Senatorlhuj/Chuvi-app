<template>
  <div class="space-y-6 p-6">
    <h1 class="text-3xl font-bold text-navy-blue mb-6 border-b pb-2">
      All Reviews
    </h1>

    <!-- Loading State -->
    <div v-if="reviewStore.loading" class="text-center p-12 text-golden-brown">
      <font-awesome-icon
        icon="fa-solid fa-spinner"
        class="fa-spin text-4xl mb-2"
      />
      <p class="text-lg">Loading reviews...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="reviewStore.error"
      class="bg-destructive-foreground p-4 rounded-md text-destructive"
    >
      <p class="font-medium">Error loading reviews: {{ reviewStore.error }}</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="reviewStore.reviews.length === 0"
      class="bg-cream p-6 rounded-lg text-center text-navy-blue"
    >
      <font-awesome-icon
        icon="fa-solid fa-bell-slash"
        class="text-4xl mb-3"
      />
      <p class="font-medium">No reviews have been submitted yet.</p>
    </div>

    <!-- Reviews List -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="review in reviewStore.reviews"
        :key="review.id"
        class="bg-bone-white rounded-xl shadow-md border border-border p-4 hover:shadow-lg transition duration-200"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-navy-blue">
            {{ review.user?.username || "Anonymous" }}
          </h3>
          <div class="flex items-center text-pure-gold">
            <font-awesome-icon
              icon="fa-solid fa-star"
              v-for="n in Math.floor(review.rating)"
              :key="n"
            />
            <span class="text-muted-foreground ml-1 text-xs"
              >({{ review.rating.toFixed(1) }})</span
            >
          </div>
        </div>

        <p class="text-charcoal text-sm mb-2">
          {{ review.text || review.comment || "No comment provided." }}
        </p>

        <p class="text-xs text-muted-foreground text-right">
          {{ formatDate(review.createdAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useReviewStore } from "@/stores/reviews.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faStar,
  faSpinner,
  faBellSlash,
} from "@fortawesome/free-solid-svg-icons";

// Add local icons if needed
library.add(faStar, faSpinner, faBellSlash);

const reviewStore = useReviewStore();

// Fetch on mount if not already loaded
onMounted(() => {
  if (reviewStore.reviews.length === 0) {
    reviewStore.fetchReviews();
  }
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
.text-3xl {
  font-size: 1.875rem;
  font-weight: 700;
}
</style>
