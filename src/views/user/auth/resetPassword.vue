<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-lg p-8 rounded-2xl">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-block bg-navy-blue rounded-full p-3">
          <img
            src="@/assets/images/logo/chuvi-logo-icon.png"
            alt="Chuvi Brand Logo"
            class="h-12 w-12"
          />
        </div>
      </div>

      <!-- Title -->
      <h2
        class="text-3xl font-bold text-navy-blue text-center mb-2"
        :style="{ fontFamily: '--font-display' }"
      >
        Reset Password
      </h2>
      <p class="text-center text-charcoal mb-4">
        Enter your phone number and set a new password.
      </p>

      <!-- Form -->
      <form @submit.prevent="handleResetPassword" class="space-y-5">
        <FormField
          label="Phone Number"
          type="tel"
          v-model="resetData.phone"
          placeholder="e.g., 090XXXXXXXX"
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

// ✅ Get showToast from composable
const { showToast } = useToast();
const router = useRouter();

// --- STATE ---
const resetData = ref({
  phone: "",
  newPassword: "",
});

const loading = ref(false);

// --- HANDLER ---
const handleResetPassword = async () => {
  loading.value = true;

  try {
    const response = await resetPassword({
      phone: resetData.value.phone,
      newPassword: resetData.value.newPassword,
    });

    if (response && response.message === "Password reset successfully") {
      showToast("Password successfully reset! Please log in with your new password.", "success");
      router.push({ name: "Login" });
    } else {
      showToast(response.error || "Password reset failed. Please check your phone number.", "error");
    }
  } catch (err) {
    console.error("Reset password error:", err);
    showToast("Operation Failed: " + (err.message || "An unknown error occurred."), "error");
  } finally {
    loading.value = false;
  }
};
</script>
