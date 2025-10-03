<template>
  <div class="flex items-center justify-center min-h-screen  p-4">
    <div
      class="w-full max-w-lg bg-bone-white p-8 rounded-2xl "
    >

     <div class="text-center mb-8">
        <div class="inline-block bg-navy-blue rounded-full p-3 ">
          <img
            src="@/assets/images/logo/chuvi-logo-icon.png"
            alt="Chuvi Brand Logo"
            class="h-12 w-12"
          />
        </div>
      </div>
      <h2
        class="text-3xl font-bold text-navy-blue text-center mb-2"
        :style="{ fontFamily: '--font-display' }"
      >
        Resend Verification Code
      </h2>
      <p class="text-center text-charcoal mb-4">
        Enter your phone number to receive a new verification code.
      </p>

     

      <form @submit.prevent="handleResendCode" class="space-y-5">
        <FormField
          label="Phone Number"
          type="tel"
          v-model="phoneData.phone"
          placeholder="e.g., 090XXXXXXXX"
          required
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-navy-blue text-bone-white py-3 mt-4 rounded-md font-semibold text-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
        >
          {{ loading ? "Sending..." : "Resend Code" }}
        </button>
      </form>

      <div class="mt-6 text-center text-charcoal">
        <router-link
          to="/login"
          class="text-golden-brown hover:underline font-medium"
        >
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import FormField from "@/components/atoms/FormField.vue";
import { resendCode } from "@/services/api.js";
import { useToast } from "@/composables/useToast";

const { showSuccess, showError } = useToast();
const router = useRouter();

// --- STATE ---
const phoneData = ref({
  phone: "",
});
const loading = ref(false);

// --- HANDLER ---
const handleResendCode = async () => {
  loading.value = true;

  try {
    // API Call to resend the code
    const response = await resendCode(phoneData.value);

    if (response && response.success) {
      showSuccess(`A new verification code has been sent to **${phoneData.value.phone}**.`);

      // Navigate to the verification page, passing the phone number
      router.push({
        name: 'VerifyPhone', // Assuming 'VerifyPhone' is your route name
        query: { phone: phoneData.value.phone }
      });
      
    } else {
      showError(response.message || "Failed to send new code. Please check the phone number.");
    }
  } catch (err) {
    console.error("Resend code error:", err);
    let apiError = "An unknown error occurred.";
    try {
      const parsed = JSON.parse(err.message);
      apiError = parsed.message || parsed.error || err.message;
    } catch (e) {
      apiError = err.message || apiError;
    }
    showError(`Operation Failed: ${apiError}`);
  } finally {
    loading.value = false;
  }
};
</script>