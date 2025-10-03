<template>
  <section class="container mx-auto px-4 py-16">
    <h2 class="text-3xl md:text-4xl  font-bold text-charcoal mb-2 md:mb-6">Delivery</h2>
    <div class="flex flex-col lg:flex-row lg:space-x-12 items-start">
      
      <div class="lg:w-1/2 order-last md:order-first">
        
        
        <p class="text-lg text-charcoal mb-6 max-w-lg">
          All pickups and deliveries are between <b>9 AM - 11 AM</b> and <b>3 PM - 5 PM</b>.
         We'll text you a 30-minute arrival window of your Valet.
        </p>
        
        <div class="bg-white p-6 rounded-xl  border border-gray-200 mt-10">
          <h3 class="text-xl font-bold text-charcoal mb-4">Not available in the evening? No problem!</h3>
          <p class="text-gray-500 leading-relaxed text-sm mb-6">
            After creating your account, activate Rinse Drop for personless pickup and delivery. Our Valet will pick up and deliver your order to your doorstep, building reception, or another place of your choosing.
          </p>
          
          <div class="flex justify-between items-start space-x-4 text-center">
            <div class="flex-1">
              <div class="bg-gray-100 p-4 rounded-full w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'door-open']" class="w-6 h-6 text-golden-brown" />
              </div>
              <span class="text-sm text-gray-700">Front Door</span>
            </div>
            <div class="flex-1">
              <div class="bg-gray-100 p-4 rounded-full w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'building']" class="w-6 h-6 text-golden-brown" />
              </div>
              <span class="text-sm text-gray-700">Building Reception</span>
            </div>
            <div class="flex-1">
              <div class="bg-gray-100 p-4 rounded-full w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="w-6 h-6 text-golden-brown" />
              </div>
              <span class="text-sm text-gray-700">Other place</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="lg:w-1/2 mt-10 lg:mt-0 flex justify-center lg:justify-end order-first md:order-last">
        <div class="w-full max-w-lg rounded-xl overflow-hidden shadow-xl mb-12 md:mb-0">
          <img
            src="@/assets/images/laundryImages/delivery-person.jpeg"
            alt="Laundry bags on a doorstep"
            class="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  </section>
</template>