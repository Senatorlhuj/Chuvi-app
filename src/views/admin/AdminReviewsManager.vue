<template>
  <div class="min-h-screen p-4 md:p-8" style="background-color: #F5F1ED;">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold mb-2" style="color: #1A3A52;">
          Customer Reviews
        </h1>
        <!-- <div class="h-1 w-16" style="background-color: #1A3A52;"></div> -->
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin text-5xl mb-4" style="color: #8B7355;" />
        <p class="text-lg" style="color: #8B7355;">Loading reviews...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-6 rounded-lg border-l-4" style="background-color: #FEF2F2; border-color: #DC2626;">
        <p class="font-medium" style="color: #DC2626;">Error loading reviews: {{ error }}</p>
        <p style="color: #DC2626;">Please check the API server status.</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="reviews.length === 0" class="flex flex-col items-center justify-center py-16 rounded-lg" style="background-color: #F9F7F4;">
        <font-awesome-icon icon="fa-solid fa-bell-slash" class="text-5xl mb-4" style="color: #1A3A52;" />
        <p class="text-lg font-medium" style="color: #1A3A52;">No reviews found yet.</p>
      </div>

      <!-- Reviews Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        <div
          v-for="review in reviews"
          :key="review?._id"
          class="rounded-xl  p-6 border"
          style="background-color: #FFFBF7; border-color: #E5DDD5;"
        >
          <!-- Top Section: User Info & Rating -->
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div class="flex-1">
              <h3 class="font-semibold text-lg" style="color: #2C3E50;">
                {{ review.user?.fullName || 'N/A' }}
              </h3>
              <p class="text-sm mt-1" style="color: #6B7280;">
                {{ review.user?.phone || review.user?.email || 'N/A' }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex gap-1">
                <font-awesome-icon
                  icon="fa-solid fa-star"
                  v-for="n in Math.floor(review?.rating)"
                  :key="n"
                  style="color: #D4A574;"
                />
              </div>
              <span class="text-sm font-medium" style="color: #6B7280;">
                {{ review.rating.toFixed(1) }}
              </span>
            </div>
          </div>

          <!-- Review Comment -->
          <p class="text-base leading-relaxed mb-4" style="color: #374151;">
            {{ review.comment || 'No comment provided.' }}
          </p>

          <!-- Date -->
          <div class="pt-3 border-t" style="border-color: #E5DDD5;">
            <p class="text-xs" style="color: #9CA3AF;">
              {{ formatDate(review.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAdminAllReviews } from '@/services/api.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar, faSpinner, faBellSlash } from '@fortawesome/free-solid-svg-icons';

library.add(faStar, faSpinner, faBellSlash);

const reviews = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchReviews = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await getAdminAllReviews();
    if (data && Array.isArray(data.reviews)) {
      reviews.value = data.reviews;
    } else {
      reviews.value = [];
    }
  } catch (err) {
    console.error('API Fetch Error:', err);
    error.value = err.message || 'Unknown network error.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(() => {
  fetchReviews();
});
</script>

<style scoped>
.font-bold { font-weight: 700; }
.text-3xl { font-size: 1.875rem; }

@media (max-width: 768px) {
  .text-3xl { font-size: 1.5rem; }
}
</style>