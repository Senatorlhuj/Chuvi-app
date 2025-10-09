<template>
  <div class="space-y-6 p-6">
    <h1 class="text-3xl font-bold text-navy-blue mb-6 border-b pb-2">
      Customer Reviews
    </h1>

    <div v-if="loading" class="text-center p-12 text-golden-brown">
      <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin text-4xl mb-2" />
      <p class="text-lg">Loading reviews...</p>
    </div>

    <div v-else-if="error" class="bg-destructive-foreground p-4 rounded-md text-destructive">
      <p class="font-medium">Error loading reviews: {{ error }}</p>
      <p>Please check the API server status.</p>
    </div>

    <div v-else-if="reviews.length === 0" class="bg-cream p-6 rounded-lg text-center text-navy-blue">
      <font-awesome-icon icon="fa-solid fa-bell-slash" class="text-4xl mb-3" />
      <p class="font-medium">No reviews found yet.</p>
    </div>

    <div v-else class="bg-bone-white rounded-xl shadow-lg overflow-hidden border border-border">
      <table class="min-w-full divide-y divide-border">
        <thead class="bg-navy-blue text-cream">
          <tr>
            <th class="py-3 px-6 text-left text-sm font-medium tracking-wider w-1/5">
              User / Contact
            </th>
            <th class="py-3 px-6 text-center text-sm font-medium tracking-wider w-1/12">
              Rating
            </th>
            <th class="py-3 px-6 text-left text-sm font-medium tracking-wider w-3/5">
              Review
            </th>
            <th class="py-3 px-6 text-left text-sm font-medium tracking-wider w-1/12">
              Date
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border text-charcoal">
          <tr v-for="review in reviews" :key="review.id" class="hover:bg-cream transition duration-150">
            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium">
              <div class="font-semibold">{{ review.user.username || 'N/A' }}</div>
              <div class="text-xs text-muted-foreground">{{ review.user.phone || review.user.email }}</div>
            </td>
            <td class="py-4 px-6 text-center whitespace-nowrap text-sm">
              <span class="text-pure-gold">
                <font-awesome-icon icon="fa-solid fa-star" v-for="n in Math.floor(review.rating)" :key="n" />
              </span>
              <span class="text-muted-foreground ml-1 text-xs">({{ review.rating.toFixed(1) }})</span>
            </td>
            <td class="py-4 px-6 text-sm max-w-lg">
              {{ review.text || review.comment || 'No comment provided.' }}
            </td>
            <td class="py-4 px-6 whitespace-nowrap text-xs text-muted-foreground">
              {{ formatDate(review.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAdminAllReviews } from '@/services/api.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar, faSpinner, faBellSlash } from '@fortawesome/free-solid-svg-icons';

// Add necessary local icons to the library (assuming main.js hasn't added faStar, faSpinner, faBellSlash)
library.add(faStar, faSpinner, faBellSlash);

const reviews = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchReviews = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await getAdminAllReviews();
    if (data && Array.isArray(data)) {
      reviews.value = data;
    } else {
      // Handle case where API returns a non-array response but no error was thrown
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

.font-bold { font-weight: 700; } /* Tailwind default */
.text-3xl { font-size: 1.875rem; } /* Tailwind default */

</style>