<template>
  <section class="py-16 md:py-24 bg-bone-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-charcoal mb-4">
        How It Works
      </h2>
      <p class="text-lg md:text-xl text-charcoal/80 mb-12 max-w-2xl mx-auto">
        Get your laundry and dry cleaning done in a snap!
      </p>

      <div class="flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 md:space-x-12 lg:space-x-20">
        <div class="flex flex-col items-center max-w-xs p-4">
          <div class="w-24 h-24 mb-4 flex items-center justify-center">
            <img src="@/assets/images/laundryImages/book.png" alt="Book Icon" class="max-h-full max-w-full object-contain">
          </div>
          <h3 class="text-xl font-bold text-charcoal mb-2">Book Your Service</h3>
          <p class="text-charcoal/70 text-sm md:text-base leading-relaxed">
          Book on WhatsApp (or fill the form) with your address/landmark and preferred time.
          </p>
        </div>

        <div class="hidden md:block text-pure-gold/50">
          <font-awesome-icon icon="arrow-right" class="text-4xl" />
        </div>

        <div class="md:hidden text-pure-gold/50">
          <font-awesome-icon icon="arrow-down" class="text-4xl" />
        </div>

        <div class="flex flex-col items-center max-w-xs p-4">
          <div class="w-24 h-24 mb-4 flex items-center justify-center">
            <img src="@/assets/images/laundryImages/process-order.png" alt="Pickup Icon" class="max-h-full max-w-full object-contain">
          </div>
          <h3 class="text-xl font-bold text-charcoal mb-2">Processing Order</h3>
          <p class="text-charcoal/70 text-sm md:text-base leading-relaxed">
          We tag and process your order, then send a ready-notice.
          </p>
        </div>

        <div class="hidden md:block text-pure-gold/50">
          <font-awesome-icon icon="arrow-right" class="text-4xl" />
        </div>

        <div class="md:hidden text-pure-gold/50">
          <font-awesome-icon icon="arrow-down" class="text-4xl" />
        </div>

        <div class="flex flex-col items-center max-w-xs p-4">
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
        class="mt-12 bg-golden-brown text-white py-3 px-8 text-lg font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
      >
       Book a pickup
      </button>
        </router-link>
     
    </div>
  </section>
</template>

<script setup>
// Assuming you have Font Awesome imported globally or within a parent component
// If not, you might need to import specific icons:
import { faArrowRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

// Add the icons to the library if not already done
library.add(faArrowRight, faArrowDown);

// Placeholder images for the steps.
// You would replace these with your actual image paths.
// Make sure to create these paths if they don't exist.
import bookIcon from '@/assets/images/laundryImages/book.png'; // This would be the "Book" icon
import pickupIcon from '@/assets/images/laundryImages/process-order.png'; // This would be the "Pickup" icon
import deliveryIcon from '@/assets/images/laundryImages/delivery.png'; // This would be the "Delivery" icon

// You might need to make these reactive if they change, but for static content, this is fine
const steps = [
  { icon: bookIcon, title: 'Book Your Service', description: 'Schedule a convenient pickup time online or through our app for your wash & fold or dry cleaning needs.' },
  { icon: pickupIcon, title: 'Effortless Pickup', description: 'Our friendly valet will collect your items right from your doorstep at your scheduled time.' },
  { icon: deliveryIcon, title: 'Fresh Delivery', description: 'Receive your perfectly cleaned and freshly folded/pressed clothes back at your door.' },
];
</script>

<style scoped>
/* No specific styles needed beyond Tailwind classes for this section */
</style>