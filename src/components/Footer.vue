<template>
  <footer class="bg-charcoal text-bone-white font-sans py-12 px-6 md:px-16">
    <div
      class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
    >
      <div class="flex flex-col items-start lg:col-span-1">
        <div class="flex items-center space-x-2 mb-4">
          <img
            src="@/assets/images/logo/chuvi-logo.png"
            alt="Company Logo"
            class="h-10 w-auto text-golden-brown"
          />
        </div>
        <p class="text-sm leading-relaxed mb-4">
         Laundry that's not just clean but cared for.
        </p>

        <div class="flex space-x-4">
          <a
            href="https://www.facebook.com/share/1GeYiqdZjg/?mibextid=wwXIfr"
            target="_blank"
            aria-label="Facebook"
            class="text-bone-white hover:text-golden-brown transition-colors duration-300"
          >
            <font-awesome-icon :icon="['fab', 'facebook']" class="text-2xl" />
          </a>
          <a
            href="https://www.instagram.com/chuvi_laundryservices?igsh=MXVnOWF4OXRuMWEzdA%3D%3D&utm_source=qr"
            target="_blank"
            aria-label="Instagram"
            class="text-bone-white hover:text-golden-brown transition-colors duration-300"
          >
            <font-awesome-icon :icon="['fab', 'instagram']" class="text-2xl" />
          </a>
          <a
            href="www.tiktok.com/@chuvi_laundry_services"
            target="_blank"
            aria-label="TikTok"
            class="text-bone-white hover:text-golden-brown transition-colors duration-300"
          >
            <font-awesome-icon :icon="['fab', 'tiktok']" class="text-2xl" />
          </a>
        </div>
      </div>

      <div class="lg:col-span-1">
        <h3 class="text-xl font-semibold mb-4 text-cream ">
          Contact
        </h3>
        <ul class="space-y-2 text-sm text-bone-white">
          <li>
            <a
              href="tel:+1234567890"
              class="flex items-center hover:text-golden-brown transition-colors duration-300"
            >
              <font-awesome-icon
                :icon="['fas', 'phone-volume']"
                class="w-4 mr-2"
              />
              09022354740
            </a>
          </li>
          <li>
            <a
              href=" Hello@Chuvilaundry.com"
              class="flex items-center hover:text-golden-brown transition-colors duration-300"
            >
              <font-awesome-icon :icon="['fas', 'envelope']" class="w-4 mr-2" />
              Hello@Chuvilaundry.com
            </a>
          </li>
          <li class="flex items-start">
            <font-awesome-icon
              :icon="['fas', 'location-dot']"
              class="w-4 mr-2 mt-1"
            />
            <span class="max-w-xs">
              Okwute's Compound Obeagu road nneogidi village Agulu. Near school
              of pharmacy Agulu.</span
            >
          </li>
        </ul>
      </div>

      <div class="lg:col-span-1">
        <h3 class="text-xl font-semibold mb-4 text-cream">Quick Links</h3>
        <ul class="space-y-2 text-sm text-bone-white">
          <li>
            <a
              href="#"
              class="hover:text-golden-brown transition-colors duration-300"
              >Home</a
            >
          </li>
          <li>
            <a
              href="#"
              class="hover:text-golden-brown transition-colors duration-300"
              >Our Services</a
            >
          </li>
          <li>
            <a
              href="#"
              class="hover:text-golden-brown transition-colors duration-300"
              >Pricing</a
            >
          </li>
          <li>
            <a
              href="#"
              class="hover:text-golden-brown transition-colors duration-300"
              >How it Works</a
            >
          </li>
          <li>
            <a
              href="#"
              class="hover:text-golden-brown transition-colors duration-300"
              >About</a
            >
          </li>
        </ul>
      </div>

      <div class="lg:col-span-1">
        <h3 class="text-xl font-semibold mb-4 text-cream">Subscribe</h3>
        <p class="text-sm text-bone-white mb-4">
          Get digital marketing updates in your mailbox.
        </p>
        <form action="#" method="POST" class="flex flex-col space-y-4">
          <div class="relative">
            <font-awesome-icon
              :icon="['fas', 'at']"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="email"
              placeholder="Enter your email"
              class="w-full px-4 py-2 pl-9 rounded-md bg-muted text-foreground placeholder-muted-foreground border border-input focus:outline-none focus:ring-2 focus:ring-golden-brown"
              aria-label="Email address for subscription"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-golden-brown text-bone-white font-bold py-2 rounded-md hover:bg-pure-gold transition-colors duration-300 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <font-awesome-icon :icon="['fas', 'paper-plane']" />
            <span>Subscribe</span>
          </button>
        </form>
      </div>
    </div>

    <hr class="border-t border-border mt-12 mb-6 mx-auto max-w-7xl" />

    <div
      class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left text-xs text-muted-foreground"
    >
      <p class="mb-2 md:mb-0">&copy; 2025 Company Name. All Rights Reserved.</p>
      <a href="#" class="hover:underline">Terms & Privacy Policy</a>
    </div>
  </footer>
</template>

<script setup></script>
