<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-md bg-bone-white p-8 rounded-xl ">
      <h1 class="text-4xl font-extrabold text-navy-blue text-center mb-2">Admin Login</h1>
      <p class="text-center text-gray-500 mb-8">Access the management dashboard</p>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <FormField
          label="Phone Number"
          type="tel"
          v-model="credentials.phone"
          required
        />
        
        <FormField
          label="Password"
          type="password"
          v-model="credentials.password"
          required
        />

        <FormField
          label="Master Password (Required)"
          type="password"
          v-model="credentials.masterPassword"
          required
        />

        <p v-if="error" class="text-sm text-red-600 font-medium text-center bg-red-50 p-2 rounded">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-golden-brown text-bone-white py-3 rounded-md font-semibold text-lg hover:bg-pure-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ loading ? 'Logging In...' : 'Login' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link :to="{ name: 'AdminRegister' }" class="text-sm text-navy-blue hover:text-golden-brown">
          Need to register a new admin?
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FormField from '@/components/atoms/FormField.vue'; // Assuming path
import { adminLogin } from '@/services/api.js';

const router = useRouter();

const credentials = ref({
  phone: '',
  password: '',
  masterPassword: '',
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await adminLogin(credentials.value);
    
    if (response && response.token) {
      // 1. Save the token to localStorage
      localStorage.setItem('adminToken', response.token);
      
      // 2. Redirect to the admin dashboard
      router.push({ name: 'AdminDashboard' });
    } else {
      error.value = 'Login failed. Please check credentials.';
    }
  } catch (err) {
    error.value = err.message || 'An error occurred during login.';
  } finally {
    loading.value = false;
  }
};
</script>