<template>
  <section class="container mx-auto px-4 py-20">
    <h1 class="text-3xl md:text-4xl font-bold text-charcoal mb-2 md:mb-6 max-w-md">Hang Dry</h1>
    <div class="flex flex-col lg:flex-row lg:space-x-24 items-start">
      <div class="lg:w-1/2 order-last md:order-first">
        <p class="text-lg text-charcoal mb-6 max-w-md">
          The perfect service for the delicates, activewear, and other items
          that you don't want placed in the dryer.
        </p>

        <div class="space-y-6 mb-10">
          <p class="text-xl text-charcoal leading-relaxed">
            Machine-washed, hung to dry, crisply folded, and conveniently picked
            up and delivered right to your door.
          </p>
        </div>

        <div class="bg-golden-brown p-6 rounded-xl mt-8 border border-gray-200">
          <div
            class="flex justify-between items-center py-2 border-b border-gray-200"
          >
            <span class="text-lg text-bone-white">Undergarments</span>
            <span class="text-lg font-semibold text-bone-white">$1.50</span>
          </div>
          <div
            class="flex justify-between items-center py-2 border-b border-gray-200"
          >
            <span class="text-lg text-bone-white">Shirt</span>
            <span class="text-lg font-semibold text-bone-white">$4.95</span>
          </div>
          <div
            class="flex justify-between items-center py-2 border-b border-gray-200"
          >
            <span class="text-lg text-bone-white">Synthetics / Activewear</span>
            <span class="text-lg font-semibold text-bone-white">$4.95</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-lg text-bone-white">All other items</span>
            <span class="text-lg font-semibold text-bone-white">$6.95</span>
          </div>
        </div>
      </div>

      <div class="lg:w-1/2 mt-10 lg:mt-0 mb-12 md:mb-0 flex justify-center lg:justify-end order-first md:order-last">
        <div
          class="w-full max-w-lg lg:w-[600px] h-full lg:h-[400px] rounded-xl overflow-hidden"
        >
          <img
            src="@/assets/images/laundryImages/laundry-15.jpeg"
            alt="Hang and Dry Image"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
  <fee-section />
  <delivery-section />
  <section class="container mx-auto px-4 py-16">
    <AdCard :image-src="AdvertImg">
      <template #text>
        Leave your dry cleaning to the experts and save 3+ hours per week.
      </template>
      <template #button>
        <base-button padding="py-4 px-8">Book pickup</base-button>
      </template>
    </AdCard>
  </section>
</template>

<script setup>
import FeeSection from "@/components/FeeSection.vue";
import DeliverySection from "@/components/DeliverySection.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import AdCard from "@/components/atoms/AdCard.vue";
import AdvertImage from "@/assets/images/laundryImages/laundry-16.jpeg";

const AdvertImg = AdvertImage;
</script>
