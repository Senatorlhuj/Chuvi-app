<template>
  <section class="container mx-auto px-4 py-20">
    <h1 class="text-3xl md:text-4xl font-bold text-charcoal mb-2 md:mb-6 max-w-md">Dry Cleaning</h1>
    <div class="flex flex-col lg:flex-row lg:space-x-24 items-start">
      <div class="lg:w-1/2 order-last md:order-first">
        <p class="text-lg text-charcoal mb-6 max-w-md">
          Wash & Fold is built for people who don't waste time on chores that
          don't move them forward.
        </p>

        <div class="space-y-6 mb-10">
          <p class="text-xl text-charcoal leading-relaxed">
            This is the perfect service for items you want professionally
            cleaned and returned pressed and on a hanger (this service includes
            both Dry Cleaning and Launder & Press).
          </p>
          <p class="text-xl text-charcoal leading-relaxed">
            Enjoy premium cleaning from the comfort of your home and never go to
            the dry cleaners again.
          </p>
        </div>

        <div class="mb-8 items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <base-button border-radius="rounded-md" hover-color="pure-gold" />
        </div>

        <div
          class="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm flex w-fit items-center"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            ></path>
          </svg>
          Your ₦500 off in credits will be automatically applied
        </div>
      </div>

      <div class="lg:w-1/2 mt-10 lg:mt-0 mb-12 md:mb-0 flex justify-center lg:justify-end order-first md:order-last">
        <div
          class="w-full max-w-lg lg:w-[600px] h-full lg:h-[400px] rounded-xl overflow-hidden"
        >
          <img
            src="@/assets/images/laundryImages/laundry-17.jpg"
            alt="Dry Cleaning image"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>

  <HowItWorksection />
  <pricing-section />
  <fee-section />
  <delivery-section />
  <section class="container mx-auto px-4 py-16">
    <AdCard :image-src="AdvertImg">
      <template #text>
        Leave your dry cleaning to the experts and save 3+ hours per week.
      </template>
      <template >
        <router-link to="/register">
          <base-button border-radius="rounded-md" hover-color="pure-gold">
            Get Started
          </base-button>
          
        </router-link>
      </template>
    </AdCard>
  </section>
</template>

<script setup>
import HowItWorksection from "@/components/HowItWorksSection.vue";
import PricingSection from "@/components/PricingSection.vue";
import FeeSection from "@/components/FeeSection.vue";
import DeliverySection from "@/components/DeliverySection.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import AdCard from "@/components/atoms/AdCard.vue";
import AdvertImage from "@/assets/images/laundryImages/laundry-3.jpg";

const AdvertImg = AdvertImage;
</script>
