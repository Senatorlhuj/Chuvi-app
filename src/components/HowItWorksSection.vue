<template>
  <section class="py-16 md:py-24 bg-bone-white">
    <div class="container mx-auto px-4 text-center">
      
      <div ref="headerRef">
        <h2 class="text-3xl md:text-4xl font-bold text-charcoal mb-4">
          How It Works
        </h2>
        <p class="text-lg md:text-xl text-charcoal/80 mb-12 max-w-2xl mx-auto">
          Get your laundry and dry cleaning done in a snap!
        </p>
      </div>

      <div class="flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 md:space-x-12 lg:space-x-20">
        
        <div ref="step1" class="flex flex-col items-center max-w-xs p-4">
          <div class="w-24 h-24 mb-4 flex items-center justify-center">
            <img src="@/assets/images/laundryImages/book.png" alt="Book Icon" class="max-h-full max-w-full object-contain">
          </div>
          <h3 class="text-xl font-bold text-charcoal mb-2">Book Your Service</h3>
          <p class="text-charcoal/70 text-sm md:text-base leading-relaxed">
            Book on WhatsApp (or fill the form) with your address/landmark and preferred time.
          </p>
        </div>

        <div ref="arrow1" class="hidden md:block text-pure-gold/50">
          <font-awesome-icon icon="arrow-right" class="text-4xl" />
        </div>
        <div class="md:hidden text-pure-gold/50">
          <font-awesome-icon icon="arrow-down" class="text-4xl" />
        </div>

        <div ref="step2" class="flex flex-col items-center max-w-xs p-4">
          <div class="w-24 h-24 mb-4 flex items-center justify-center">
            <img src="@/assets/images/laundryImages/process-order.png" alt="Pickup Icon" class="max-h-full max-w-full object-contain">
          </div>
          <h3 class="text-xl font-bold text-charcoal mb-2">Processing Order</h3>
          <p class="text-charcoal/70 text-sm md:text-base leading-relaxed">
            We tag and process your order, then send a ready-notice.
          </p>
        </div>

        <div ref="arrow2" class="hidden md:block text-pure-gold/50">
          <font-awesome-icon icon="arrow-right" class="text-4xl" />
        </div>
        <div class="md:hidden text-pure-gold/50">
          <font-awesome-icon icon="arrow-down" class="text-4xl" />
        </div>

        <div ref="step3" class="flex flex-col items-center max-w-xs p-4">
          <div class="w-24 h-24 mb-4 flex items-center justify-center">
            <img src="@/assets/images/laundryImages/delivery.png" alt="Delivery Icon" class="max-h-full max-w-full object-contain">
          </div>
          <h3 class="text-xl font-bold text-charcoal mb-2">Fast Delivery</h3>
          <p class="text-charcoal/70 text-sm md:text-base leading-relaxed">
            We deliver and you confirm your items. Pay by transfer, POS, or cash.
          </p>
        </div>
      </div>

      <router-link to="/register">
        <button
          ref="buttonRef"
          class="mt-12 bg-golden-brown text-white py-3 px-8 text-lg font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
        >
          Book a pickup
        </button>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal'; 
import { faArrowRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faArrowRight, faArrowDown);

const headerRef = ref(null);
const step1 = ref(null);
const step2 = ref(null);
const step3 = ref(null);
const arrow1 = ref(null);
const arrow2 = ref(null);
const buttonRef = ref(null);
useScrollReveal(headerRef, 40, "top 95%"); 
useScrollReveal(step1, 50, "top 80%"); 

useScrollReveal(arrow1, 50, "top 75%"); 
useScrollReveal(step2, 50, "top 70%"); 

useScrollReveal(arrow2, 50, "top 65%"); 
useScrollReveal(step3, 50, "top 60%"); 
useScrollReveal(buttonRef, 30, "top 90%");
</script>
