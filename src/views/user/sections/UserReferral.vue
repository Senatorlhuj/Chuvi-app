<script setup>
import { ref, onMounted } from "vue";
import QrcodeVue from "qrcode.vue";
import { getReferralInfo } from "@/services/api"; // adjust path if needed

const referralCode = ref("");
const referralLink = ref("");
const copiedMessage = ref("");

onMounted(async () => {
  try {
    // Fetch referral details from backend
    const data = await getReferralInfo();
    referralCode.value = data.referralCode || "NO-CODE";
    referralLink.value = data.referralLink || "";
  } catch (err) {
    console.error("Failed to load referral info:", err);
  }
});

const copyToClipboard = async (text, type) => {
  if (text) {
    await navigator.clipboard.writeText(text);
    copiedMessage.value = `${type} copied!`;
    setTimeout(() => (copiedMessage.value = ""), 2000);
  }
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-6"
  >
    <div class="bg-bone-white rounded-2xl p-8 w-full max-w-sm text-center">
      <h1 class="text-xl font-semibold mb-6">Invite Friends</h1>

      <!-- QR Code -->
      <div class="flex justify-center mb-6">
        <QrcodeVue
          :value="referralLink"
          :size="180"
          class="rounded-xl p-2"
        />
      </div>

      <!-- Referral Code -->
      <div class="flex items-center justify-center space-x-2 mb-4">
        <span class="text-lg font-mono font-bold text-golden-brown">{{ referralCode }}</span>
        <button
          @click="copyToClipboard(referralCode, 'Code')"
          class="p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          aria-label="Copy referral code"
        >
          <i class="fa-regular fa-copy text-gray-600 text-xl"></i>
        </button>
      </div>

      <!-- Referral Link -->
      <div class="flex items-center justify-center space-x-2">
        <a
          :href="referralLink"
          target="_blank"
          rel="noopener noreferrer"
          class="truncate max-w-[200px] text-sm text-blue-600 underline"
        >
          {{ referralLink }}
        </a>
        <button
          @click="copyToClipboard(referralLink, 'Link')"
          class="p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          aria-label="Copy referral link"
        >
          <i class="fa-regular fa-copy text-gray-600 text-xl"></i>
        </button>
      </div>

      <!-- Copy confirmation -->
      <p v-if="copiedMessage" class="text-gray-600 text-sm mt-3">
        {{ copiedMessage }}
      </p>
    </div>
  </div>
</template>
