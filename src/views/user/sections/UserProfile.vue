<template>
  <div class="min-h-screen text-charcoal font-display pb-20 mt-10">
    <header
      class="max-w-6xl mx-auto border-b border-gray-200 bg-white/70 backdrop-blur-md p-4 md:p-6 flex flex-col md:flex-row justify-between items-center"
    >
      <h1 class="text-3xl md:text-4xl font-bold text-charcoal">My Profile</h1>
      <button
        @click="handleUpdateProfile"
        :disabled="isUpdatingProfile"
        class="mt-3 md:mt-0 flex items-center space-x-2 px-5 py-2 bg-golden-brown text-bone-white rounded-md hover:bg-navy-blue transition disabled:opacity-50 shadow cursor-pointer"
      >
        <font-awesome-icon :icon="['fas', 'save']" />
        <span>{{ isUpdatingProfile ? "Saving..." : "Save All Changes" }}</span>
      </button>
    </header>

    <main class="p-4 md:p-8 max-w-6xl mx-auto grid gap-8">
      <section
        class="bg-white rounded-2xl border border-golden-brown/30 p-6 flex flex-col md:flex-row items-center gap-10"
      >
        <div class="relative bg-charcoal/30 rounded-full">
          <img
            :src="photoUrl"
            alt="Profile"
            class="w-32 h-32 rounded-full object-cover"
          />

          <button
            class="absolute bottom-0 right-0 bg-charcoal text-bone-white p-2 rounded-full hover:bg-golden-brown transition cursor-pointer"
            @click="triggerPhotoUpload"
            :title="isUploadingPhoto ? 'Uploading...' : 'Upload new photo'"
            :disabled="isUploadingPhoto"
          >
            <font-awesome-icon
              :icon="isUploadingPhoto ? ['fas', 'spinner'] : ['fas', 'pen']"
              :spin="isUploadingPhoto"
            />
          </button>
          <input
            ref="photoInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handlePhotoUpload"
            :disabled="isUploadingPhoto"
          />
        </div>

        <div class="flex-1 grid gap-3 w-full">
          <div class="grid md:grid-cols-2 gap-4">
            <ProfileField
              label="Full Name:"
              v-model:value="form.fullName"
              editable
            />
            <ProfileField label="Email:" :value="form.email" />
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <ProfileField label="Phone:" v-model:value="form.phone" editable />
            <ProfileField label="Gender:" :value="form.gender" />
          </div>

          <div class="flex flex-wrap gap-3 mt-4">
            <button
              @click="showPasswordModal = true"
              class="flex items-center space-x-2 px-4 py-2 bg-navy-blue text-bone-white rounded-md hover:bg-charcoal transition cursor-pointer"
            >
              <font-awesome-icon :icon="['fas', 'key']" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </section>

      <section class="bg-charcoal rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-cream flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'crown']" />
            Membership
          </h2>
          <span
            :class="
              profile?.isMember ? 'text-brand-green' : 'text-golden-brown'
            "
            class="font-semibold"
          >
            {{ profile?.isMember ? "Active" : "Inactive" }}
          </span>
        </div>

        <p class="text-sm mb-4 text-bone-white">
          Enjoy exclusive discounts, faster pickups, and premium support when
          you join our membership plan.
        </p>

        <button
          v-if="profile?.isMember"
          @click="handleLeaveMembership"
          :disabled="isLeaving"
          class="px-4 py-2 bg-destructive text-white rounded-md hover:bg-charcoal transition disabled:opacity-50 cursor-pointer"
        >
          <font-awesome-icon :icon="['fas', 'times-circle']" class="mr-2" />
          {{ isLeaving ? "Cancelling..." : "Cancel Membership" }}
        </button>
        <button
          v-else
          @click="handleJoinMembership"
          :disabled="isJoining"
          class="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-navy-blue transition disabled:opacity-50 cursor-pointer"
        >
          <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2" />
          {{ isJoining ? "Joining..." : "Join Membership" }}
        </button>
      </section>

      <section class="bg-white rounded-2xl border border-golden-brown/30 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-navy-blue flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
            Manage Address
          </h2>
          <div class="flex gap-2">
            <button
              v-if="addresses.length > 0"
              @click="showAddresses = !showAddresses"
              class="flex items-center gap-2 px-3 py-2 border border-navy-blue text-navy-blue rounded-md hover:bg-navy-blue hover:text-white transition cursor-pointer"
            >
              <font-awesome-icon
                :icon="showAddresses ? ['fas', 'eye-slash'] : ['fas', 'eye']"
              />
              <span>{{ showAddresses ? "Hide" : "Show" }}</span>
            </button>
            <button
              @click="openAddAddressModal"
              class="flex items-center gap-2 border-2 border-dashed border-golden-brown text-golden-brown px-3 py-2 rounded-md hover:bg-golden-brown hover:text-bone-white transition cursor-pointer"
            >
              <font-awesome-icon :icon="['fas', 'plus']" />
              Add New Address
            </button>
          </div>
        </div>

        <div v-if="isLoadingAddresses" class="text-center text-gray-500 italic">
          Loading addresses...
        </div>

        <div
          v-else-if="addresses.length === 0"
          class="text-center text-gray-500 italic"
        >
          No addresses saved yet.
        </div>

        <div v-else-if="showAddresses" class="divide-y divide-gray-100">
          <div
            v-for="addr in addresses"
            :key="addr._id"
            class="py-4 flex justify-between items-start gap-3"
          >
            <div class="flex items-start gap-3">
              <font-awesome-icon
                :icon="['fas', 'location-dot']"
                class="text-golden-brown mt-1"
              />
              <div>
                <p class="font-semibold text-navy-blue">{{ addr.label }}</p>
                <p class="text-sm text-gray-500 mb-2">
                  <span>Address 1:</span> {{ addr.line1 }}
                </p>
                <p class="text-sm text-gray-500 mb-2">
                  <span>Address 2:</span>
                  {{ addr.line2 ? ", " + addr.line2 : "" }}
                </p>
                <p class="text-sm text-gray-500 mb-2">
                  <span>City:</span> {{ addr.city }}
                </p>
                <p class="text-sm text-gray-500 mb-2">
                  <span>LGA: </span> {{ addr.lga }}
                </p>
                <p class="text-sm text-gray-500 mb-2">
                  <span>State: </span> {{ addr.state }}
                </p>
                <p v-if="addr.landmark" class="text-sm text-gray-400 italic">
                  Landmark: {{ addr.landmark }}
                </p>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="startEditing(addr)"
                class="text-navy-blue hover:text-golden-brown transition cursor-pointer"
                :disabled="isDeletingAddress"
              >
                <font-awesome-icon :icon="['fas', 'pen']" />
              </button>
              <button
                @click="handleDeleteAddress(addr._id)"
                class="text-destructive hover:text-red-700 transition cursor-pointer"
                :disabled="isDeletingAddress"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl border border-golden-brown/30 p-6">
        <h2
          class="text-2xl font-bold mb-4 text-navy-blue flex items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'sliders-h']" /> Laundry Preferences
        </h2>
        <form @submit.prevent="savePreferences" class="grid gap-5">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-semibold text-navy-blue block mb-1"
                >Detergent</label
              >
              <input
                v-model="preferences.detergent"
                type="text"
                placeholder="Omo, Ariel…"
                class="input-display w-full"
              />
            </div>

            <div>
              <label class="text-sm font-semibold text-navy-blue block mb-1"
                >Fragrance</label
              >
              <CustomSelect
                v-model="preferences.fragrance"
                :options="fragranceOptionsFormatted"
                placeholder="Select fragrance"
              />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              id="hanger"
              v-model="preferences.hanger"
              type="checkbox"
              class="custom-checkbox"
            />
            <label for="hanger">Return clothes on hanger</label>
          </div>

          <div>
            <label class="text-sm font-semibold text-navy-blue block mb-1"
              >Special Care Notes</label
            >
            <textarea
              v-model="preferences.specialCareNotes"
              rows="3"
              class="input-display w-full"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isSavingPreferences"
              class="px-6 py-2 bg-navy-blue text-bone-white rounded-md hover:bg-golden-brown transition disabled:opacity-50 cursor-pointer"
            >
              {{ isSavingPreferences ? "Saving..." : "Save Preferences" }}
            </button>
          </div>
        </form>
      </section>

      <section
        class="bg-white rounded-2xl border border-golden-brown/30 p-6 text-center"
      >
        <h2
          class="text-2xl font-bold mb-4 text-navy-blue flex justify-center items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'gift']" /> Invite Friends
        </h2>
        <QrcodeVue
          v-if="referralLink"
          :value="referralLink"
          :size="160"
          class="mx-auto mb-4"
        />
        <p v-if="referralCode" class="font-mono text-lg text-golden-brown mb-3">
          {{ referralCode }}
        </p>
        <div
          v-if="referralCode && referralLink"
          class="flex justify-center gap-3"
        >
          <button
            @click="copyToClipboard(referralCode)"
            class="px-4 py-2 bg-golden-brown text-white rounded-md hover:bg-navy-blue transition cursor-pointer"
          >
            <font-awesome-icon :icon="['fas', 'copy']" /> Copy Code
          </button>
          <button
            @click="copyToClipboard(referralLink)"
            class="px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-golden-brown transition cursor-pointer"
          >
            <font-awesome-icon :icon="['fas', 'link']" /> Copy Link
          </button>
        </div>
        <p v-else class="text-gray-500">Loading referral information...</p>
      </section>
    </main>

    <div
      v-if="showAddressModal"
      class="fixed inset-0 flex items-center justify-center z-50 p-4 modal-backdrop"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 class="text-xl font-bold mb-4 text-navy-blue">
          {{ editingAddress ? "Edit Address" : "Add New Address" }}
        </h3>
        <form @submit.prevent="handleSaveAddress" class="grid gap-4">
          <div>
            <label class="text-sm font-semibold block mb-1">Label *</label>
            <input
              v-model="addressForm.label"
              type="text"
              placeholder="Home, Office, etc."
              class="input-display w-full"
              required
            />
          </div>

          <div>
            <label class="text-sm font-semibold block mb-1"
              >Address Line 1 *</label
            >
            <input
              v-model="addressForm.line1"
              type="text"
              placeholder="Street address"
              class="input-display w-full"
              required
            />
          </div>

          <div>
            <label class="text-sm font-semibold block mb-1"
              >Address Line 2</label
            >
            <input
              v-model="addressForm.line2"
              type="text"
              placeholder="Apartment, suite, etc."
              class="input-display w-full"
            />
          </div>

          <div>
            <label class="text-sm font-semibold block mb-1">Landmark</label>
            <input
              v-model="addressForm.landmark"
              type="text"
              placeholder="Nearby landmark"
              class="input-display w-full"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-semibold block mb-1">City *</label>
              <input
                v-model="addressForm.city"
                type="text"
                class="input-display w-full"
                required
              />
            </div>
            <div>
              <label class="text-sm font-semibold block mb-1">LGA *</label>
              <input
                v-model="addressForm.lga"
                type="text"
                placeholder="Local Govt Area"
                class="input-display w-full"
                required
              />
            </div>
          </div>

          <div>
            <label class="text-sm font-semibold block mb-1">State *</label>
            <input
              v-model="addressForm.state"
              type="text"
              class="input-display w-full bg-gray-50 cursor-not-allowed"
              readonly
            />
          </div>

          <div class="flex gap-3 mt-4">
            <button
              type="submit"
              :disabled="isSavingAddress"
              class="flex-1 px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-golden-brown transition disabled:opacity-50 cursor-pointer"
            >
              {{ isSavingAddress ? "Saving..." : "Save Address" }}
            </button>
            <button
              type="button"
              @click="closeAddressModal"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showPasswordModal"
      class="fixed inset-0 flex items-center justify-center z-50 p-4 modal-backdrop"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4 text-navy-blue">New Password</h3>
        <p class="text-sm mb-4 text-charcoal">
          Your new password must be different from previously used passwords.
        </p>
        <form @submit.prevent="handleChangePassword" class="grid gap-4">
          <div class="relative">
            <label class="text-sm font-semibold block mb-1"
              >Current Password</label
            >
            <input
              :type="showCurrent ? 'text' : 'password'"
              v-model="passwordForm.currentPassword"
              class="input-display w-full"
              required
            />
            <button
              type="button"
              @click="showCurrent = !showCurrent"
              class="absolute right-3 top-9 text-gray-500 cursor-pointer"
            >
              <font-awesome-icon
                :icon="showCurrent ? ['fas', 'eye-slash'] : ['fas', 'eye']"
              />
            </button>
          </div>

          <div class="relative">
            <label class="text-sm font-semibold block mb-1">New Password</label>
            <input
              :type="showNew ? 'text' : 'password'"
              v-model="passwordForm.newPassword"
              class="input-display w-full"
              required
            />
            <button
              type="button"
              @click="showNew = !showNew"
              class="absolute right-3 top-9 text-gray-500 cursor-pointer"
            >
              <font-awesome-icon
                :icon="showNew ? ['fas', 'eye-slash'] : ['fas', 'eye']"
              />
            </button>
          </div>

          <div class="relative">
            <label class="text-sm font-semibold block mb-1"
              >Confirm New Password</label
            >
            <input
              :type="showConfirm ? 'text' : 'password'"
              v-model="passwordForm.confirmPassword"
              class="input-display w-full"
              required
            />
            <button
              type="button"
              @click="showConfirm = !showConfirm"
              class="absolute right-3 top-9 text-gray-500 cursor-pointer"
            >
              <font-awesome-icon
                :icon="showConfirm ? ['fas', 'eye-slash'] : ['fas', 'eye']"
              />
            </button>
          </div>

          <div class="flex gap-3 mt-4">
            <button
              type="submit"
              :disabled="isChangingPassword"
              class="flex-1 px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-golden-brown transition disabled:opacity-50 cursor-pointer"
            >
              {{ isChangingPassword ? "Changing..." : "Change Password" }}
            </button>
            <button
              type="button"
              @click="closePasswordModal"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 flex items-center justify-center z-50 p-4 modal-backdrop"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full text-center">
        <h3 class="text-lg font-semibold mb-3 text-navy-blue">
          Delete Address?
        </h3>
        <p class="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this address? This action cannot be
          undone.
        </p>
        <div class="flex justify-center gap-3">
          <button
            @click="confirmDeleteAddress"
            class="px-4 py-2 bg-destructive text-white rounded-md hover:bg-red-700 transition cursor-pointer"
            :disabled="isDeletingAddress"
          >
            {{ isDeletingAddress ? "Deleting..." : "Yes, Delete" }}
          </button>
          <button
            @click="cancelDeleteAddress"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-console */
import { ref, onMounted, computed, watch } from "vue";
import QrcodeVue from "qrcode.vue";
import ProfileField from "@/components/ProfileField.vue";
import CustomSelect from "@/components/atoms/CustomSelect.vue";
import { useUser } from "@/composables/useUser";
import { useToast } from "@/composables/useToast";
import {
  updateUserProfile,
  updateProfilePhoto, // <-- NEW IMPORT
  updatePassword,
  fetchAddresses,
  saveAddress,
  updateAddress,
  deleteAddress as deleteAddressAPI,
  updatePreferences,
  joinMembership,
  leaveMembership,
  getReferralInfo,
} from "@/services/api";

const { user: profile, isLoadingUser, loadUser } = useUser();
const { showToast } = useToast();
const showDeleteConfirm = ref(false);
const deleteTargetId = ref(null);

// Form fields for profile text updates
const form = ref({ fullName: "", email: "", phone: "", lga: "" });

const preferences = ref({
  detergent: "",
  hanger: false,
  fragrance: "",
  specialCareNotes: "",
});
const addresses = ref([]);
const isLoadingAddresses = ref(false);

const isUpdatingProfile = ref(false); // For text field updates
const isSavingPreferences = ref(false);
const isJoining = ref(false);
const isLeaving = ref(false);
const isDeletingAddress = ref(false);
const isSavingAddress = ref(false);
const isChangingPassword = ref(false);
const isUploadingPhoto = ref(false); // For photo upload ONLY

const fragranceOptions = ["Lavender", "Rose", "Vanilla", "Unscented"];
const fragranceOptionsFormatted = fragranceOptions.map((v) => ({
  label: v,
  value: v,
}));
const genderOptions = ["Male", "Female", "Other"];
const genderOptionsFormatted = genderOptions.map((v) => ({
  label: v,
  value: v,
}));
const genderOptionsRef = genderOptionsFormatted;

const referralCode = ref("");
const referralLink = ref("");
const showAddresses = ref(true);

const showAddressModal = ref(false);
const showPasswordModal = ref(false);
const editingAddress = ref(null);
const photoInput = ref(null);

const addressForm = ref({
  label: "",
  line1: "",
  line2: "",
  city: "",
  state: "Anambra", // auto-fill
  landmark: "",
  lga: "",
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

onMounted(async () => {
  await loadUser();
  if (profile.value) {
    // Mapped the 'lga' field from the profile object on load
    form.value = {
      fullName: profile.value.fullName || "",
      email: profile.value.email || "",
      phone: profile.value.phone || "",
      lga: profile.value.lga || "", // Get LGA from the profile object
      gender: profile.value.gender || "",
    };

    // Load preferences if they exist
    if (profile.value.preferences) {
      preferences.value = {
        detergent: profile.value.preferences.detergent || "",
        hanger: profile.value.preferences.hanger || false,
        fragrance: profile.value.preferences.fragrance || "",
        specialCareNotes: profile.value.preferences.specialCareNotes || "",
      };
    }
  }

  await loadAddresses();
  await loadReferralInfo();
});

/* ---------- Addresses ---------- */
const loadAddresses = async () => {
  try {
    isLoadingAddresses.value = true;
    const data = await fetchAddresses();
    addresses.value = data?.addresses || data || [];
  } catch (err) {
    console.error("Failed to load addresses:", err);
    showToast("Failed to load addresses", "error");
  } finally {
    isLoadingAddresses.value = false;
  }
};

const openAddAddressModal = () => {
  editingAddress.value = null;
  // ensure state is Anambra and readonly
  addressForm.value = {
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "Anambra", // auto-fill
    landmark: "",
    lga: "",
  };
  showAddressModal.value = true;
};

const startEditing = (addr) => {
  editingAddress.value = addr;
  addressForm.value = {
    label: addr.label || "",
    line1: addr.line1 || "",
    line2: addr.line2 || "",
    city: addr.city || "",
    state: "Anambra", // enforce Anambra on edit as required
    landmark: addr.landmark || "",
    lga: addr.lga || "",
  };
  showAddressModal.value = true;
};

const handleSaveAddress = async () => {
  // enforce required fields
  if (
    !addressForm.value.label ||
    !addressForm.value.line1 ||
    !addressForm.value.city ||
    !addressForm.value.lga
  ) {
    showToast("Please fill all required address fields", "error");
    return;
  }

  isSavingAddress.value = true;
  try {
    // unify payload to backend expectation
    const payload = { ...addressForm.value, state: "Anambra" };
    if (editingAddress.value) {
      await updateAddress(editingAddress.value._id, payload);
      showToast("Address updated successfully", "success");
    } else {
      await saveAddress(payload);
      showToast("Address added successfully", "success");
    }
    closeAddressModal();
    // reloading the addresses after saving/editing
    await loadAddresses();
  } catch (err) {
    console.error("Save address error:", err);
    showToast(err.message || "Failed to save address", "error");
  } finally {
    isSavingAddress.value = false;
  }
};

const closeAddressModal = () => {
  showAddressModal.value = false;
  editingAddress.value = null;
  addressForm.value = {
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "Anambra",
    landmark: "",
    lga: "",
  };
};

const handleDeleteAddress = (addressId) => {
  deleteTargetId.value = addressId;
  showDeleteConfirm.value = true;
};
const confirmDeleteAddress = async () => {
  if (!deleteTargetId.value) return;
  isDeletingAddress.value = true;
  try {
    await deleteAddressAPI(deleteTargetId.value);
    showToast("Address deleted successfully", "success");
    await loadAddresses();
  } catch (err) {
    console.error("Delete address error:", err);
    showToast(err.message || "Failed to delete address", "error");
  } finally {
    isDeletingAddress.value = false;
    showDeleteConfirm.value = false;
    deleteTargetId.value = null;
  }
};
const cancelDeleteAddress = () => {
  showDeleteConfirm.value = false;
  deleteTargetId.value = null;
};

/* ---------- Profile Update (Text Fields) ---------- */
const handleUpdateProfile = async () => {
  isUpdatingProfile.value = true;
  try {
    const payload = {
      fullName: form.value.fullName,
      phone: form.value.phone,
      lga: form.value.lga, // Include LGA in the update payload
    };

    const updatedProfile = await updateUserProfile(payload);
    profile.value = updatedProfile.user || updatedProfile;

    showToast("Profile updated successfully", "success");
  } catch (err) {
    console.error("Profile update error:", err);
    showToast(err.message || "Failed to update profile", "error");
  } finally {
    isUpdatingProfile.value = false;
  }
};


const triggerPhotoUpload = () => {
  if (isUploadingPhoto.value) return; 
  photoInput.value?.click();
};
const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("photo", file); // ✅ must match upload.single('photo')

    isUploadingPhoto.value = true;

    const updatedProfile = await updateProfilePhoto(formData);

    profile.value = updatedProfile.user || updatedProfile;

    showToast("Profile picture updated successfully!", "success");
  } catch (err) {
    console.error("Error uploading profile photo:", err);
    showToast("Failed to update profile picture", "error");
  } finally {
    isUploadingPhoto.value = false;
    if (photoInput.value) photoInput.value.value = "";
  }
};

const photoUrl = computed(() => {
  const user = profile.value;
  if (!user || !user.photoUrl) {
    return "/profileAvatar.png";
  }
  return user.photoUrl;
});

/* ---------- Preferences ---------- */
const savePreferences = async () => {
  isSavingPreferences.value = true;
  try {
    // IMPORTANT: backend expects { preferences: { ... } }
    await updatePreferences({ preferences: preferences.value });
    // reflect locally on profile
    profile.value.preferences = {
      ...(profile.value.preferences || {}),
      ...preferences.value,
    };
    showToast("Preferences saved successfully", "success");
  } catch (err) {
    console.error("Preferences save error:", err);
    showToast(err.message || "Failed to save preferences", "error");
  } finally {
    isSavingPreferences.value = false;
  }
};

/* ---------- Membership ---------- */
const handleJoinMembership = async () => {
  isJoining.value = true;
  try {
    await joinMembership();
    profile.value.isMember = true;
    showToast("Joined membership successfully!", "success");
  } catch (err) {
    console.error("Join membership error:", err);
    showToast(err.message || "Failed to join membership", "error");
  } finally {
    isJoining.value = false;
  }
};

const handleLeaveMembership = async () => {
  isLeaving.value = true;
  try {
    await leaveMembership();
    profile.value.isMember = false;
    showToast("Membership cancelled.", "success");
  } catch (err) {
    console.error("Leave membership error:", err);
    showToast(err.message || "Failed to cancel membership", "error");
  } finally {
    isLeaving.value = false;
  }
};

/* ---------- Referral ---------- */
const loadReferralInfo = async () => {
  try {
    const data = await getReferralInfo();
    referralCode.value = data?.referralCode || "";
    referralLink.value = data?.referralLink || "";
  } catch (err) {
    console.error("Failed to load referral info:", err);
  }
};

/* ---------- Change password ---------- */
const handleChangePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  isChangingPassword.value = true;
  try {
    await updatePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    });
    showToast("Password changed successfully", "success");
    closePasswordModal();
  } catch (err) {
    console.error("Change password error:", err);
    showToast(err.message || "Failed to change password", "error");
  } finally {
    isChangingPassword.value = false;
  }
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
  passwordForm.value = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  showCurrent.value = showNew.value = showConfirm.value = false;
};

/* ---------- Util ---------- */
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  } catch (err) {
    showToast("Failed to copy", "error");
  }
};

watch(
  profile,
  (newProfile) => {
    
    if (newProfile && newProfile.photoUrl) {
      newProfile.photoUrl =
        newProfile.photoUrl.split("?")[0] + `?t=${Date.now()}`;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.modal-backdrop {
  /* Slightly transparent RGBA backdrop as requested */
  background-color: rgba(2, 6, 23, 0.45);
}

/* Inputs */
.input-display {
  border: 1px solid #302e2d;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: all 0.2s;
}
.input-display:focus {
  border-color: #996515;
  box-shadow: 0 0 0 2px #99651533;
}

/* Checkbox */
.custom-checkbox {
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #302e2d;
  border-radius: 0.25rem;
  cursor: pointer;
  position: relative;
}
.custom-checkbox:checked {
  background-color: #996515;
  border-color: #996515;
}
.custom-checkbox:checked::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 00-1.414 0L7 8.586 4.207 5.793a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0l5-5a1 1 0 000-1.414z'/%3e%3c/svg%3e");
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}

/* Palette helpers */
.text-brand-green {
  color: #27b8a7;
}
.bg-brand-green {
  background-color: #27b8a7;
}

.bg-destructive {
  /* Mapping from previous context/guidelines */
  background-color: #dc2626;
}
</style>
