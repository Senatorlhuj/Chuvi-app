<template>
  <div class="flex items-center justify-center min-h-screen p-4" :class="['bg-bone-white']">
    <div class="w-full max-w-lg p-8 rounded-2xl " >
      <div class="text-center mb-8">
        <div class="inline-block bg-navy-blue rounded-full p-3 shadow-lg">
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

        <CustomSelect
          label="Gender"
          v-model="userData.gender"
          :options="genderOptions"
          placeholder="Select your gender"
          required
          width-class="w-full"
        />

        <FormField
          label="Password"
          type="password"
          v-model="userData.password"
          placeholder="Strong password (min 6 chars)"
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
          class="w-full py-3 mt-6 rounded-md font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
          :class="['bg-navy-blue text-bone-white hover:bg-charcoal']"
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

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import FormField from "@/components/atoms/FormField.vue";
// 🚨 New Component Import
import CustomSelect from "@/components/atoms/CustomSelect.vue"; 
import { register } from "@/services/api.js";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();
const router = useRouter();
const route = useRoute();

// --- STATE ---
const userData = ref({
  fullName: "",
  email: "",
  phone: "",
  password: "",
  gender: "", 
  referredBy: "",
});

// --- GENDER OPTIONS (for CustomSelect) ---
// Keys (value) must match the backend Joi validation: 'male', 'female', 'other'
const genderOptions = ref([
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
]);

const loading = ref(false);

// --- PREFILL REFERRAL CODE ---
onMounted(() => {
  const referralCode = route.query.code;
  if (referralCode) {
    userData.value.referredBy = referralCode;
  }
});

// --- HANDLER ---
const handleRegistration = async () => {
  loading.value = true;

  // The CustomSelect uses an empty string default, which should be sufficient
  // for required validation, but ensure it's not submitted if truly empty
  if (!userData.value.gender) {
    showToast("Gender is a required field.", "warning");
    loading.value = false;
    return;
  }

  const payload = { ...userData.value };
  if (!payload.referredBy) delete payload.referredBy;

  try {
    const response = await register(payload);

    if (response && response.message) {
      showToast(
        `Registration successful for ${payload.fullName}! Please verify your phone number.`,
        "success"
      );

      // Redirect to verification page with the phone number
      router.push({
        name: "VerifyPhone",
        query: { phone: payload.phone },
      });
    } else {
      // Handle server-side validation or known errors
      showToast(
        response.error || "Registration failed. Please check your details.",
        "error"
      );
    }
  } catch (err) {
    console.error("Registration error:", err);
    let apiError = "An unknown error occurred during registration.";
    try {
      const parsed = JSON.parse(err.message);
      if (parsed.details && parsed.details.length > 0) {
        // Concatenate Joi validation messages for better user feedback
        apiError = parsed.details.map(d => d.message).join('; ');
      } else {
        apiError = parsed.message || parsed.error || err.message;
      }
    } catch (e) {
      apiError = err.message || apiError;
    }
    showToast(`Registration Failed: ${apiError}`, "error");
  } finally {
    loading.value = false;
  }
};
</script>