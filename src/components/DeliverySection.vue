<template>
  <section class="container mx-auto px-4 py-16">
    <h2 class="text-3xl md:text-4xl font-bold text-charcoal mb-8 text-center md:text-left animate-fadeIn">
      Delivery
    </h2>

    <div class="flex flex-col lg:flex-row lg:space-x-12 items-start">
      <!-- Text Content -->
      <div class="lg:w-1/2 order-last md:order-first animate-fadeIn delay-150">
        <p class="text-lg text-charcoal mb-6 max-w-lg">
          All pickups and deliveries are between <b>9 AM - 11 AM</b> and <b>3 PM - 5 PM</b>.
          We'll text you a 30-minute arrival window of your Valet.
        </p>

        <div class="bg-white p-6 rounded-xl border border-golden-brown/30 mt-10 ">
          <h3 class="text-xl font-bold text-charcoal mb-4">Not available in the evening? No problem!</h3>
          <p class="text-gray-500 leading-relaxed text-sm mb-6">
            After creating your account, activate Rinse Drop for personless pickup and delivery.
            Our Valet will pick up and deliver your order to your doorstep, building reception, or another place of your choosing.
          </p>

          <div class="grid grid-cols-3 gap-4 text-center mt-4">
            <div class="flex flex-col items-center animate-fadeIn delay-200">
              <div class="bg-gray-100 p-4 rounded-full w-14 h-14 mb-2 flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'door-open']" class="w-6 h-6 text-golden-brown" />
              </div>
              <span class="text-sm text-gray-700">Front Door</span>
            </div>
            <div class="flex flex-col items-center animate-fadeIn delay-300">
              <div class="bg-gray-100 p-4 rounded-full w-14 h-14 mb-2 flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'building']" class="w-6 h-6 text-golden-brown" />
              </div>
              <span class="text-sm text-gray-700">Building Reception</span>
            </div>
            <div class="flex flex-col items-center animate-fadeIn delay-400">
              <div class="bg-gray-100 p-4 rounded-full w-14 h-14 mb-2 flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="w-6 h-6 text-golden-brown" />
              </div>
              <span class="text-sm text-gray-700">Other place</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Content -->
      <div class="lg:w-1/2 mt-10 lg:mt-0 flex justify-center lg:justify-end order-first md:order-last animate-fadeIn delay-100">
        <div class="w-full max-w-lg rounded-xl overflow-hidden">
          <img
            :src="DeliveryImage"
            alt="Laundry bags on a doorstep"
            class="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import image correctly
import DeliveryImage from '@/assets/images/laundryImages/delivery-person.jpeg';
</script>

<style scoped>
/* Fade-in animation */
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
  animation: fadeIn 0.7s forwards;
}

/* Delay helpers for staggered animation */
.delay-100 { animation-delay: 0.1s; }
.delay-150 { animation-delay: 0.15s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
</style>
