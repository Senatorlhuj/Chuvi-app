<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-lg p-8">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-block bg-navy-blue rounded-full p-3 shadow-lg">
          <img
            src="@/assets/images/logo/chuvi-logo-icon.png"
            alt="Chuvi Brand Logo"
            class="h-12 w-12"
          />
        </div>
      </div>

      <!-- Titles -->
      <h2
        class="text-3xl font-bold text-navy-blue text-center mb-2"
        :style="{ fontFamily: '--font-display' }"
      >
        Welcome Back!
      </h2>
      <p class="text-center text-charcoal mb-4">
        Log in to your <span class="text-golden-brown font-bold">Employee</span> account.
      </p>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <FormField
          label="Phone Number"
          type="tel"
          v-model="credentials.phone"
          placeholder="e.g., 090XXXXXXXX"
          required
        />

        <FormField
          label="Password"
          type="password"
          v-model="credentials.password"
          placeholder="Your secret password"
          required
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-navy-blue text-bone-white py-3 mt-4 rounded-md font-semibold text-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
        >
          {{ loading ? "Logging In..." : "Log In" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import FormField from "@/components/atoms/FormField.vue";
import { employeeLogin } from "@/services/api.js"; 
import { useToast } from "@/composables/useToast";

const { showSuccess, showError } = useToast();
const router = useRouter();

// --- STATE ---
const credentials = ref({
  phone: "",
  password: "",
});
const loading = ref(false);

// --- LOGIN HANDLER ---
const handleLogin = async () => {
  loading.value = true;

  try {
    const response = await employeeLogin(credentials.value);
    console.log("Login response:", response);

    if (response?.success && response.token) {
      // ✅ Save session
      localStorage.setItem("employeeToken", response.token);
      localStorage.setItem("employeeData", JSON.stringify(response.user));

      showSuccess(`Welcome back, ${response.user.fullName}!`);

      // ✅ Redirect to employee dashboard
      router.push({ name: "EmployeeDashboard" });
    } else {
      showError(response.message || "Invalid phone number or password.");
    }
  } catch (err) {
    console.error("Employee login error:", err);
    showError(err.message || "Login failed. Please try again.");
  } finally {
    loading.value = false;
  }
};
</script>
