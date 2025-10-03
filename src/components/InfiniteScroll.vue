<template>
  <section class="py-8 bg-charcoal">
    <div class="infinite-scroll-container overflow-hidden space-y-6">
      <div class="infinite-scroll-row scroll-left" ref="row1">
        <div v-for="(img, index) in images1" :key="`row1-${index}`" class="image-wrapper flex-shrink-0 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mx-auto">
          <img :src="img.src" :alt="img.alt" class="w-full h-auto object-cover" />
        </div>
      </div>

      <div class="infinite-scroll-row scroll-right" ref="row2">
        <div v-for="(img, index) in images2" :key="`row2-${index}`" class="image-wrapper flex-shrink-0 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mx-auto">
          <img :src="img.src" :alt="img.alt" class="w-full h-auto object-cover" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Replace with your actual image paths
import img1 from '@/assets/images/laundryImages/laundry-1.jpeg';
import img2 from '@/assets/images/laundryImages/laundry-2.webp';
import img3 from '@/assets/images/laundryImages/laundry-3.jpg';
import img4 from '@/assets/images/laundryImages/laundry-4.jpeg';
import img5 from '@/assets/images/laundryImages/laundry-18.jpg';
import img6 from '@/assets/images/laundryImages/laundry-6.jpeg';
import img7 from '@/assets/images/laundryImages/laundry-7.jpeg';
import img8 from '@/assets/images/laundryImages/laundry-8.jpeg';
import img9 from '@/assets/images/laundryImages/laundry-22.jpg';
import img10 from '@/assets/images/laundryImages/laundry-16.jpeg';


const images1 = ref([
  { src: img1, alt: 'Laundry Image 1' },
  { src: img2, alt: 'Laundry Image 2' },
  { src: img3, alt: 'Laundry Image 3' },
  { src: img4, alt: 'Laundry Image 4' },
  { src: img5, alt: 'Laundry Image 5' },
]);

const images2 = ref([
  { src: img6, alt: 'Laundry Image 6' },
  { src: img7, alt: 'Laundry Image 7' },
  { src: img8, alt: 'Laundry Image 8' },
  { src: img9, alt: 'Laundry Image 9' },
  { src: img10, alt: 'Laundry Image 10' },
]);

const row1 = ref(null);
const row2 = ref(null);

const setupInfiniteScroll = (rowElement) => {
  if (!rowElement) return;

  const originalContent = Array.from(rowElement.children);
  const containerWidth = rowElement.offsetWidth;
  let currentContentWidth = 0;

  // Append clones until the content is at least twice the container width
  while (currentContentWidth < containerWidth * 2) {
    originalContent.forEach(node => {
      const clone = node.cloneNode(true);
      rowElement.appendChild(clone);
      currentContentWidth += node.offsetWidth;
    });
  }
};

onMounted(() => {
  setupInfiniteScroll(row1.value);
  setupInfiniteScroll(row2.value);

  // Re-setup on window resize to adjust for responsive changes
  window.addEventListener('resize', () => {
    // Clear existing content and re-setup
    if (row1.value) row1.value.innerHTML = '';
    if (row2.value) row2.value.innerHTML = '';
    setupInfiniteScroll(row1.value);
    setupInfiniteScroll(row2.value);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    // Clean up event listener
  });
});
</script>

<style scoped>
.infinite-scroll-row {
  display: flex;
  white-space: nowrap; /* Prevent items from wrapping */
  gap: 1.5rem; /* Equivalent to Tailwind's gap-6 */
}

/* Define keyframes for left-to-right scroll */
@keyframes scroll-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%); /* Scroll by half the content width */
  }
}

/* Define keyframes for right-to-left scroll */
@keyframes scroll-right {
  from {
    transform: translateX(-50%); /* Start from half the content width */
  }
  to {
    transform: translateX(0);
  }
}

.scroll-left {
  animation: scroll-left 40s linear infinite; /* Adjust duration for speed */
}

.scroll-right {
  animation: scroll-right 40s linear infinite; /* Adjust duration for speed */
}

.image-wrapper img {
  width: 100%;
  height: 120px; /* Base height for mobile and small screens */
  object-fit: cover;
  border-radius: 0.5rem; /* Optional: adds slight rounded corners to images */
}

/* Responsive adjustments for image height and gap on larger screens */
@media (min-width: 640px) { /* sm breakpoint */
  .image-wrapper img {
    height: 150px;
  }
  .infinite-scroll-row {
    gap: 1.5rem; /* Adjust gap for medium screens if desired */
  }
}

@media (min-width: 768px) { /* md breakpoint */
  .image-wrapper img {
    height: 180px;
  }
  .infinite-scroll-row {
    gap: 2rem; /* Adjust gap for medium screens if desired */
  }
}

@media (min-width: 1024px) { /* lg breakpoint */
  .image-wrapper img {
    height: 200px;
  }
  .infinite-scroll-row {
    gap: 2.5rem; /* Adjust gap for large screens if desired */
  }
}
</style>