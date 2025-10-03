<template>
  <div
    class="p-6 md:p-8 max-w-sm mx-auto bg-cream shadow-2xl rounded-xl border-t-8 border-navy-blue font-display text-charcoal"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-navy-blue">Membership Status</h2>

      <span
        v-if="membershipData.user.isMember"
        class="inline-flex items-center rounded-full bg-pure-gold px-3 py-1 text-sm font-semibold text-charcoal shadow-md"
      >
        <svg class="h-2 w-2 fill-current mr-1" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="4" />
        </svg>
        Active
      </span>
      <span
        v-else
        class="inline-flex items-center rounded-full bg-golden-brown/20 px-3 py-1 text-sm font-semibold text-charcoal/70"
      >
        Inactive
      </span>
    </div>

    <div class="space-y-4">
      <div
        v-if="membershipData.user.isMember"
        class="py-2 border-t border-charcoal/10"
      >
        <p class="text-sm text-charcoal/80 mb-1">Membership Started:</p>
        <p class="text-lg font-medium text-charcoal">
          {{ formattedStartDate }}
        </p>
      </div>

      <div class="pt-4">
        <button
          @click="handleMembershipAction"
          :disabled="saving"
          class="w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          :class="
            membershipData.user.isMember
              ? 'bg-golden-brown text-cream hover:bg-navy-blue'
              : 'bg-navy-blue text-cream hover:bg-golden-brown'
          "
        >
          {{
            membershipData.user.isMember
              ? saving
                ? "Cancelling..."
                : "Cancel Membership"
              : saving
              ? "Activating..."
              : "Activate Now"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// Import Toast composable
import { useToast } from "@/composables/useToast";

const toast = useToast();

// Mock data structure provided by the user
const mockInitialData = {
  message: "Membership activated",
  user: {
    isMember: true,
    membershipStartedAt: "2025-09-29T14:48:18.989Z",
  },
};

const membershipData = ref(mockInitialData);
const saving = ref(false);

// Function to format the start date
const formattedStartDate = computed(() => {
  if (!membershipData.value.user.membershipStartedAt) return "N/A";

  const date = new Date(membershipData.value.user.membershipStartedAt);
  // Example format: September 29, 2025 at 2:48 PM
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
});

// Mock function to simulate API calls and update state
const handleMembershipAction = async () => {
  saving.value = true;

  // Simulate an API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const isCurrentlyMember = membershipData.value.user.isMember;

    if (isCurrentlyMember) {
      // Simulate successful cancellation
      membershipData.value.user.isMember = false;
      membershipData.value.user.membershipStartedAt = null;
      toast.showSuccess(
        "Membership successfully cancelled. We hope to see you back soon!"
      );
    } else {
      // Simulate successful activation
      const now = new Date().toISOString();
      membershipData.value.user.isMember = true;
      membershipData.value.user.membershipStartedAt = now;

      // Update the message in the toast to use the actual start time
      const activatedDate = new Date(now).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      toast.showSuccess(
        `Membership activated! Enjoy full access starting ${activatedDate}.`
      );
    }
  } catch (error) {
    // Use toast for error
    const errorMessage =
      error.message || "Action failed due to an unexpected error.";
    toast.showError(errorMessage);
  } finally {
    saving.value = false;
  }
};
</script>
