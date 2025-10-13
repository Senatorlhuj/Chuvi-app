<template>
  <div
    class="p-6 md:p-10 max-w-6xl mx-auto text-charcoal font-display min-h-screen"
  >
    <h1
      class="text-4xl font-extrabold mb-8 text-navy-blue border-b-2 border-navy-blue/10 pb-4"
    >
      My Profile & Settings
    </h1>

    <div v-if="isLoadingUser" class="text-center py-6 text-charcoal">
      Loading profile...
    </div>

    <div v-else-if="profile">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-1 space-y-8">
          <!-- Account Details -->
          <div
            class="p-6 bg-bone-white rounded-lg border-t-4 border-golden-brown shadow-lg"
          >
            <h2
              class="text-2xl font-bold mb-4 text-navy-blue flex items-center"
            >
              <font-awesome-icon
                :icon="['fas', 'user']"
                class="w-5 h-5 mr-2"
              />Account Details
            </h2>

            <div class="space-y-4">
              <ProfileField
                label="Full Name"
                v-model:value="form.fullName"
                editable
              />
              <ProfileField label="Email" :value="form.email" />
              <ProfileField label="Phone" v-model:value="form.phone" editable />
              <ProfileField label="Role" :value="profile.role" />
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

          <!-- Change Password -->
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

          <!-- Membership -->
          <div
            class="p-6 bg-bone-white rounded-lg border-t-4 border-pure-gold shadow-lg"
          >
            <h2
              class="text-2xl font-bold mb-4 text-navy-blue flex items-center"
            >
              <font-awesome-icon
                :icon="['fas', 'crown']"
                class="w-5 h-5 mr-2"
              />Membership
            </h2>

            <p class="text-charcoal font-semibold">
              Status:
              <span
                :class="
                  profile.isMember ? 'text-brand-green' : 'text-golden-brown'
                "
                class="font-extrabold"
              >
                {{ profile.isMember ? "Active" : "Inactive" }}
              </span>
            </p>

            <div class="mt-6">
              <button
                v-if="profile.isMember"
                @click="handleLeaveMembership"
                :disabled="isLeaving"
                class="w-full px-4 py-2 bg-charcoal text-bone-white rounded-sm hover:bg-destructive transition-colors disabled:opacity-50 text-sm font-semibold cursor-pointer shadow-md"
              >
                {{ isLeaving ? "Cancelling..." : "Cancel Membership" }}
              </button>
              <button
                v-else
                @click="handleJoinMembership"
                :disabled="isJoining"
                class="w-full px-4 py-2 bg-brand-green text-bone-white rounded-sm hover:bg-navy-blue transition-colors disabled:opacity-50 text-sm font-semibold cursor-pointer shadow-md"
              >
                {{ isJoining ? "Joining..." : "Join Membership Now" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Saved Addresses -->
          <div
            class="p-6 bg-bone-white rounded-lg border-t-4 border-navy-blue shadow-lg"
          >
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-navy-blue flex items-center">
                <font-awesome-icon
                  :icon="['fas', 'map-pin']"
                  class="w-5 h-5 mr-2"
                />
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
              <div
                v-if="loadingAddresses"
                class="text-charcoal text-center py-4"
              >
                <span class="animate-pulse">Loading addresses…</span>
              </div>

              <div
                v-else-if="addressError"
                class="text-destructive font-semibold bg-destructive/10 p-3 rounded-md"
              >
                {{ addressError }}
              </div>

              <div v-else class="space-y-4">
                <p
                  v-if="addresses.length === 0"
                  class="text-charcoal opacity-70 italic"
                >
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
                        <span class="text-xs text-charcoal opacity-60 ml-2"
                          >({{ addr.city }})</span
                        >
                      </h3>
                      <p class="text-charcoal">{{ addr.line1 }}</p>
                      <p v-if="addr.line2" class="text-charcoal">
                        {{ addr.line2 }}
                      </p>
                      <p
                        v-if="addr.lga"
                        class="text-charcoal text-sm font-light"
                      >
                        LGA: <span class="font-semibold">{{ addr.lga }}</span>
                      </p>
                      <p
                        v-if="addr.landmark"
                        class="text-charcoal text-sm font-light"
                      >
                        Landmark: {{ addr.landmark }}
                      </p>
                    </div>

                    <!-- Edit button -->
                    <button
                      @click="startEditing(addr)"
                      class="text-sm text-navy-blue hover:text-golden-brown transition-colors font-semibold cursor-pointer p-2 rounded-full"
                    >
                      Edit
                    </button>
                  </div>

                  <!-- Edit form (inline) -->
                  <div
                    v-if="editingAddress && editingAddress._id === addr._id"
                    class="mt-4 border-t border-charcoal/10 pt-4 space-y-3"
                  >
                    <input
                      v-model="editingAddress.label"
                      class="input-display w-full"
                      placeholder="Label"
                    />
                    <input
                      v-model="editingAddress.line1"
                      class="input-display w-full"
                      placeholder="Line 1"
                    />
                    <input
                      v-model="editingAddress.line2"
                      class="input-display w-full"
                      placeholder="Line 2 (optional)"
                    />
                    <input
                      v-model="editingAddress.city"
                      class="input-display w-full"
                      placeholder="City"
                    />
                    <input
                      v-model="editingAddress.lga"
                      class="input-display w-full"
                      placeholder="LGA"
                    />
                    <input
                      v-model="editingAddress.state"
                      class="input-display w-full"
                      placeholder="State"
                    />
                    <input
                      v-model="editingAddress.landmark"
                      class="input-display w-full"
                      placeholder="Landmark"
                    />

                    <div class="flex justify-end space-x-2">
                      <button
                        @click="cancelEdit"
                        class="px-4 py-2 text-charcoal border border-charcoal/30 rounded-sm hover:bg-charcoal hover:text-bone-white transition-colors text-sm font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        @click="saveEditedAddress"
                        :disabled="savingEdit"
                        class="px-4 py-2 bg-golden-brown text-bone-white rounded-sm hover:bg-navy-blue transition-colors text-sm font-semibold cursor-pointer shadow-md"
                      >
                        {{ savingEdit ? "Saving…" : "Save Changes" }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Add New Address -->
          <div
            class="p-6 bg-bone-white rounded-lg border-t-4 border-golden-brown shadow-lg"
          >
            <h3 class="text-2xl font-bold mb-4 text-navy-blue">
              Add New Address
            </h3>
            <form
              @submit.prevent="addAddress"
              class="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
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
                <label class="block text-sm mb-1 text-charcoal">LGA</label>
                <input
                  v-model="newAddress.lga"
                  type="text"
                  required
                  class="input-display"
                  placeholder="Awka South"
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
        </div>
      </div>
    </div>

    <div
      v-else-if="!isLoadingUser && userError"
      class="text-center py-6 text-destructive font-semibold bg-destructive/10 p-4 rounded-lg max-w-lg mx-auto"
    >
      Failed to load user profile: {{ userError }}
    </div>
  </div>

  <Toast />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUser } from "@/composables/useUser";
import { useToast } from "@/composables/useToast";
import ProfileField from "@/components/ProfileField.vue";
import Toast from "@/components/Toast.vue";
import {
  updateProfile,
  updatePassword,
  fetchAddresses,
  saveAddress,
  updateAddress,
  joinMembership,
  leaveMembership,
} from "@/services/api";

const { showToast } = useToast();
const { user: profile, isLoadingUser, userError, loadUser } = useUser();
const editingAddress = ref(null)
const savingEdit = ref(false)

const form = ref({ fullName: "", email: "", phone: "" });
const passwordForm = ref({ currentPassword: "", newPassword: "" });
const isUpdatingProfile = ref(false);
const isUpdatingPassword = ref(false);
const isJoining = ref(false);
const isLeaving = ref(false);

const addresses = ref([]);
const loadingAddresses = ref(false);
const addressError = ref(null);
const showAddresses = ref(true);
const adding = ref(false);
const newAddress = ref({
  label: "",
  line1: "",
  line2: "",
  city: "",
  lga: "",
  state: "",
  landmark: "",
});
const startEditing = (addr) => {
  editingAddress.value = { ...addr } // make a copy
}
const cancelEdit = () => {
  editingAddress.value = null
}
const saveEditedAddress = async () => {
  if (!editingAddress.value.lga) return showToast("LGA is required.", "error")
  savingEdit.value = true
  try {
    const updated = await updateAddress(editingAddress.value._id, editingAddress.value)
    const index = addresses.value.findIndex(a => a._id === editingAddress.value._id)
    if (index !== -1) addresses.value[index] = updated.address || updated
    editingAddress.value = null
    showToast("Address updated successfully!", "success")
  } catch (err) {
    console.error(err)
    showToast(`Failed to update address: ${err.message || "Server error"}`, "error")
  } finally {
    savingEdit.value = false
  }
}
// Load user profile
onMounted(async () => {
  await loadUser();
  if (profile.value) {
    form.value = {
      fullName: profile.value.fullName,
      email: profile.value.email,
      phone: profile.value.phone,
    };
    await loadAddresses();
  }
});

const handleUpdateProfile = async () => {
  isUpdatingProfile.value = true;
  try {
    const updated = await updateProfile({
      fullName: form.value.fullName,
      phone: form.value.phone,
    });
    Object.assign(profile.value, updated);
    showToast("Profile updated successfully!", "success");
  } catch (err) {
    showToast(`Failed to update profile: ${err.message}`, "error");
  } finally {
    isUpdatingProfile.value = false;
  }
};

const handleUpdatePassword = async () => {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword)
    return showToast("Please fill both fields", "error");
  isUpdatingPassword.value = true;
  try {
    await updatePassword(passwordForm.value);
    passwordForm.value.currentPassword = "";
    passwordForm.value.newPassword = "";
    showToast("Password updated successfully!", "success");
  } catch (err) {
    showToast("Failed to update password", "error");
  } finally {
    isUpdatingPassword.value = false;
  }
};

const loadAddresses = async () => {
  loadingAddresses.value = true;
  try {
    const res = await fetchAddresses();
    addresses.value = res.addresses || [];
  } catch (err) {
    addressError.value = err.message || "Failed to fetch addresses";
  } finally {
    loadingAddresses.value = false;
  }
};

const addAddress = async () => {
  if (
    !newAddress.value.label ||
    !newAddress.value.line1 ||
    !newAddress.value.city ||
    !newAddress.value.lga ||
    !newAddress.value.state
  )
    return showToast("Please fill all required fields.", "error");
  adding.value = true;
  try {
    const saved = await saveAddress(newAddress.value);
    addresses.value.push(saved.address || saved);
    newAddress.value = {
      label: "",
      line1: "",
      line2: "",
      city: "",
      lga: "",
      state: "",
      landmark: "",
    };
    showToast("Address added successfully!", "success");
  } catch (err) {
    showToast(`Failed to add address: ${err.message}`, "error");
  } finally {
    adding.value = false;
  }
};

const updateAddressUI = async (addr) => {
  try {
    const updated = await updateAddress(addr._id, {
      label: addr.label,
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      lga: addr.lga,
      state: addr.state,
      landmark: addr.landmark,
    });
    Object.assign(addr, updated.address || updated);
    addr.isEditing = false;
    showToast("Address updated successfully!", "success");
  } catch (err) {
    showToast(`Failed to update address: ${err.message}`, "error");
  }
};

const handleJoinMembership = async () => {
  isJoining.value = true;
  try {
    const res = await joinMembership();
    Object.assign(profile.value, res.user || {});
    showToast("Membership joined successfully!", "success");
  } catch (err) {
    showToast(`Failed to join: ${err.message}`, "error");
  } finally {
    isJoining.value = false;
  }
};

const handleLeaveMembership = async () => {
  isLeaving.value = true;
  try {
    const res = await leaveMembership();
    Object.assign(profile.value, res.user || {});
    showToast("Membership cancelled.", "success");
  } catch (err) {
    showToast(`Failed to leave: ${err.message}`, "error");
  } finally {
    isLeaving.value = false;
  }
};
</script>

<style scoped>
.input-display {
  width: 100%;
  border: 1px solid #302e2d;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  color: #302e2d;
}
.input-display:focus {
  border-color: #996515;
  box-shadow: 0 0 0 2px #996515;
}
.text-brand-green {
  color: #27b8a7;
}
.bg-brand-green {
  background-color: #27b8a7;
}
.text-destructive {
  color: hsl(14, 100%, 57%);
}
.bg-destructive\/10 {
  background-color: rgba(255, 68, 68, 0.1);
}
.border-pure-gold {
  border-color: #e5b80b;
}
</style>
