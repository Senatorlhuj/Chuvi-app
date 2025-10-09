<template>
  <div class="p-6 md:p-10 max-w-6xl mx-auto text-charcoal font-display min-h-screen">
    <h1
      class="text-4xl font-extrabold mb-8 text-navy-blue border-b-2 border-navy-blue/10 pb-4"
    >
      My Profile & Settings
    </h1>

    <div class="bg-bone-white text-golden-brown px-4 py-3 rounded-sm mb-6 border-l-4 border-golden-brown shadow-sm">
      <strong>Disclaimer:</strong> Deliveries and services are available
      <strong>within Anambra</strong> only.
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 space-y-8">
        <div
          class="p-6 bg-bone-white rounded-lg border-t-4 border-golden-brown shadow-lg"
        >
          <h2 class="text-2xl font-bold mb-4 text-navy-blue flex items-center">
            <UserIcon class="w-6 h-6 mr-2 fill-current" />
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
              class="w-full px-4 py-2 bg-navy-blue text-bone-white rounded-sm hover:bg-golden-brown transition-colors disabled:opacity-50 text-sm font-semibold cursor-pointer shadow-md"
            >
              {{ isUpdatingProfile ? "Updating..." : "Save Profile Updates" }}
            </button>
          </div>
        </div>

        <div
          class="p-6 bg-bone-white rounded-lg border-t-4 border-navy-blue shadow-lg"
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
              class="w-full px-4 py-2 bg-golden-brown text-bone-white rounded-sm hover:bg-navy-blue transition-colors disabled:opacity-50 text-sm font-semibold cursor-pointer shadow-md"
            >
              {{ isUpdatingPassword ? "Updating..." : "Set New Password" }}
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-8">
        <div class="p-6 bg-bone-white rounded-lg border-t-4 border-navy-blue shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-navy-blue flex items-center">
              <MapPinIcon class="w-6 h-6 mr-2 fill-current" />
              My Saved Addresses ({{ addresses.length }})
            </h2>
            <button
              @click="showAddresses = !showAddresses"
              class="px-4 py-2 bg-golden-brown text-bone-white rounded-sm hover:bg-navy-blue transition-colors text-sm font-semibold cursor-pointer shadow-md"
            >
              {{ showAddresses ? "Hide Addresses" : "View Addresses" }}
            </button>
          </div>
          <hr class="border-charcoal/10 mb-6" />

          <div v-if="showAddresses">
            <div v-if="loading" class="text-charcoal text-center py-4">
              <span class="animate-pulse">Loading addresses…</span>
            </div>

            <div
              v-else-if="addressError"
              class="text-golden-brown font-semibold bg-golden-brown/10 p-3 rounded-md"
            >
              {{ addressError }}
            </div>

            <div v-else class="space-y-4">
              <p v-if="addresses.length === 0" class="text-charcoal opacity-70 italic">
                No addresses saved yet. Use the form below to add one.
              </p>
              <div
                v-for="addr in addresses"
                :key="addr._id"
                class="border border-charcoal/20 rounded-lg p-4 bg-bone-white shadow-sm hover:border-golden-brown transition-all"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-lg text-navy-blue">
                      {{ addr.label }}
                      <span class="text-xs text-charcoal opacity-60 ml-2">({{ addr.city }})</span>
                    </h3>
                    <p class="text-charcoal">{{ addr.line1 }}</p>
                    <p v-if="addr.line2" class="text-charcoal">
                      {{ addr.line2 }}
                    </p>
                    <p class="text-charcoal text-sm font-light">
                      <span v-if="addr.landmark">Landmark: {{ addr.landmark }}</span>
                    </p>
                  </div>
                  <button
                    @click="deleteAddr(addr._id)"
                    class="text-golden-brown hover:text-navy-blue text-xs font-semibold ml-4 transition-colors cursor-pointer p-2 rounded-full hover:bg-golden-brown/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 bg-bone-white rounded-lg border-t-4 border-golden-brown shadow-lg">
          <h3 class="text-2xl font-bold mb-4 text-navy-blue">
           Add New Address
          </h3>
          <form @submit.prevent="addAddress" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-1 text-charcoal">Label</label>
              <input
                v-model="newAddress.label"
                type="text"
                required
                class="input-display"
                placeholder="e.g. Home or Office"
              />
            </div>
            <div>
              <label class="block text-sm mb-1 text-charcoal">Line 1</label>
              <input
                v-model="newAddress.line1"
                type="text"
                required
                class="input-display"
                placeholder="123 Main Street"
              />
            </div>
            <div>
              <label class="block text-sm mb-1 text-charcoal"
                >Line 2 (Optional)</label
              >
              <input
                v-model="newAddress.line2"
                type="text"
                class="input-display"
                placeholder="Apartment 4B"
              />
            </div>
            <div>
              <label class="block text-sm mb-1 text-charcoal">City</label>
              <input
                v-model="newAddress.city"
                type="text"
                required
                class="input-display"
                placeholder="Awka"
              />
            </div>
            <div>
              <label class="block text-sm mb-1 text-charcoal">State</label>
              <input
                v-model="newAddress.state"
                type="text"
                required
                class="input-display"
                placeholder="Anambra State"
              />
            </div>
            <div>
              <label class="block text-sm mb-1 text-charcoal">Landmark</label>
              <input
                v-model="newAddress.landmark"
                type="text"
                class="input-display"
                placeholder="Near XYZ"
              />
            </div>
            <div class="col-span-1 sm:col-span-2 mt-2">
              <button
                type="submit"
                class="w-full px-4 py-2 bg-navy-blue text-bone-white rounded-sm hover:bg-golden-brown transition-colors disabled:opacity-50 cursor-pointer text-sm font-semibold shadow-md"
                :disabled="adding"
              >
                {{ adding ? "Adding Address…" : "Save New Address" }}
              </button>
            </div>
          </form>
        </div>
        
        <div
          class="p-6 bg-bone-white rounded-lg border-t-4"
          :class="profile.isMember ? 'border-pure-gold' : 'border-golden-brown'"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-navy-blue">Membership Status</h2>
            <span
              v-if="profile.isMember"
              class="inline-flex items-center rounded-full bg-pure-gold px-3 py-1 text-sm font-semibold text-charcoal shadow-sm"
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
            <button
              @click="toggleMembership"
              :disabled="isTogglingMembership"
              class="w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-md cursor-pointer"
              :class="
                profile.isMember
                  ? 'bg-golden-brown text-bone-white hover:bg-navy-blue'
                  : 'bg-navy-blue text-bone-white hover:bg-golden-brown'
              "
            >
              {{
                isTogglingMembership
                  ? profile.isMember
                    ? "Cancelling..."
                    : "Activating..."
                  : profile.isMember
                  ? "Cancel Membership"
                  : "Join Membership Now"
              }}
            </button>
          </div>
        </div>
        <div
          class="p-6 bg-bone-white rounded-lg border-t-4 border-golden-brown shadow-lg"
        >
          <h2 class="text-2xl font-bold mb-4 text-navy-blue flex items-center">
            <WashingMachineIcon class="w-6 h-6 mr-2 fill-current" />
            Laundry Preferences
          </h2>
          <div class="grid grid-cols-2 gap-4 border-b border-charcoal/10 pb-4 mb-4">
            <PrefField label="Detergent" :value="profile.preferences.detergent" />
            <PrefField label="Fragrance" :value="profile.preferences.fragrance" />
            <PrefField label="Hanger Service" :value="profile.preferences.hanger ? 'Yes' : 'No'" />
            <PrefField label="Special Notes" :value="profile.preferences.specialCareNotes.substring(0, 20) + '...'" />
          </div>

          <div class="flex justify-end">
            <RouterLink
              :to="{ name: 'UserPreferences' }"
              class="px-4 py-2 bg-navy-blue text-bone-white rounded-md hover:bg-golden-brown transition-colors text-sm font-semibold shadow-md"
            >
              View All Preferences
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="toastState.visible"
    :class="[
      toastState.type === 'success'
        ? 'bg-bone-white text-charcoal border-navy-blue shadow-lg'
        : 'bg-bone-white text-golden-brown border-golden-brown shadow-lg',
      'fixed top-4 right-4 z-50 p-4 rounded-lg transition-all duration-300 ease-in-out w-full max-w-sm border-l-4',
    ]"
    role="alert"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-start">
        <CheckCircleIcon
          v-if="toastState.type === 'success'"
          class="h-6 w-6 mr-3 mt-0.5 fill-navy-blue"
        />
        <XCircleIcon v-else class="h-6 w-6 mr-3 mt-0.5 fill-golden-brown" />
        <p class="font-medium text-sm pt-0.5">{{ toastState.message }}</p>
      </div>
      <button
        @click="toastState.visible = false"
        class="p-1 -mr-1 rounded-full hover:bg-charcoal/10 transition-colors cursor-pointer"
      >
        <CloseIcon class="h-5 w-5 stroke-charcoal" />
      </button>
    </div>
  </div>
  </template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { RouterLink } from "vue-router";

// Mock API services, incorporating the address API mocks from the first component
// NOTE: I'm merging the mock addresses into the profile object and adding Zone/State to align with the first component's fields.
const initialAddresses = [
  {
    _id: "a1",
    label: "Home",
    line1: "123 Main St",
    line2: "Apt 5",
    city: "Awka",
    state: "Anambra",
    landmark: "Near Park",
    zone: "Awka Central",
  },
  {
    _id: "a2",
    label: "Work",
    line1: "456 Business Ave",
    line2: "Suite 200",
    city: "Onitsha",
    state: "Anambra",
    landmark: "Office Building",
    zone: "Onitsha North",
  },
];

const mockAddresses = ref(initialAddresses);
const fetchAddresses = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve({ addresses: mockAddresses.value });
    }, 300)
  );
const saveAddress = (address) =>
  new Promise((resolve) =>
    setTimeout(() => {
      const newId = `a${Date.now()}`;
      const newAddr = {
        _id: newId,
        ...address,
        state: "Anambra State", // Hardcoded for consistency with the first component's form
        zone: "New Zone (Simulated)",
      };
      mockAddresses.value.unshift(newAddr);
      resolve(newAddr);
    }, 500)
  );
const deleteAddress = (id) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      const initialLength = mockAddresses.value.length;
      mockAddresses.value = mockAddresses.value.filter((a) => a._id !== id);
      if (mockAddresses.value.length < initialLength) {
        resolve();
      } else {
        reject(new Error("Address not found."));
      }
    }, 400)
  );

// Existing Profile API mocks
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

// --- TOAST LOGIC (from component 2) ---
const useToast = () => {
  const toastState = reactive({
    visible: false,
    message: "",
    type: "success",
    timeout: null,
  });

  const show = (message, type) => {
    if (toastState.timeout) {
      clearTimeout(toastState.timeout);
    }
    toastState.message = message;
    toastState.type = type;
    toastState.visible = true;
    toastState.timeout = setTimeout(() => {
      toastState.visible = false;
    }, 4000);
  };

  return {
    showSuccess: (message) => show(message, "success"),
    showError: (message) => show(message, "error"),
    toastState,
  };
};

const {
  showSuccess: toastSuccess,
  showError: toastError,
  toastState,
} = useToast();

// --- DATA STATES (Merged & Adapted) ---

// Profile data (adapted from component 2, addresses are now managed separately)
const mockProfileData = {
  preferences: {
    detergent: "Klin (Standard)",
    fragrance: "Lavender",
    hanger: true,
    specialCareNotes:
      "Handle delicate fabrics separately.",
  },
  _id: "68d6bd2a0991a9ccaee454df",
  phone: "+2349037680235",
  fullName: "Senator lhuj",
  email: "obinnaedmund0@gmail.com",
  role: "user",
  isMember: true,
  referralCode: "REF5978",
  membershipStartedAt: "2025-09-29T14:48:18.989Z",
};

const profile = ref(mockProfileData);

// Address-specific states (from component 1)
const loading = ref(false); // Loading state for addresses list
const addressError = ref(null); // Error state for addresses list
const addresses = mockAddresses; // Use the mock's ref directly
const showAddresses = ref(true); // Changed to true by default for better visibility
const adding = ref(false); // Adding state for new address form

const newAddress = ref({
  label: "",
  line1: "",
  line2: "",
  city: "",
  state: "Anambra State",
  landmark: "",
});

// Profile & Password form states (from component 2)
const isUpdatingProfile = ref(false);
const isUpdatingPassword = ref(false);
const isTogglingMembership = ref(false);

const form = ref({
  fullName: profile.value.fullName,
  email: profile.value.email,
  phone: profile.value.phone,
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
});

// --- METHODS (Merged & Adapted) ---

// Address Methods
const loadAddresses = async () => {
  loading.value = true;
  addressError.value = null;
  try {
    const res = await fetchAddresses();
    // Since we're using a single mockAddresses ref, this just updates in case of external changes
    // addresses.value = res.addresses;
  } catch (err) {
    addressError.value = err.message || "Failed to load addresses";
  } finally {
    loading.value = false;
  }
};

const addAddress = async () => {
  adding.value = true;
  try {
    await saveAddress(newAddress.value);
    toastSuccess("Address added successfully! 🎉");

    newAddress.value = {
      label: "",
      line1: "",
      line2: "",
      city: "",
      state: "Anambra State",
      landmark: "",
    };

    // Reload or just show the addresses which uses the same ref
    showAddresses.value = true;
  } catch (err) {
    const message = err.message || "Failed to add address";
    toastError(message);
  } finally {
    adding.value = false;
  }
};

const deleteAddr = async (id) => {
  try {
    await deleteAddress(id);
    toastSuccess("Address deleted successfully.");
  } catch (err) {
    const message = err.message || "Failed to delete address";
    toastError(message);
  }
};

// Profile Methods
const handleUpdateProfile = async () => {
  isUpdatingProfile.value = true;
  try {
    const payload = { ...form.value };
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

const handleUpdatePassword = async () => {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    return toastError("Both password fields are required.");
  }

  isUpdatingPassword.value = true;
  try {
    const payload = { ...passwordForm.value };
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

const toggleMembership = async () => {
  isTogglingMembership.value = true;
  try {
    const isMember = profile.value.isMember;

    if (isMember) {
      await leaveMembership();
      profile.value.isMember = false;
      toastSuccess("Membership cancelled successfully.");
    } else {
      await joinMembership({});
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

const formatMembershipDate = (isoDate) => {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Lifecycle Hook
onMounted(loadAddresses);

// --- MOCK ICONS & COMPONENTS (from component 2) ---
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
      <p v-else class="text-charcoal p-2 border border-bone-white rounded-md">{{ value }}</p>
    </div>
  `,
};

// Helper component for preference fields (read-only)
const PrefField = {
  props: ["label", "value"],
  template: `
    <div>
      <p class="text-sm font-medium text-navy-blue/80">{{ label }}</p>
      <p class="text-charcoal font-medium">{{ value }}</p>
    </div>
  `,
};
</script>

<style scoped>
/*
 * Custom CSS: Consolidated styles from both components and applied your
 * specific custom properties and focus styles consistently.
 */
.bg-bone-white {
  background-color: var(--color-bone-white);
}
.bg-navy-blue {
  background-color: var(--color-navy-blue);
}
.bg-golden-brown {
  background-color: var(--color-golden-brown);
}
.bg-pure-gold {
  background-color: var(--color-pure-gold);
}

.text-navy-blue {
  color: var(--color-navy-blue);
}
.text-charcoal {
  color: var(--color-charcoal);
}
.text-golden-brown {
  color: var(--color-golden-brown);
}
.text-bone-white {
  color: var(--color-bone-white);
}

/* Custom Input Styling for Editable Fields (used for ALL inputs now) */
.input-display {
  width: 100%;
  /* Using a subtle border from charcoal for a clean look */
  border: 1px solid var(--color-charcoal, #302e2d);
  border-radius: 0.375rem; /* rounded-md */
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  background-color: white; /* Explicitly set white background */
  color: var(--color-charcoal);
}
.input-display:focus {
  /* Use Golden Brown for the focus ring for consistency */
  box-shadow: 0 0 0 2px var(--color-golden-brown);
  border-color: var(--color-golden-brown);
}
.input-display::placeholder {
  color: var(--color-charcoal, #302e2d);
  opacity: 0.5;
}
</style>