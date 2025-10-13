<template>
  <section
    class="min-h-screen bg-bone-white py-32 px-4 md:px-8 lg:px-16 opacity-0 translate-y-10 transition-all duration-700 ease-out"
    ref="pageSection"
  >
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold text-charcoal mb-8 text-center">
        Terms & Privacy
      </h1>

      <p class="text-lg text-charcoal mb-4">
        We collect only what we need to serve you (name, phone, address, order notes). Bookings through WhatsApp or our form are stored securely; we do not sell your data. You can request deletion anytime by messaging us on WhatsApp. If we use analytics cookies, they help us improve the site.
      </p>

      <p class="text-sm text-muted-foreground mt-6">
        Terms updated: September 2025
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const pageSection = ref(null);

onMounted(() => {
  if (pageSection.value) {
    setTimeout(() => {
      pageSection.value.classList.remove("opacity-0", "translate-y-10");
      pageSection.value.classList.add("opacity-100", "translate-y-0");
    }, 100);
  }
});
</script>
