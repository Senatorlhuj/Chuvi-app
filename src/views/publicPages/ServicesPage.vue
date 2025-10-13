<template>
  <div class=" min-h-screen">
    <div class="container mx-auto px-4 py-24 md:py-24 space-y-24">
      <ServiceSection
        title="Wash & Fold"
        description="Wash & Fold is built for people who don't waste time on chores that don't move them forward."
        :bullet-points="[
          'We pick up your laundry, clean it with care using a dedicated machine.',
          'Everything is returned neatly folded right down to pairing your socks.',
          'Clothes are washed to your preferences and delivered on your schedule.',
        ]"
        :image-src="ChuviJacket"
        alt-text="Neatly folded clothes, symbolizing the Wash & Fold service."
        button-text="Book Wash & Fold"
        :image-on-left="true"
        show-promotion
      />

      <ServiceSection
        title="Dry Cleaning"
        description="The premium service for items you want professionally cleaned, pressed, and returned on a hanger."
        :bullet-points="[
          'Perfect for suits, delicate garments, and business wear.',
          'Enjoy premium cleaning from the comfort of your home.',
          'Never go to the dry cleaners again with our pickup & delivery.',
        ]"
        :image-src="Laundry17"
        alt-text="A professional dry cleaner handling garments."
        button-text="Book Dry Cleaning"
        :image-on-left="false"
        show-promotion
      />

      <ServiceSection
        title="Ironing"
        description="Get your shirts, trousers, and linens perfectly ironed, saving you hours of meticulous work."
        :bullet-points="[
          'Professional, crisp ironing for a perfect, wrinkle-free finish.',
          'Ideal for business attire and special occasion garments.',
          'Fast turnaround to ensure you are always looking your best.',
        ]"
        :image-src="Laundry15"
        alt-text="A professional ironer working on a shirt."
        button-text="Book Ironing Service"
        :image-on-left="true"
      />

      <ServiceSection
        title="Pickup & Delivery"
        description="Our convenient door-to-door service makes managing your laundry effortless."
        :bullet-points="[
          'Schedule pickups and deliveries at your convenience via our app or website.',
          'Track your order in real-time from pickup to drop-off.',
          'Available across all our services: Wash & Fold, Dry Cleaning, and Ironing.',
        ]"
        :image-src="Laundry26"
        alt-text="Laundry bags ready for pickup."
        button-text="See Coverage Area"
        :image-on-left="false"
      />
    </div>
  </div>
   <HowItWorksSection />
   <fee-section />
  <delivery-section />
  <pricing-section />
  <section class="container mx-auto px-4 py-16">
    <AdCard :image-src="AdvertImg">
      <template #text>
        Leave your laundry to the experts and save 3+ hours per week.
      </template>
      <template #button>
        <base-button padding="py-4 px-8">Book pickup</base-button>
      </template>
    </AdCard>
  </section>
</template>

<script setup>
import ServiceSection from "@/components/ServiceSection.vue";
import HowItWorksSection from "@/components/HowItWorksSection.vue"; 
import FeeSection from "@/components/FeeSection.vue";
import DeliverySection from "@/components/DeliverySection.vue";
import PricingSection from "@/components/PricingSection.vue";
import AdCard from "@/components/atoms/AdCard.vue";
import AdvertImage from "@/assets/images/laundryImages/Banner.jpg";
import BaseButton from "@/components/atoms/BaseButton.vue";

const AdvertImg = AdvertImage;

// Import images
import ChuviJacket from "@/assets/images/laundryImages/Chuvi-jacket.jpg";
import Laundry17 from "@/assets/images/laundryImages/laundry-17.jpg";
import Laundry15 from "@/assets/images/laundryImages/laundry-15.jpeg";
import Laundry26 from "@/assets/images/laundryImages/laundry-26.JPG";
</script>
