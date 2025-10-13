<template>
  <section ref="gallerySection" class="py-8 bg-charcoal opacity-0">
    <div class="infinite-scroll-container overflow-hidden space-y-6">
      <!-- Row 1 -->
      <div class="infinite-scroll-row scroll-left" ref="row1">
        <div
          v-for="(img, index) in images1"
          :key="`row1-${index}`"
          class="image-wrapper flex-shrink-0 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mx-auto"
        >
          <img :src="img.src" :alt="img.alt" class="w-full h-auto object-cover" />
        </div>
      </div>

      <!-- Row 2 -->
      <div class="infinite-scroll-row scroll-right" ref="row2">
        <div
          v-for="(img, index) in images2"
          :key="`row2-${index}`"
          class="image-wrapper flex-shrink-0 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mx-auto"
        >
          <img :src="img.src" :alt="img.alt" class="w-full h-auto object-cover" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Image imports
import img1 from "@/assets/images/laundryImages/laundry-1.jpeg";
import img2 from "@/assets/images/laundryImages/laundry-2.webp";
import img3 from "@/assets/images/laundryImages/laundry-3.jpg";
import img4 from "@/assets/images/laundryImages/laundry-4.jpeg";
import img5 from "@/assets/images/laundryImages/laundry-18.jpg";
import img6 from "@/assets/images/laundryImages/laundry-6.jpeg";
import img7 from "@/assets/images/laundryImages/laundry-7.jpeg";
import img8 from "@/assets/images/laundryImages/laundry-8.jpeg";
import img9 from "@/assets/images/laundryImages/laundry-22.jpg";
import img10 from "@/assets/images/laundryImages/laundry-16.jpeg";

const images1 = ref([
  { src: img1, alt: "Laundry Image 1" },
  { src: img2, alt: "Laundry Image 2" },
  { src: img3, alt: "Laundry Image 3" },
  { src: img4, alt: "Laundry Image 4" },
  { src: img5, alt: "Laundry Image 5" },
]);

const images2 = ref([
  { src: img6, alt: "Laundry Image 6" },
  { src: img7, alt: "Laundry Image 7" },
  { src: img8, alt: "Laundry Image 8" },
  { src: img9, alt: "Laundry Image 9" },
  { src: img10, alt: "Laundry Image 10" },
]);

const row1 = ref(null);
const row2 = ref(null);
const gallerySection = ref(null);

// Infinite scroll setup
const setupInfiniteScroll = (rowElement) => {
  if (!rowElement) return;

  const originalContent = Array.from(rowElement.children);
  const containerWidth = rowElement.offsetWidth;
  let currentContentWidth = 0;

  // Clone content until it's at least twice container width
  while (currentContentWidth < containerWidth * 2) {
    originalContent.forEach((node) => {
      const clone = node.cloneNode(true);
      rowElement.appendChild(clone);
      currentContentWidth += node.offsetWidth;
    });
  }
};

onMounted(() => {
  setupInfiniteScroll(row1.value);
  setupInfiniteScroll(row2.value);

  // Rebuild on resize
  const handleResize = () => {
    if (row1.value) row1.value.innerHTML = "";
    if (row2.value) row2.value.innerHTML = "";
    setupInfiniteScroll(row1.value);
    setupInfiniteScroll(row2.value);
  };
  window.addEventListener("resize", handleResize);

  // Fade-up reveal animation
  gsap.fromTo(
    gallerySection.value,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: gallerySection.value,
        start: "top 85%",
      },
    }
  );

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });
});
</script>

<style scoped>
.infinite-scroll-row {
  display: flex;
  white-space: nowrap;
  gap: 1.5rem;
}

/* Left and right scroll keyframes */
@keyframes scroll-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@keyframes scroll-right {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}

.scroll-left {
  animation: scroll-left 40s linear infinite;
}

.scroll-right {
  animation: scroll-right 40s linear infinite;
}

.image-wrapper img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 0.75rem;
}

/* Responsive tweaks */
@media (min-width: 640px) {
  .image-wrapper img {
    height: 150px;
  }
}
@media (min-width: 768px) {
  .image-wrapper img {
    height: 180px;
  }
}
@media (min-width: 1024px) {
  .image-wrapper img {
    height: 200px;
  }
}
</style>
