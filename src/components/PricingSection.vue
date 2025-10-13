<template>
  <section class="bg-bone-white min-h-screen py-12 px-4 md:px-8 lg:px-16">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-extrabold text-charcoal mb-12 text-center">
       Our Pricing
      </h2>

      <!-- Skeleton Loading -->
      <div v-if="isLoading" class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="n in 6"
          :key="n"
          class="animate-pulse bg-white rounded-2xl p-6  space-y-4"
        >
          <div class="h-40 bg-gray-200 rounded-xl"></div>
          <div class="h-6 bg-gray-300 rounded w-3/4"></div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div class="h-10 bg-gray-300 rounded w-full mt-4"></div>
        </div>
      </div>

      <!-- Pricing Cards with Fade-In -->
      <div v-else class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <PricingCard
          v-for="(service, index) in services"
          :key="service._id"
          :title="service.name"
          :image="getImageForService(service.code)"
          class="opacity-0 transform translate-y-8 animate-fadeIn"
          :style="{ animationDelay: `${index * 150}ms` }"
        >
          <template v-slot:items>
            <PricingItem
              v-for="tier in service.pricings"
              :key="tier._id"
              :name="tier.serviceTier"
              :price="formatPrice(tier.pricePerItem)"
            />
          </template>
        </PricingCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PricingCard from '@/components/atoms/PricingCard.vue';
import PricingItem from '@/components/atoms/PricingItem.vue';
import { getAllServicesCatalog } from '@/services/api';

const services = ref([]);
const isLoading = ref(true);

// Fetch backend data
onMounted(async () => {
  try {
    const data = await getAllServicesCatalog();
    services.value = data;
  } catch (err) {
    console.error('Error fetching services catalog:', err);
  } finally {
    isLoading.value = false;
  }
});

// Format price helper
const formatPrice = (price) => `₦${price.toLocaleString()}`;

// Map service codes to images
const images = import.meta.glob('/src/assets/images/laundryImages/*.{jpg,jpeg,png,svg}', { eager: true });
const getImageForService = (code) => {
  const mapping = {
    SHIRT: 'laundry-top.jpeg',
    TROUSER: 'laundry-bottom.jpg',
    SIMPLE_DRESS: 'laundry-fullbody.jpg',
    NATIVE: 'laundry-fullbody.jpg',
    JEANS: 'laundry-bottom.jpg',
    BEDSHEET: 'laundry-house-hold.jpeg',
    PILLOWCASE: 'laundry-accessories.jpeg',
    DUVET: 'laundry-house-hold.jpeg',
    AGBADA: 'laundry-fullbody.jpg'
  };
  const fileName = mapping[code] || 'laundry-generic.jpg';
  const imagePath = `/src/assets/images/laundryImages/${fileName}`;
  return images[imagePath]?.default || '';
};
</script>

<style scoped>
.bg-bone-white {
  background-color: var(--color-bone-white);
}

/* Subtle fade-up animation for cards */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s forwards;
}
</style>
