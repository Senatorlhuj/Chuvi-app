<template>
  <section
    class="min-h-screen bg-bone-white py-16 lg:py-32 px-4 md:px-8 lg:px-16 opacity-0 translate-y-10 transition-all duration-700 ease-out"
    ref="pageSection"
  >
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold text-charcoal mb-8 text-center">
        Care & Compensation Policy
      </h1>

      <p class="text-lg text-charcoal mb-4">
        We handle every item with professional care. If something is damaged while in our custody, we will:
      </p>

      <ol class="list-decimal list-inside text-lg text-charcoal space-y-3 mb-6">
        <li>Attempt expert restoration; if that’s not feasible,</li>
        <li>Offer reasonable compensation (considering age/condition with a capped market-value reference); or</li>
        <li>Provide service credit you approve.</li>
      </ol>

      <p class="text-lg text-charcoal">
        Please report concerns within <b>48 hours</b> of delivery with photos and your order ID.
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
