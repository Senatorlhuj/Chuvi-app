<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white">
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

      <h2
        class="text-2xl font-bold text-golden-brown text-center mb-2"
        :style="{ fontFamily: '--font-display' }"
      >
        Verify Your Phone
      </h2>
      <p class="text-center text-charcoal mb-6">
        Enter the 6-digit code sent to your phone.
      </p>

      <!-- Phone (readonly) -->
      <FormField
        label="Phone Number"
        type="tel"
        v-model="phone"
        :disabled="true"
      />

      <!-- OTP Input -->
      <div class="flex justify-center space-x-3 my-6">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          type="text"
          maxlength="1"
          class="w-12 h-12 text-center border rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-golden-brown"
          v-model="otpDigits[index]"
          @input="onInput($event, index)"
          @keydown.backspace="onBackspace($event, index)"
        />
      </div>

      <!-- Verify Button -->
      <button
        @click="handleVerify"
        :disabled="loading"
        class="w-full bg-navy-blue text-bone-white py-3 rounded-md font-semibold text-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        {{ loading ? "Verifying..." : "Verify Phone" }}
      </button>

      <!-- Resend Code -->
      <div class="mt-6 text-center">
        <button
          @click="handleResend"
          :disabled="resending || cooldown > 0"
          class="text-golden-brown font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="cooldown > 0"> Resend in {{ cooldown }}s </span>
          <span v-else>
            {{ resending ? "Resending..." : "Resend Code" }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import FormField from "@/components/atoms/FormField.vue";
import { verifyPhone, resendCode } from "@/services/api.js";
import { useToast } from "@/composables/useToast";

const { showSuccess, showError } = useToast();
const route = useRoute();
const router = useRouter();

// State
const phone = ref("");
const otpDigits = ref(Array(6).fill("")); // 6-digit OTP
const loading = ref(false);
const resending = ref(false);
const cooldown = ref(0);
let cooldownTimer = null;

// Prefill phone from query
onMounted(() => {
  phone.value = route.query.phone || "";
});

onBeforeUnmount(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});

// Handle input
const onInput = (e, index) => {
  const value = e.target.value.replace(/[^0-9]/g, ""); // only digits
  otpDigits.value[index] = value;

  // auto-focus next
  if (value && index < otpDigits.value.length - 1) {
    e.target.nextElementSibling?.focus();
  }
};

// Handle backspace
const onBackspace = (e, index) => {
  if (!otpDigits.value[index] && index > 0) {
    e.target.previousElementSibling?.focus();
  }
};

// Verify
const handleVerify = async () => {
  const code = otpDigits.value.join("");
  if (code.length !== 6) {
    showError("Please enter all 6 digits.");
    return;
  }

  loading.value = true;
  try {
    await verifyPhone({ phone: phone.value, code });
    showSuccess("Phone verified successfully!");
    router.push({ name: "BookPickup" });
  } catch (err) {
    console.error("Verification error:", err);
    showError(err.message || "Verification failed. Please try again.");
  } finally {
    loading.value = false;
  }
};

// Resend
const handleResend = async () => {
  resending.value = true;
  try {
    await resendCode({ phone: phone.value });
    showSuccess("Verification code resent successfully!");
    otpDigits.value = Array(6).fill(""); // clear inputs

    // start cooldown timer
    cooldown.value = 60;
    cooldownTimer = setInterval(() => {
      if (cooldown.value > 0) {
        cooldown.value--;
      } else {
        clearInterval(cooldownTimer);
      }
    }, 1000);
  } catch (err) {
    console.error("Resend error:", err);
    showError(err.message || "Could not resend code. Try again.");
  } finally {
    resending.value = false;
  }
};
</script>
