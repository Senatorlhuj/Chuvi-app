<template>
  <a
    :href="whatsAppLink"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    class="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 bg-green-500 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
  >
    <font-awesome-icon :icon="['fab', 'whatsapp']" class="text-3xl" />
  </a>
</template>

<script setup>
import { computed } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
library.add(faWhatsapp);

// Replace this number with your WhatsApp Business number (in international format)
const phoneNumber = "+2349022354740"; // e.g. Nigeria +234...
const defaultMessage = "Hello! I’d like to make a laundry booking.";
const whatsAppLink = computed(() => {
  const encodedMessage = encodeURIComponent(defaultMessage);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
});
</script>
