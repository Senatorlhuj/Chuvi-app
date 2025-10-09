<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
    style="background-color: rgba(0, 0, 0, 0.8)"
    @click.self="closeModal"
  >
    <Transition name="slide-up">
      <div
        v-if="isVisible"
        class="bg-bone-white rounded-lg shadow-2xl max-w-sm w-full relative transform transition-all duration-300 scale-100"
      >
        <div class="w-full">
          <img
            src="@/assets/images/laundryImages/laundry-6.jpeg"
            alt="Discount Offer"
            class="w-full h-48 object-cover"
            style="
              border-top-left-radius: 0.5rem;
              border-top-right-radius: 0.5rem;
            "
          />
        </div>

        <button
          @click="closeModal"
          class="absolute top-3 right-3 z-10 text-bone-white hover:text-cream transition-colors duration-200 cursor-pointer"
          aria-label="Close modal"
        >
          <font-awesome-icon icon="times" class="w-6 h-6" />
        </button>

        <div class="p-6 md:p-8 text-center space-y-4">
          <h2
            class="text-2xl font-bold text-charcoal"
            :style="{ fontFamily: '--font-display' }"
          >
            Get <span class="text-golden-brown">₦500</span> Off your first
            order!
          </h2>

          <form @submit.prevent="claimCredit" class="space-y-4">
            <input
              type="email"
              v-model="email"
              placeholder="Enter your email address"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address (e.g., user@example.com)"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-golden-brown focus:border-golden-brown text-charcoal placeholder-gray-500"
            />

            <button
              type="submit"
              :disabled="isFormInvalid"
              class="w-full bg-navy-blue text-bone-white py-3 rounded-lg font-semibold uppercase tracking-wider transition-colors duration-300 cursor-pointer"
              :class="{
                'hover:bg-golden-brown': !isFormInvalid,
                'opacity-50 cursor-not-allowed': isFormInvalid,
              }"
            >
              Claim your ₦500 credit
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, defineEmits, computed } from "vue"; 

const emit = defineEmits(["close", "signup"]);
const email = ref("");
const isVisible = ref(true);
const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const isFormInvalid = computed(() => {
  return email.value === "" || !emailRegex.test(email.value);
});

const closeModal = () => {
  isVisible.value = false;
  emit("close");
};

const claimCredit = () => {
  
  if (email.value && emailRegex.test(email.value)) {
    emit("signup", email.value);
    console.log(`Email captured: ${email.value}`);
    closeModal();
  }
};
</script>

<style>
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>