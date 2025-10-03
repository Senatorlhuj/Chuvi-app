<template>
  <section class="offer-banner py-16 md:py-24 bg-cream relative overflow-hidden">
    <div class="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
      <p class="text-md md:text-xl uppercase tracking-widest text-charcoal mb-4 font-bold">
        Schedule Today To
      </p>
      <h2 class="text-3xl md:text-4xl lg:text-6xl font-black text-charcoal leading-tight mb-2">
        Get <span class="text-golden-brown">₦500 off</span>
      </h2>
      <h2 class="text-3xl md:text-4xl lg:text-6xl font-black text-golden-brown leading-tight mb-12">
        your first-time order
      </h2>
      <router-link to="/register">
         <button
        class="bg-golden-brown offer-button py-4 px-6 rounded-full font-bold text-cream text-lg shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:scale-105"
      >
        Ready to try us? Book a Pickup

      </button>
      </router-link>
     
    </div>
  </section>
</template>