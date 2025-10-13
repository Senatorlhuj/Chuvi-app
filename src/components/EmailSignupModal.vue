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
            class="w-full h-48 object-cover rounded-t-lg"
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
          <h2 class="text-2xl font-bold text-charcoal">
            Get <span class="text-golden-brown">₦500</span> Off your first
            order!
          </h2>

          <form @submit.prevent="claimCredit" class="space-y-4">
            <input
              type="email"
              v-model="email"
              placeholder="Enter your email address"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-golden-brown focus:border-golden-brown text-charcoal placeholder-gray-500"
            />

            <button
              type="submit"
              :disabled="loading || isFormInvalid"
              class="w-full bg-navy-blue text-bone-white py-3 rounded-lg font-semibold uppercase tracking-wider transition-colors duration-300 cursor-pointer"
              :class="{
                'hover:bg-golden-brown': !isFormInvalid && !loading,
                'opacity-50 cursor-not-allowed': loading || isFormInvalid,
              }"
            >
              <span v-if="loading">Submitting...</span>
              <span v-else>Claim your ₦500 credit</span>
            </button>
          </form>

          <p v-if="message" :class="messageClass" class="text-sm mt-2">
            {{ message }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { subscribeToNewsletter } from "@/services/api.js";

const email = ref("");
const isVisible = ref(false);
const message = ref("");
const loading = ref(false);

const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const isFormInvalid = computed(() => email.value === "" || !emailRegex.test(email.value));

const messageClass = computed(() =>
  message.value.includes("success") ? "text-green-500" : "text-red-500"
);

function showModal() {
  isVisible.value = true;
}

function closeModal() {
  isVisible.value = false;
  localStorage.setItem("chuvi_subscribed", "true"); // ✅ remember user action
}

async function claimCredit() {
  if (isFormInvalid.value) return;

  loading.value = true;
  message.value = "";

  try {
    const res = await subscribeToNewsletter({ email: email.value });
    message.value = res.message || "Subscribed successfully!";
    localStorage.setItem("chuvi_subscribed", "true"); // ✅ mark as subscribed
    email.value = "";

    // Close after success
    setTimeout(() => closeModal(), 2000);
  } catch (err) {
    message.value = err.message || "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // 🔍 Check if user already subscribed or closed modal before
  const hasSubscribed = localStorage.getItem("chuvi_subscribed");
  if (!hasSubscribed) {
    // Optional: delay popup a few seconds after page load
    setTimeout(() => {
      showModal();
    }, 4000);
  }
});
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
