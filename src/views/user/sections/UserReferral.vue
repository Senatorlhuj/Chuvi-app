<template>
  <div class="px-4 py-14  lg:p-10 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-navy-blue mb-1">My Referrals</h1>
        <p class="text-xs sm:text-sm text-gray-500">
          Invite friends and earn referral credits
        </p>
      </div>

      <!-- Referral Link -->
      <div
        v-if="user?.referralCode"
        class="flex flex-col xs:flex-row items-start xs:items-center gap-2 bg-bone-white border border-golden-brown/40 rounded-lg xs:rounded-xl px-3 xs:px-4 py-2 min-w-0"
      >
        <span class="font-mono text-xs xs:text-sm text-charcoal break-all">
          {{ computedReferralLink }}
        </span>
        <button
          @click="copyReferralLink"
          class="ml-0 xs:ml-2 text-golden-brown hover:text-golden-brown/80 flex-shrink-0"
        >
          <i class="fas fa-copy text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Referral Stats -->
    <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
      <div
        class="p-4 xs:p-5 bg-bone-white border border-golden-brown/30 rounded-lg xs:rounded-2xl text-center"
      >
        <p class="text-3xl xs:text-4xl font-bold text-golden-brown">
          {{ referredUsers?.length || 0 }}
        </p>
        <p class="text-xs xs:text-sm text-charcoal/70 mt-1">Friends Referred</p>
      </div>
      <div
        class="p-4 xs:p-5 bg-bone-white border border-golden-brown/30 rounded-lg xs:rounded-2xl text-center"
      >
        <p class="text-3xl xs:text-4xl font-bold text-golden-brown">
          {{ user?.referralCredits || 0 }}
        </p>
        <p class="text-xs xs:text-sm text-charcoal/70 mt-1">Referral Credits</p>
      </div>
      <div
        class="p-4 xs:p-5 bg-bone-white border border-golden-brown/30 rounded-lg xs:rounded-2xl text-center col-span-1 xs:col-span-2 sm:col-span-1"
      >
        <p class="text-3xl xs:text-4xl font-bold text-golden-brown break-all">
          {{ computedReferralCode || "--" }}
        </p>
        <p class="text-xs xs:text-sm text-charcoal/70 mt-1">Referral Code</p>
      </div>
    </div>

    <!-- Referred Users List -->
    <div class="mb-8 sm:mb-10">
      <h2 class="text-lg sm:text-xl font-semibold text-navy-blue mb-3 sm:mb-4">
        Your Referred Users
      </h2>

      <div
        v-if="referredUsers && referredUsers.length > 0"
        class="overflow-x-auto rounded-lg xs:rounded-xl border border-golden-brown/30"
      >
        <table class="w-full bg-bone-white text-xs sm:text-sm">
          <thead class="bg-golden-brown text-bone-white">
            <tr>
              <th class="py-2 xs:py-3 px-2 xs:px-4 text-left font-semibold">Name</th>
              <th class="py-2 xs:py-3 px-2 xs:px-4 text-left font-semibold hidden xs:table-cell">Email</th>
              <th class="py-2 xs:py-3 px-2 xs:px-4 text-left font-semibold">Phone</th>
              <th class="py-2 xs:py-3 px-2 xs:px-4 text-left font-semibold hidden sm:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in referredUsers"
              :key="r._id"
              class="border-t border-golden-brown/20 hover:bg-golden-brown/5 transition-colors"
            >
              <td class="py-2 xs:py-3 px-2 xs:px-4 font-medium text-navy-blue">
                {{ r.fullName }}
              </td>
              <td class="py-2 xs:py-3 px-2 xs:px-4 hidden xs:table-cell text-xs xs:text-sm">{{ r.email || "—" }}</td>
              <td class="py-2 xs:py-3 px-2 xs:px-4 text-xs xs:text-sm">{{ r.phone }}</td>
              <td class="py-2 xs:py-3 px-2 xs:px-4 text-gray-500 text-xs xs:text-sm hidden sm:table-cell">
                {{ formatDate(r.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else
        class="text-center p-6 xs:p-8 sm:p-10 text-gray-500 border border-dashed border-golden-brown/40 rounded-lg xs:rounded-2xl bg-bone-white/70"
      >
        <i class="fas fa-user-friends text-2xl xs:text-3xl text-golden-brown/60 mb-2 xs:mb-3 block"></i>
        <p class="text-sm xs:text-base">No referrals yet. Share your link to invite friends!</p>
      </div>
    </div>

    <!-- Referral Section -->
    <section
      class="bg-white rounded-lg xs:rounded-2xl border border-golden-brown/30 p-4 xs:p-6 text-center"
    >
      <h2
        class="text-lg xs:text-xl sm:text-2xl font-bold mb-3 xs:mb-4 text-navy-blue flex justify-center items-center gap-2 flex-wrap"
      >
        <font-awesome-icon :icon="['fas', 'gift']" class="text-lg xs:text-xl" /> 
        <span>Invite Friends</span>
      </h2>
      <QrcodeVue
        v-if="computedReferralLink"
        :value="computedReferralLink"
        :size="140"
        class="mx-auto mb-3 xs:mb-4"
      />
      <p
        v-if="computedReferralCode"
        class="font-mono text-base xs:text-lg text-golden-brown mb-3 xs:mb-4 break-all px-2"
      >
        {{ computedReferralCode }}
      </p>
      <div
        v-if="computedReferralCode && computedReferralLink"
        class="flex flex-col sm:flex-row justify-center gap-2 xs:gap-3"
      >
        <button
          @click="copyToClipboard(computedReferralCode)"
          class="w-full sm:w-auto px-3 xs:px-4 py-2 bg-golden-brown text-white text-sm xs:text-base rounded-md hover:bg-navy-blue transition cursor-pointer"
        >
          <font-awesome-icon :icon="['fas', 'copy']" /> Copy Code
        </button>
        <button
          @click="copyToClipboard(computedReferralLink)"
          class="w-full sm:w-auto px-3 xs:px-4 py-2 bg-navy-blue text-white text-sm xs:text-base rounded-md hover:bg-golden-brown transition cursor-pointer"
        >
          <font-awesome-icon :icon="['fas', 'link']" /> Copy Link
        </button>
      </div>
      <p v-else class="text-gray-500 text-sm xs:text-base">Loading referral information...</p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUser } from "@/composables/useUser";
import { useToast } from "@/composables/useToast";
import { getReferralInfo } from "@/services/api";
import QrcodeVue from 'qrcode.vue';

const { user, loadUser } = useUser();
const { showSuccess, showError } = useToast();

const isLoading = ref(true);

// Fixed: Removed duplicate ref declarations and used computed properties instead
const referredUsers = computed(() => user.value?.referredUsers || []);
const computedReferralCode = computed(() => user.value?.referralCode || "");
const computedReferralLink = computed(() =>
  computedReferralCode.value
    ? `https://chuvi-app-5sky.vercel.app/register?code=${computedReferralCode.value}`
    : ""
);

onMounted(async () => {
  try {
    await loadUser();
    await loadReferralInfo(); // Added: Load referral info on mount
  } catch (err) {
    showError("Failed to load user data.");
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const copyReferralLink = async () => {
  if (!computedReferralLink.value) return;

  try {
    await navigator.clipboard.writeText(computedReferralLink.value);
    showSuccess("Referral link copied to clipboard!");
  } catch (err) {
    showError("Failed to copy referral link.");
  }
};

// Fixed: Added missing copyToClipboard function
const copyToClipboard = async (text) => {
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    showSuccess("Copied to clipboard!");
  } catch (err) {
    showError("Failed to copy to clipboard.");
  }
};

/* ---------- Referral ---------- */
const loadReferralInfo = async () => {
  try {
    const data = await getReferralInfo();
    // Note: The data is now stored in the user object from useUser composable
    // If you need to update the user object with referral info, do it here
    if (data && user.value) {
      // Update user data with referral info if needed
      user.value.referralCode = data.referralCode || user.value.referralCode;
      user.value.referredUsers = data.referredUsers || user.value.referredUsers;
      user.value.referralCredits = data.referralCredits || user.value.referralCredits;
    }
  } catch (err) {
    console.error("Failed to load referral info:", err);
  }
};
</script>

<style scoped>
table th,
table td {
  white-space: nowrap;
}

/* Extra small screens (320px - 374px) */
@media (max-width: 374px) {
  .text-xs {
    font-size: 0.75rem;
  }
}
</style>