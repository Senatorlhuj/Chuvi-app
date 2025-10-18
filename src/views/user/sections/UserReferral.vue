<template>
  <div class="p-6 lg:p-10 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-navy-blue mb-1">My Referrals</h1>
        <p class="text-sm text-gray-500">
          Invite friends and earn referral credits
        </p>
      </div>

      <!-- Referral Link -->
      <div
        v-if="user?.referralCode"
        class="mt-3 sm:mt-0 flex items-center gap-2 bg-bone-white border border-golden-brown/40 rounded-xl px-4 py-2"
      >
        <span class="font-mono text-sm text-charcoal">
          {{ referralLink }}
        </span>
        <button
          @click="copyReferralLink"
          class="ml-2 text-golden-brown hover:text-golden-brown/80"
        >
          <i class="fas fa-copy"></i>
        </button>
      </div>
    </div>

    <!-- Referral Stats -->
    <div class="grid sm:grid-cols-3 gap-4 mb-10">
      <div
        class="p-5 bg-bone-white border border-golden-brown/30 rounded-2xl text-center"
      >
        <p class="text-4xl font-bold text-golden-brown">
          {{ referredUsers?.length || 0 }}
        </p>
        <p class="text-sm text-charcoal/70 mt-1">Friends Referred</p>
      </div>
      <div
        class="p-5 bg-bone-white border border-golden-brown/30 rounded-2xl text-center"
      >
        <p class="text-4xl font-bold text-golden-brown">
          {{ user?.referralCredits || 0 }}
        </p>
        <p class="text-sm text-charcoal/70 mt-1">Referral Credits</p>
      </div>
      <div
        class="p-5 bg-bone-white border border-golden-brown/30 rounded-2xl text-center"
      >
        <p class="text-4xl font-bold text-golden-brown">
          {{ referralCode || "--" }}
        </p>
        <p class="text-sm text-charcoal/70 mt-1">Referral Code</p>
      </div>
    </div>

    <!-- Referred Users List -->
    <div>
      <h2 class="text-xl font-semibold text-navy-blue mb-4">
        Your Referred Users
      </h2>

      <div
        v-if="referredUsers && referredUsers.length > 0"
        class="overflow-x-auto rounded-xl border border-golden-brown/30"
      >
        <table class="min-w-full bg-bone-white text-sm">
          <thead class="bg-golden-brown text-bone-white">
            <tr>
              <th class="py-3 px-4 text-left">Name</th>
              <th class="py-3 px-4 text-left">Email</th>
              <th class="py-3 px-4 text-left">Phone</th>
              <th class="py-3 px-4 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in referredUsers"
              :key="r._id"
              class="border-t border-golden-brown/20 hover:bg-golden-brown/5 transition-colors"
            >
              <td class="py-3 px-4 font-medium text-navy-blue">
                {{ r.fullName }}
              </td>
              <td class="py-3 px-4">{{ r.email || "—" }}</td>
              <td class="py-3 px-4">{{ r.phone }}</td>
              <td class="py-3 px-4 text-gray-500">
                {{ formatDate(r.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else
        class="text-center p-10 text-gray-500 border border-dashed border-golden-brown/40 rounded-2xl bg-bone-white/70"
      >
        <i class="fas fa-user-friends text-3xl text-golden-brown/60 mb-3"></i>
        <p>No referrals yet. Share your link to invite friends!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUser } from "@/composables/useUser";
import { useToast } from "@/composables/useToast"; // ✅ adjust to your toast composable path

const { user, loadUser } = useUser();
const { showSuccess, showError } = useToast(); // ✅ we’ll use these for notifications

const isLoading = ref(true);

onMounted(async () => {
  try {
    await loadUser();
  } catch (err) {
    showError("Failed to load user data.");
  } finally {
    isLoading.value = false;
  }
});

const referredUsers = computed(() => user.value?.referredUsers || []);
const referralCode = computed(() => user.value?.referralCode || "");
const referralLink = computed(() =>
  referralCode.value
    ? `https://chuvi-app-5sky.vercel.app/register?code=${referralCode.value}`
    : ""
);

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const copyReferralLink = async () => {
  if (!referralLink.value) return;

  try {
    await navigator.clipboard.writeText(referralLink.value);
    showSuccess("Referral link copied to clipboard!"); // ✅ toast replaces alert
  } catch (err) {
    showError("Failed to copy referral link."); // ✅ toast error
  }
};
</script>

<style scoped>
table th,
table td {
  white-space: nowrap;
}
</style>
