<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-lg p-8 rounded-2xl">
      <div class="text-center mb-8">
        <div class="inline-block bg-navy-blue rounded-full p-3">
          <img
            src="@/assets/images/logo/chuvi-logo-icon.png"
            alt="Chuvi Brand Logo"
            class="h-12 w-12"
          />
        </div>
      </div>
      <h2
        class="text-3xl font-bold text-golden-brown text-center mb-2"
        :style="{ fontFamily: '--font-display' }"
      >
        Create Your First Chuvi Account
      </h2>
      <p class="text-center text-charcoal mb-4">
        Sign up to access your dashboard.
      </p>

      <form @submit.prevent="handleRegistration" class="space-y-5">
        <FormField
          label="Full Name"
          type="text"
          v-model="userData.fullName"
          placeholder="e.g., Senator Ihuj"
          required
        />

        <FormField
          label="Email Address"
          type="email"
          v-model="userData.email"
          placeholder="e.g., user@example.com"
          required
        />

        <FormField
          label="Phone Number"
          type="tel"
          v-model="userData.phone"
          placeholder="e.g., 090XXXXXXXX"
          required
        />

        <FormField
          label="Password"
          type="password"
          v-model="userData.password"
          placeholder="Strong password"
          required
        />

        <FormField
          label="Referred By (Optional)"
          type="text"
          v-model="userData.referredBy"
          placeholder="Enter referral code"
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-navy-blue text-bone-white py-3 mt-6 rounded-md font-semibold text-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
        >
          {{ loading ? "Registering..." : "Sign Up" }}
        </button>
      </form>

      <div class="mt-6 text-center text-charcoal">
        Already have an account?
        <router-link
          to="/login"
          class="text-golden-brown hover:underline font-medium"
        >
          Log In
        </router-link>
      </div>
    </div>
  </div>
</template>

<
<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import FormField from "@/components/atoms/FormField.vue";
import { register } from "@/services/api.js";
import { useToast } from "@/composables/useToast";

const { showSuccess, showError } = useToast();
const router = useRouter();
const route = useRoute(); //

// --- STATE ---
const initialUserData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  referredBy: "",
};
const userData = ref({ ...initialUserData });
const loading = ref(false);

// --- PREFILL referral code if exists ---
onMounted(() => {
  const referralCode = route.query.code;
  if (referralCode) {
    userData.value.referredBy = referralCode;
  }
});

// --- HANDLER ---
const handleRegistration = async () => {
  loading.value = true;

  const payload = { ...userData.value };
  if (!payload.referredBy) {
    delete payload.referredBy;
  }

  try {
    const response = await register(payload);

    // ✅ Successful registration → push to verifyPhone
    showSuccess(
      `Registration successful for **${payload.fullName}**! Please verify your phone number.`
    );

    router.push({
      name: "VerifyPhone",
      query: { phone: payload.phone },
    });
  } catch (err) {
    console.error("Registration error:", err);
    let apiError = "An unknown error occurred during registration.";
    try {
      const parsed = JSON.parse(err.message);
      apiError = parsed.message || parsed.error || err.message;
    } catch (e) {
      apiError = err.message || apiError;
    }
    showError(`Registration Failed: ${apiError}`);
  } finally {
    loading.value = false;
  }
};
</script>
