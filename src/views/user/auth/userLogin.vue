<template>
  <div class="flex items-center justify-center min-h-screen  p-4">
    <div
      class="w-full max-w-lg  p-8"
    >
      <!-- Logo Section -->
      <div class="text-center mb-8">
        <div class="inline-block bg-navy-blue rounded-full p-3 shadow-lg">
          <!-- Using an image from your provided template -->
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
        Log in to access your <span class="text-golden-brown font-bold">Chuvi</span> account.
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

        <div class="text-right pt-1">
          <router-link
            :to="{ name: 'ResetPassword' }"
            class="text-golden-brown hover:underline text-sm font-medium"
          >
            Forgot Password?
          </router-link>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-navy-blue text-bone-white py-3 mt-4 rounded-md font-semibold text-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
        >
          {{ loading ? "Logging In..." : "Log In" }}
        </button>
      </form>

      <!-- Register Link -->
      <div class="mt-6 text-center text-charcoal">
        Don't have an account?
        <router-link
          :to="{ name: 'Register' }"
          class="text-golden-brown hover:underline font-medium"
        >
          Sign Up
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import FormField from "@/components/atoms/FormField.vue";
import { login } from "@/services/api.js";
import { useToast } from "@/composables/useToast";

const { showSuccess, showError } = useToast();
const router = useRouter();

// --- STATE ---
const initialCredentials = {
  phone: "",
  password: "",
};
const credentials = ref({ ...initialCredentials });
const loading = ref(false);

// --- HANDLER ---
const handleLogin = async () => {
  loading.value = true;

  try {
    const response = await login(credentials.value);

    if (response && response.token) {
      showSuccess(`Welcome back! You are now logged in.`);
      
      // Store token (or handle user session initialization)
      localStorage.setItem('userToken', response.token); 

      // Redirect to 'Dashboard', which resolves to the UserProfile route: /user
      router.push({ name: 'BookPickup' }); 
      
    } else {
      showError(response.message || "Login failed. Check your phone number and password.");
    }
  } catch (err) {
    console.error("Login error:", err);
    let apiError = "An unknown error occurred during login.";
    try {
      const parsed = JSON.parse(err.message);
      apiError = parsed.message || parsed.error || err.message;
    } catch (e) {
      apiError = err.message || apiError;
    }
    showError(`Login Failed: ${apiError}`);
  } finally {
    loading.value = false;
  }
};
</script>
