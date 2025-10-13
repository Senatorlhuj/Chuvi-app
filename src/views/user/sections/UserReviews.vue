<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
    <h2 class="text-xl font-semibold mb-4">Leave a Review</h2>

    <!-- Star Rating -->
    <div class="flex items-center mb-4">
      <span
        v-for="starIndex in 5"
        :key="starIndex"
        class="cursor-pointer text-2xl relative"
        @mousemove="updateHover($event, starIndex)"
        @mouseleave="hoverRating = 0"
        @click="setRating($event, starIndex)"
      >
        <!-- Full star -->
        <fa
          :icon="['fas', 'star']"
          class="text-yellow-400 absolute top-0 left-0"
          v-if="starValue(starIndex) >= 1"
        />
        <!-- Half star -->
        <fa
          :icon="['fas', 'star-half-alt']"
          class="text-yellow-400 absolute top-0 left-0"
          v-else-if="starValue(starIndex) === 0.5"
        />
        <!-- Empty star -->
        <fa
          :icon="['far', 'star']"
          class="text-yellow-400"
          v-else
        />
      </span>
    </div>

    <!-- Comment -->
    <textarea
      v-model="comment"
      placeholder="Write your review..."
      class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring focus:ring-indigo-300"
      rows="4"
    ></textarea>

    <!-- Submit Button -->
    <button
      @click="submitReview"
      :disabled="submitting"
      class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
    >
      {{ submitting ? 'Submitting...' : 'Submit Review' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createReview } from '@/services/api';
import { useToast, showSuccess, showError } from '@/composables/useToast';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';

defineProps({
  orderId: {
    type: String,
    required: true
  }
});

const rating = ref(0);          // current rating
const hoverRating = ref(0);     // hovered value
const comment = ref('');
const submitting = ref(false);

// Use the toast system
const { toasts } = useToast();

/**
 * Calculate the star value for display (full, half, empty)
 * @param {number} starIndex
 * @returns 0 | 0.5 | 1
 */
function starValue(starIndex) {
  const value = hoverRating.value || rating.value;
  if (value >= starIndex) return 1;
  if (value + 0.5 === starIndex) return 0.5;
  return 0;
}

/**
 * Handle hover to show half/full star
 */
function updateHover(event, starIndex) {
  const { offsetX, target } = event;
  const width = target.offsetWidth;
  hoverRating.value = offsetX < width / 2 ? starIndex - 0.5 : starIndex;
}

/**
 * Set rating on click
 */
function setRating(event, starIndex) {
  const { offsetX, target } = event;
  const width = target.offsetWidth;
  rating.value = offsetX < width / 2 ? starIndex - 0.5 : starIndex;
}

/**
 * Submit review
 */
async function submitReview() {
  if (rating.value === 0) {
    showError('Please select a rating.');
    return;
  }

  submitting.value = true;

  try {
    const payload = {
      order: orderId,
      rating: rating.value,
      comment: comment.value
    };

    const res = await createReview(payload);

    if (res.success) {
      showSuccess('Review submitted successfully!');
      rating.value = 0;
      comment.value = '';
    } else {
      showError(res.message || 'Failed to submit review.');
    }
  } catch (err) {
    console.error(err);
    showError('An error occurred. Please try again.');
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
/* Optional hover scale for stars */
span:hover {
  transform: scale(1.2);
  transition: transform 0.2s;
}
</style>
