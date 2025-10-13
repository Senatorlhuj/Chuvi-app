<template>
  <section
    ref="sectionRef"
    :class="[
      'flex flex-col lg:flex-row gap-8 md:gap-12 items-center transition-all duration-700 ease-out',
      !imageOnLeft ? 'lg:flex-row-reverse' : '',
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    ]"
  >
    <!-- Image -->
    <div class="w-full lg:w-1/2 rounded-xl overflow-hidden relative min-h-[250px] md:min-h-[350px]">
      <img
        :src="imageSrc"
        :alt="altText"
        class="w-full h-full object-cover rounded-xl"
      />
    </div>

    <!-- Content -->
    <div class="w-full lg:w-1/2 flex justify-center">
      <div class="bg-bone-white p-6 md:p-10  rounded-xl max-w-full lg:max-w-[90%]">
        <h2 class="text-2xl md:text-3xl font-bold text-charcoal mb-4">{{ title }}</h2>
        <p class="text-base md:text-lg text-charcoal mb-6">{{ description }}</p>

        <ul class="space-y-2 mb-6 list-disc list-inside text-charcoal">
          <li v-for="(point, index) in bulletPoints" :key="index">{{ point }}</li>
        </ul>

        <BaseButton
          v-if="buttonText"
          border-radius="rounded-md"
          hover-color="pure-gold"
          class="bg-navy-blue text-cream w-full md:w-auto"
        >
          {{ buttonText }}
        </BaseButton>

        <div
          v-if="showPromotion"
          class="mt-6 bg-cream text-navy-blue px-4 py-3 rounded-lg text-sm flex items-center border border-golden-brown/50"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          Your ₦500 off in credits will be automatically applied
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BaseButton from "@/components/atoms/BaseButton.vue";

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  bulletPoints: { type: Array, default: () => [] },
  imageSrc: { type: String, required: true },
  altText: { type: String, required: true },
  buttonText: { type: String, default: "Book Now" },
  imageOnLeft: { type: Boolean, default: true },
  showPromotion: { type: Boolean, default: false },
});

const sectionRef = ref(null);
const visible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.value = true;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  if (sectionRef.value) observer.observe(sectionRef.value);
});
</script>
