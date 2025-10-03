<template>
  <div
    class="p-6 md:p-10 max-w-4xl mx-auto  text-charcoal font-display min-h-screen"
  >
    <h1
      class="text-4xl font-extrabold mb-8 text-navy-blue border-b-2 border-navy-blue/10 pb-2"
    >
      My Profile
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 space-y-8">
        <div
          class="p-6 bg-bone-white rounded-lg border-t-4 border-golden-brown"
        >
          <h2 class="text-2xl font-bold mb-4 text-navy-blue flex items-center">
            <UserIcon class="w-6 h-6 mr-2" />
            Account Details
          </h2>

          <div class="space-y-4">
            <ProfileField
              label="Full Name"
              v-model:value="form.fullName"
              editable
            />
            <ProfileField label="Email" v-model:value="form.email" editable />
            <ProfileField label="Phone" v-model:value="form.phone" editable />

            <ProfileField label="Role" :value="profile.role" />
            <ProfileField label="Referral Code" :value="profile.referralCode" />
          </div>

          <div class="mt-6">
            <button
              @click="handleUpdateProfile"
              :disabled="isUpdatingProfile"
              class="w-full px-4 py-2 bg-navy-blue text-bone-white rounded-sm hover:bg-golden-brown transition-colors disabled:opacity-50 text-sm font-semibold cursor-pointer"
            >
              {{ isUpdatingProfile ? "Updating..." : "Save Profile Updates" }}
            </button>
          </div>
        </div>

        <div
          class="p-6 bg-bone-white rounded-lg border-t-4 border-navy-blue"
        >
          <h2 class="text-2xl font-bold mb-4 text-navy-blue">
            Change Password
          </h2>

          <div class="space-y-4">
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="Current Password"
              class="input-display w-full"
            />
            <input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="New Password"
              class="input-display w-full"
            />
          </div>

          <div class="mt-6">
            <button
              @click="handleUpdatePassword"
              :disabled="isUpdatingPassword"
              class="w-full px-4 py-2 bg-golden-brown text-bone-white rounded-sm hover:bg-navy-blue transition-colors disabled:opacity-50 text-sm font-semibold cursor-pointer"
            >
              {{ isUpdatingPassword ? "Updating..." : "Set New Password" }}
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-8">
        <!-- Membership Status Block (UPDATED) -->
        <div
          class="p-6 bg-bone-white rounded-lg border-t-4"
          :class="profile.isMember ? 'border-pure-gold' : 'border-golden-brown'"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-navy-blue">Membership Status</h2>
            <span
              v-if="profile.isMember"
              class="inline-flex items-center rounded-full bg-pure-gold px-3 py-1 text-sm font-semibold text-charcoal"
            >
              <CheckCircleIcon class="h-4 w-4 fill-current mr-1" />
              Active
            </span>
            <span
              v-else
              class="inline-flex items-center rounded-full bg-golden-brown/20 px-3 py-1 text-sm font-semibold text-charcoal/70"
            >
              Inactive
            </span>
          </div>

          <div v-if="profile.isMember" class="py-2 border-t border-charcoal/10">
            <p class="text-sm text-charcoal/80 mb-1">Membership Started:</p>
            <p class="text-lg font-medium text-charcoal">
              {{ formatMembershipDate(profile.membershipStartedAt) }}
            </p>
          </div>

          <div class="pt-4">
            <!-- 1. Cancel Membership Button (If Active Member) -->
            <button
              v-if="profile.isMember"
              @click="toggleMembership"
              :disabled="isTogglingMembership"
              class="w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 bg-golden-brown text-bone-white hover:bg-navy-blue cursor-pointer"
            >
              {{ isTogglingMembership ? "Cancelling..." : "Cancel Membership" }}
            </button>

            <!-- 2. Join Membership Button (If Not A Member) -->
            <button
              v-else
              @click="toggleMembership"
              :disabled="isTogglingMembership"
              class="w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 bg-navy-blue text-bone-white hover:bg-golden-brown cursor-pointer"
            >
              {{
                isTogglingMembership ? "Activating..." : "Join Membership Now"
              }}
            </button>
          </div>
        </div>
        <!-- End Membership Status Block -->

        <div
          class="p-6 bg-bone-white rounded-lg  border-t-4 border-golden-brown"
        >
          <h2 class="text-2xl font-bold mb-4 text-navy-blue">
            <WashingMachineIcon class="w-6 h-6 mr-2" />
            Laundry Preferences
          </h2>
          <!-- View All Preferences Button -->
          <div class="mt-4 flex justify-end">
            <!-- RouterLink is mocked here, assuming it's imported correctly -->
            <RouterLink
              :to="{ name: 'UserPreferences' }"
              class="px-4 py-2 bg-navy-blue text-bone-white rounded-md hover:bg-golden-brown transition-colors text-sm font-semibold"
            >
              View All Preferences
            </RouterLink>
          </div>
        </div>

        <div
          class="p-6 bg-bone-white rounded-lg  border-t-4 border-navy-blue"
        >
          <h2
            class="text-2xl font-bold mb-4 text-navy-blue flex justify-between items-center"
          >
            <span class="flex items-center">
              <MapPinIcon class="w-6 h-6 mr-2" />
              Saved Addresses ({{ profile.addresses.length }})
            </span>
          </h2>

          <!-- View All Saved Addresses Button -->
          <div class="mt-4 flex justify-end">
            <!-- RouterLink is mocked here, assuming it's imported correctly -->

            <RouterLink
              to="/user/address"
              class="px-4 py-2 bg-navy-blue text-bone-white rounded-md hover:bg-golden-brown transition-colors text-sm font-semibold"
            >
              View All Saved Addresses
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- TOAST COMPONENT (The Fix) -->
  <div
    v-if="toastState.visible"
    :class="[
      toastState.type === 'success'
        ? 'bg-bone-white text-charcoal'
        : 'bg-destructive text-destructive-foreground',
      'fixed top-4 right-4 z-50 p-4 rounded-lg  transition-all duration-300 ease-in-out w-full max-w-sm border-l-4',
      toastState.type === 'success'
        ? 'border-navy-blue'
        : 'border-golden-brown',
    ]"
    role="alert"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-start">
        <CheckCircleIcon
          v-if="toastState.type === 'success'"
          class="h-6 w-6 mr-3 mt-0.5 fill-current"
        />
        <XCircleIcon v-else class="h-6 w-6 mr-3 mt-0.5 fill-current" />
        <p class="font-medium text-sm pt-0.5">{{ toastState.message }}</p>
      </div>
      <button
        @click="toastState.visible = false"
        class="p-1 -mr-1 rounded-full hover:bg-charcoal/10 transition-colors cursor-pointer"
      >
        <CloseIcon class="h-5 w-5 fill-current" />
      </button>
    </div>
  </div>
  <!-- END TOAST COMPONENT -->
</template>

<script setup>
import { ref, reactive } from "vue";
import { RouterLink } from "vue-router";
// Mock implementation of useToast and API services (as they are external dependencies)

// New reactive state for the actual toast
const useToast = () => {
  const toastState = reactive({
    visible: false,
    message: "",
    type: "success", // 'success' or 'error'
    timeout: null,
  });

  const show = (message, type) => {
    // Clear any existing timer
    if (toastState.timeout) {
      clearTimeout(toastState.timeout);
    }

    toastState.message = message;
    toastState.type = type;
    toastState.visible = true;

    // Set new timer to auto-hide
    toastState.timeout = setTimeout(() => {
      toastState.visible = false;
    }, 4000); // Hide after 4 seconds
  };

  return {
    showSuccess: (message) => show(message, "success"),
    showError: (message) => show(message, "error"),
    toastState, // Expose state for template rendering
  };
};

// Destructure the enhanced useToast hook
const {
  showSuccess: toastSuccess,
  showError: toastError,
  toastState,
} = useToast();

// Mock API services (kept the same)
const updateProfile = (payload) =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("API: updateProfile", payload);
      resolve();
    }, 500)
  );
const updatePassword = (payload) =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("API: updatePassword", payload);
      resolve();
    }, 500)
  );
const joinMembership = (payload) =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("API: joinMembership", payload);
      resolve();
    }, 500)
  );
const leaveMembership = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("API: leaveMembership");
      resolve();
    }, 500)
  );

// State for loading/saving
const isUpdatingProfile = ref(false);
const isUpdatingPassword = ref(false);
const isTogglingMembership = ref(false);

// Mock SVG Icons (As provided by user's template, plus new ones for toast)
const UserIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.654-7.813-1.81a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" /></svg>`,
};
const CheckCircleIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.822L10.5 11.236l-1.928-1.929a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l4-4Z" clip-rule="evenodd" /></svg>`,
};
const XCircleIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" /></svg>`,
};
const CloseIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`,
};
const WashingMachineIcon = {
  // Creating a mock definition since it was referenced but not defined
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M11.53 3.53a.75.75 0 0 0-1.062-1.062L5.25 7.75V2.25a.75.75 0 0 0-1.5 0v17.5a.75.75 0 0 0 1.5 0v-5.5a.75.75 0 0 1 1.062-.693l6.21-3.565 2.651 2.652c.287.287.731.325 1.067.111l4.085-2.585a.75.75 0 0 0 .111-1.205L13.78 3.53ZM8.37 7.75l2.645 1.518a3.75 3.75 0 0 1-5.074 4.54l-1.895-1.085L8.37 7.75Zm5.63 7.72v.288l2.651 2.651a.75.75 0 1 0 1.061-1.06l-2.65-2.651Z" /></svg>`,
};
const MapPinIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="m11.54 22.351.07.039.02.012a4.475 4.475 0 0 0 .546.166 4.512 4.512 0 0 0 .685.086c.159 0 .318-.01.474-.03.243-.03.486-.076.723-.141a4.846 4.846 0 0 0 1.954-.925 4.855 4.855 0 0 0 1.114-1.171c.27-.3.51-.62.722-.958.118-.182.222-.373.315-.568A8.243 8.243 0 0 0 16.5 11.5V6.75a4.5 4.5 0 0 0-9 0v4.75a8.243 8.243 0 0 0-.256 1.879l-.315.569c-.212.338-.452.658-.722.957a4.855 4.855 0 0 0-1.114 1.17 4.845 4.845 0 0 0-.925 1.954 4.87 4.87 0 0 0-.14.723c-.02.156-.03.315-.03.474a4.512 4.512 0 0 0 .087.685 4.475 4.475 0 0 0 .165.546l.02.012.07.039.117.067a.75.75 0 0 0 .61.037.75.75 0 0 0 .341-.122L12 19.537l3.712 2.366c.148.094.316.14.485.14.36 0 .692-.163.914-.426Z" clip-rule="evenodd" /></svg>`,
};

// Helper component for generic profile fields
const ProfileField = {
  props: ["label", "value", "editable"],
  emits: ["update:value"],
  template: `
    <div class="flex flex-col space-y-1">
      <p class="text-sm font-medium text-navy-blue">{{ label }}</p>
      <input 
        v-if="editable" 
        :value="value" 
        type="text" 
        class="input-display"
        @input="$emit('update:value', $event.target.value)"
      />
      <p v-else class="text-charcoal">{{ value }}</p>
    </div>
  `,
};

// Helper component for preference fields (read-only)
const PrefField = {
  props: ["label", "value"],
  template: `
    <div>
      <p class="text-sm font-medium text-navy-blue">{{ label }}:</p>
      <p class="text-charcoal">{{ value }}</p>
    </div>
  `,
};

// --- DATA ---
const mockProfileData = {
  preferences: {
    detergent: "Klin",
    fragrance: "Lavender",
    hanger: true,
    specialCareNotes:
      "Handle delicate fabrics separately and use cold water wash.",
  },
  _id: "68d6bd2a0991a9ccaee454df",
  phone: "+2349037680235",
  fullName: "Senator lhuj",
  email: "obinnaedmund0@gmail.com",
  role: "user",
  // Initial state set to true for demonstration
  isMember: true,
  referralCode: "REF5978",
  referredBy: null,
  currentSubscription: null,
  referralCredits: 0,
  isVerified: true,
  addresses: [
    {
      _id: "a1",
      label: "Home",
      line1: "123 Main St",
      city: "City",
      state: "CA",
      landmark: "Near Park",
    },
    {
      _id: "a2",
      label: "Work",
      line1: "456 Business Ave",
      line2: "Suite 200",
      city: "City",
      state: "CA",
      landmark: "Office Building",
    },
  ],
  createdAt: "2025-09-26T16:19:54.846Z",
  __v: 3,
  membershipStartedAt: "2025-09-29T14:48:18.989Z",
};

// The main user data state (read-only from API)
const profile = ref(mockProfileData);

// The form data used for two-way binding with inputs
const form = ref({
  fullName: profile.value.fullName,
  email: profile.value.email,
  phone: profile.value.phone,
});

// The form data for password update
const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
});

// --- METHODS ---

// 1. Update Profile (PUT /api/users/me)
const handleUpdateProfile = async () => {
  isUpdatingProfile.value = true;
  try {
    const payload = {
      fullName: form.value.fullName,
      email: form.value.email,
      phone: form.value.phone,
    };
    await updateProfile(payload);

    profile.value.fullName = form.value.fullName;
    profile.value.email = form.value.email;
    profile.value.phone = form.value.phone;

    toastSuccess("Profile details updated successfully!");
  } catch (error) {
    toastError(error.message || "Failed to update profile.");
  } finally {
    isUpdatingProfile.value = false;
  }
};

// 2. Update Password (PUT /api/users/me/password)
const handleUpdatePassword = async () => {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    return toastError("Both password fields are required.");
  }

  isUpdatingPassword.value = true;
  try {
    const payload = {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    };

    await updatePassword(payload);

    passwordForm.value.currentPassword = "";
    passwordForm.value.newPassword = "";

    toastSuccess("Password changed successfully!");
  } catch (error) {
    toastError(error.message || "Failed to update password.");
  } finally {
    isUpdatingPassword.value = false;
  }
};

// 3. Toggle Membership (JOIN or LEAVE)
const toggleMembership = async () => {
  isTogglingMembership.value = true;
  try {
    const isMember = profile.value.isMember;

    if (isMember) {
      // LEAVE membership
      await leaveMembership();

      profile.value.isMember = false;
      toastSuccess("Membership cancelled successfully.");
    } else {
      // JOIN membership
      const subscriptionDetails = {};

      await joinMembership(subscriptionDetails);

      profile.value.isMember = true;
      profile.value.membershipStartedAt = new Date().toISOString();
      toastSuccess("Membership activated! Welcome back.");
    }
  } catch (error) {
    toastError(error.message || `Failed to modify membership.`);
  } finally {
    isTogglingMembership.value = false;
  }
};

// Helper for membership date display
const formatMembershipDate = (isoDate) => {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<style scoped>
/* Custom Input Styling for Editable Fields (using Pure Gold focus) */
.input-display {
  width: 100%;
  border: 1px solid var(--color-charcoal, #302e2d);
  border-radius: 0.375rem;
  padding: 0.4rem 0.6rem;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  background-color: white;
  color: var(--color-charcoal);
}
.input-display:focus {
  box-shadow: 0 0 0 2px var(--color-pure-gold);
  border-color: var(--color-pure-gold);
}
.input-display::placeholder {
  color: var(--color-charcoal, #302e2d);
  opacity: 0.7;
}
</style>
