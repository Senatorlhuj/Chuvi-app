<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-lg bg-bone-white p-8 rounded-xl">
      <h1 class="text-4xl font-extrabold text-navy-blue text-center mb-2">
        Admin Registration
      </h1>
      <p class="text-center text-gray-500 mb-8">
        Create a master administrator account
      </p>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <FormField
          label="Full Name"
          type="text"
          v-model="userData.fullName"
          required
        />

        <FormField
          label="Email Address"
          type="email"
          v-model="userData.email"
          required
        />

        <FormField
          label="Phone Number"
          type="tel"
          v-model="userData.phone"
          required
        />

        <FormField
          label="Password"
          type="password"
          v-model="userData.password"
          required
        />

        <FormField
          label="Master Password"
          type="password"
          v-model="userData.masterPassword"
          required
        />

        <p
          v-if="error"
          class="text-sm text-red-600 font-medium text-center bg-red-50 p-2 rounded"
        >
          {{ error }}
        </p>
        <p
          v-if="success"
          class="text-sm text-brand-green font-medium text-center bg-green-50 p-2 rounded"
        >
          Registration successful! Please log in.
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-navy-blue text-bone-white py-3 rounded-md font-semibold text-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ loading ? "Registering..." : "Register Admin" }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link
          :to="{ name: 'AdminLogin' }"
          class="text-sm text-navy-blue hover:text-golden-brown"
        >
          Already registered? Login here.
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import FormField from "@/components/atoms/FormField.vue";
import { adminRegister } from "@/services/api.js";

const router = useRouter();

const userData = ref({
  fullName: "",
  email: "",
  phone: "",
  password: "",
  masterPassword: "",
});

const loading = ref(false);
const error = ref("");
const success = ref(false);

const handleRegister = async () => {
  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    const response = await adminRegister(userData.value);

    if (response && response.token) {
      success.value = true;

      // 🚨 FIX: REMOVE the line that stores the token:
      // localStorage.setItem('adminToken', response.token);

      // 1. Redirect to AdminLogin after a short delay
      setTimeout(() => {
        router.push({ name: "AdminLogin" });
      }, 1500);
    } else {
      error.value = "Registration failed. Please try again.";
    }
  } catch (err) {
    error.value = err.message || "An error occurred during registration.";
  } finally {
    loading.value = false;
  }
};
</script>
