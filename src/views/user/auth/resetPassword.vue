<template>
  <div class="flex items-center justify-center min-h-screen bg-cream p-4">
    <div
      class="w-full max-w-lg  p-8 rounded-2xl "
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
        Reset Password
      </h2>
      <p class="text-center text-charcoal mb-4">
        Enter your details to set a new password.
      </p>


      <form @submit.prevent="handleResetPassword" class="space-y-5">
        <FormField
          label="Phone Number"
          type="tel"
          v-model="resetData.phone"
          placeholder="e.g., 090XXXXXXXX"
          required
        />

        <FormField
          label="Verification Code"
          type="text"
          v-model="resetData.code"
          placeholder="The 6-digit code sent to you"
          required
        />

        <FormField
          label="New Password"
          type="password"
          v-model="resetData.newPassword"
          placeholder="Enter a new strong password"
          required
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-navy-blue text-bone-white py-3 mt-4 rounded-md font-semibold text-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
        >
          {{ loading ? "Updating..." : "Reset Password" }}
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
import { resetPassword } from "@/services/api.js";
import { useToast } from "@/composables/useToast";

const { showSuccess, showError } = useToast();
const router = useRouter();

// --- STATE ---
const initialResetData = {
  phone: "",
  code: "",
  newPassword: "",
};
const resetData = ref({ ...initialResetData });
const loading = ref(false);

// --- HANDLER ---
const handleResetPassword = async () => {
  loading.value = true;

  try {
    // API Call to reset password
    const response = await resetPassword({
        phone: resetData.value.phone,
        code: resetData.value.code,
        password: resetData.value.newPassword, // API expects 'password'
    });

    if (response && response.success) {
      showSuccess(`Password successfully reset! Please log in with your new password.`);

      // ⭐ IMPLEMENT NAVIGATION TO LOGIN PAGE ⭐
      router.push({ name: 'Login' }); // REPLACE 'Login' with your actual login route name!
      
      // We don't need to reset the form here since we are navigating away.

    } else {
      showError(response.message || "Password reset failed. Check your code and phone number.");
    }
  } catch (err) {
    console.error("Reset password error:", err);
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