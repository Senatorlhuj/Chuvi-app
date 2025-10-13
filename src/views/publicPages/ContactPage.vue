<template>
  <section id="contact" class="relative bg-bone-white py-32 overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden opacity-5">
      <div
        class="absolute top-0 left-0 w-72 h-72 bg-pure-gold rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-golden-brown rounded-full blur-3xl"
      ></div>
    </div>

    <div class="relative z-10 container mx-auto px-6 max-w-6xl space-y-20">
      <!-- Header -->
      <div
        id="contact-header"
        data-animate
        :class="isVisible['contact-header'] ? 'visible' : ''"
        class="text-center space-y-4"
      >
        <h2
          class="text-4xl md:text-5xl font-extrabold text-charcoal tracking-tight"
        >
          CONTACT & HOURS
        </h2>
        <p class="text-lg md:text-xl text-charcoal/80">Reach Us Anytime</p>
      </div>

      <!-- Contact Info -->
      <div
        id="contact-info"
        data-animate
        :class="isVisible['contact-info'] ? 'visible' : ''"
        class="grid md:grid-cols-2 gap-10 bg-white rounded-3xl p-10 border border-charcoal/10 "
      >
        <div class="space-y-6">
          <h3 class="text-2xl font-bold text-golden-brown">Get In Touch</h3>
          <div class="flex items-center space-x-4">
            <font-awesome-icon
              icon="phone"
              class="text-golden-brown text-2xl"
            />
            <a
              href="tel:+2349022354740"
              target="_blank"
              class="text-charcoal hover:text-golden-brown transition-colors duration-300 text-lg font-medium"
            >
              09022354740
            </a>
          </div>

          <div class="flex items-center space-x-4">
            <font-awesome-icon
              icon="envelope"
              class="text-golden-brown text-2xl"
            />
            <a
              href="mailto:Hello@Chuvilaundry.com"
              class="text-charcoal hover:text-golden-brown transition-colors duration-300 text-lg font-medium"
            >
              Hello@Chuvilaundry.com
            </a>
          </div>

          <div class="flex items-start space-x-4">
            <font-awesome-icon
              icon="map-marker-alt"
              class="text-golden-brown text-2xl mt-1"
            />
            <p class="text-charcoal/80 leading-relaxed text-base md:text-lg">
              <span class="font-semibold text-charcoal">Address:</span><br />
              Okwute's Compound, Obeagu Road, Nneogidi Village, Agulu.<br />
              Near School of Pharmacy, Agulu.
            </p>
          </div>

          <div class="flex items-start space-x-4">
            <font-awesome-icon
              icon="clock"
              class="text-golden-brown text-2xl mt-1"
            />
            <p class="text-charcoal/80 leading-relaxed text-base md:text-lg">
              <span class="font-semibold text-charcoal">Opening Hours:</span
              ><br />
              Mon–Sat:
              <span class="text-golden-brown font-semibold"
                >9:00 AM – 6:00 PM</span
              ><br />
              (Closed on Sundays)
            </p>
          </div>
        </div>

        <!-- Map Embed -->
        <div
          class="rounded-2xl overflow-hidden border border-golden-brown/30 h-[350px]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.XXXX!2d7.0XXXX!3d6.0XXXX!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xXXXXXXXX!2sAgulu!5e0!3m2!1sen!2sng!4vXXXXXXXXXXXX"
            width="100%"
            height="100%"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <!-- Info & Service Areas -->
      <div
        id="contact-extra"
        data-animate
        :class="isVisible['contact-extra'] ? 'visible' : ''"
        class="bg-charcoal/5 rounded-3xl p-10 border border-charcoal/10 space-y-6 text-center"
      >
        <p
          class="text-charcoal/80 leading-relaxed text-base md:text-lg max-w-3xl mx-auto"
        >
          If there’s
          <span class="font-semibold text-golden-brown">heavy rain</span> or
          <span class="font-semibold text-golden-brown">grid downtime</span>,
          we’ll post a quick site banner and WhatsApp update.
        </p>

        <div>
          <h3 class="text-2xl font-bold text-golden-brown mb-2">
            Service Areas
          </h3>
          <p class="text-charcoal/80 text-lg">
            Agulu, Nise, Adaezi, and nearby towns around Agulu.
          </p>
        </div>

        <!-- Social Media -->
        <div class="space-y-3">
          <h3 class="text-2xl font-bold text-golden-brown">Follow Us</h3>
          <div class="flex items-center justify-center space-x-6">
            <a
              href="https://www.facebook.com/share/1GeYiqdZjg/?mibextid=wwXIfr"
              target="_blank"
              aria-label="Facebook"
              class="text-charcoal hover:text-pure-gold transition-colors duration-300 text-2xl"
            >
              <font-awesome-icon :icon="['fab', 'facebook']" />
            </a>

            <a
              href="https://www.instagram.com/chuvi_laundryservices?igsh=MXVnOWF4OXRuMWEzdA%3D%3D&utm_source=qr"
              target="_blank"
              aria-label="Instagram"
              class="text-charcoal hover:text-pure-gold transition-colors duration-300 text-2xl"
            >
              <font-awesome-icon :icon="['fab', 'instagram']" />
            </a>

            <a
              href="https://www.tiktok.com/@chuvi_laundry_services"
              target="_blank"
              aria-label="TikTok"
              class="text-charcoal hover:text-pure-gold transition-colors duration-300 text-2xl"
            >
              <font-awesome-icon :icon="['fab', 'tiktok']" class="text-2xl" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";

library.add(
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faClock,
  faInstagram,
  faFacebook
);

const isVisible = ref({});

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value[entry.target.id] = true;
        }
      });
    },
    { threshold: 0.2 }
  );

  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => observer.observe(el));
  onBeforeUnmount(() => observer.disconnect());
});
</script>

<style scoped>
[data-animate] {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}
[data-animate].visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
