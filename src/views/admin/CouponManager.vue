<template>
  <div class="p-6 min-h-[80vh]">
    <h2 class="text-3xl font-bold text-navy-blue mb-6 border-b pb-2">
      Coupon Manager
    </h2>

    <div
      v-if="couponToDeleteId"
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-bone-white p-6 rounded-lg max-w-sm w-full">
        <h3 class="text-xl font-bold text-destructive mb-3">
          Confirm Deletion
        </h3>
        <p class="text-charcoal mb-4">
          Are you sure you want to delete coupon
          <span class="text-golden-brown font-bold">{{
            couponToDeleteCode
          }}</span
          >? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="couponToDeleteId = null"
            class="px-4 py-2 bg-gray-300 text-charcoal rounded-md hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteConfirm"
            :disabled="loading"
            class="px-4 py-2 bg-red-700 text-bone-white rounded-md hover:bg-red-500 disabled:opacity-50 cursor-pointer"
          >
            {{ loading ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
    <div class="max-w-2xl mx-auto bg-bone-white p-8 rounded-xl mb-10">
      <h3 class="text-xl font-semibold text-navy-blue mb-4">
        {{ isEditing ? "Edit Coupon" : "Create New Coupon" }}
      </h3>
      <form
        @submit.prevent="handleFormSubmit"
        class="space-y-4 grid grid-cols-2 gap-4"
      >
        <div
          class="col-span-2 space-y-1"
          :class="{ 'opacity-50 pointer-events-none': isEditing }"
        >
          <label class="text-sm font-medium text-charcoal block"
            >Coupon Code (Required)</label
          >
          <div class="flex space-x-2">
            <input
              type="text"
              v-model="couponData.couponCode"
              placeholder="e.g., FALL20 or click 'Generate'"
              :disabled="isEditing"
              required
              class="flex-1 w-full p-3 border border-gray-300 rounded-md focus:ring-pure-gold focus:border-pure-gold transition duration-150 text-charcoal bg-bone-white disabled:bg-gray-200"
            />

            <button
              type="button"
              @click="handleGenerateCode"
              :disabled="isEditing || loading"
              class="px-4 py-2 bg-golden-brown text-bone-white rounded-md font-semibold text-sm hover:bg-pure-gold transition-colors disabled:opacity-50 cursor-pointer"
            >
              Generate
            </button>

            <button
              type="button"
              @click="handleCopyCode"
              :disabled="!couponData.couponCode || isEditing || loading"
              class="px-4 py-2 bg-brand-green text-bone-white rounded-md font-semibold text-sm hover:bg-brand-green/80 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <font-awesome-icon icon="fa-solid fa-copy" class="mr-1" /> Copy
            </button>
          </div>
        </div>
        <div class="col-span-1 space-y-1">
          <label class="text-sm font-medium text-charcoal block"
            >Discount Type</label
          >
          <div
            class="flex space-x-2 p-1 bg-cream/50 rounded-lg border border-gray-300"
          >
            <button
              type="button"
              @click="discountType = 'percent'"
              :class="[
                'flex-1 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer',
                discountType === 'percent'
                  ? 'bg-navy-blue text-bone-white'
                  : 'text-charcoal hover:bg-cream',
              ]"
            >
              Percentage (%)
            </button>

            <button
              type="button"
              @click="discountType = 'amount'"
              :class="[
                'flex-1 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer',
                discountType === 'amount'
                  ? 'bg-navy-blue text-bone-white'
                  : 'text-charcoal hover:bg-cream',
              ]"
            >
              Fixed Amount (₦)
            </button>
          </div>
        </div>

        <FormField
          :label="
            discountType === 'percent'
              ? 'Discount Percentage (%)'
              : 'Discount Amount (₦)'
          "
          type="number"
          v-model="discountValue"
          placeholder="e.g., 15 or 500"
          class="col-span-1"
          required
          min="0"
          :max="discountType === 'percent' ? 100 : undefined"
          inputClass="[appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />

        <div class="col-span-1 space-y-1">
          <label
            class="text-sm font-medium text-charcoal block"
            for="expiry-date-picker"
            >Expiry Date</label
          >
          <flat-pickr
            id="expiry-date-picker"
            v-model="couponData.expiryDate"
            :config="datePickerConfig"
            placeholder="YYYY-MM-DD"
            required
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-pure-gold focus:border-pure-gold transition duration-150 text-charcoal bg-bone-white"
          />
        </div>

        <FormField
          label="Min Order Value (₦)"
          type="number"
          v-model="couponData.minOrderValue"
          placeholder="e.g., 5000"
          class="col-span-1"
          min="0"
          inputClass="[appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />

        <FormField
          label="Max Total Uses"
          type="number"
          v-model="couponData.maxUsage"
          placeholder="e.g., 100"
          class="col-span-1"
          min="1"
          inputClass="[appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />

        <div class="col-span-2 flex space-x-4 pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-navy-blue text-bone-white py-3 rounded-md font-semibold text-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {{
              loading
                ? "Processing..."
                : isEditing
                ? "Save Changes"
                : "Create Coupon"
            }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            @click="resetForm"
            class="w-1/4 bg-gray-300 text-charcoal py-3 rounded-md font-semibold text-lg hover:bg-gray-400 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    <div class="border-t pt-8">
      <h3 class="text-2xl font-bold text-navy-blue mb-4">
        All Coupons ({{ coupons.length }})
      </h3>

      <p v-if="loadingCoupons" class="text-charcoal/70">Loading coupons...</p>
      <p
        v-else-if="!coupons.length"
        class="text-charcoal/70 p-4 bg-bone-white rounded-md"
      >
        No coupons found.
      </p>

      <div
        v-else
        class="bg-bone-white p-6 rounded-xl border border-gray-200 overflow-x-auto"
      >
        <div
          class="grid grid-cols-8 gap-4 p-2 text-sm font-bold border-b-2 border-charcoal/50 mb-2 text-navy-blue min-w-[900px]"
        >
          <span class="col-span-2">Coupon ID</span>
          <span class="col-span-1">Code</span>
          <span class="col-span-1">Discount</span>
          <span class="col-span-1">Expiry Date</span>
          <span class="col-span-1">Max Uses</span>
          <span class="col-span-1 text-center">Active</span>
          <span class="col-span-1 text-right">Actions</span>
        </div>

        <div
          v-for="coupon in coupons"
          :key="coupon._id"
          class="grid grid-cols-8 gap-4 items-center p-2 text-sm text-charcoal even:bg-cream/70 rounded-md min-w-[900px]"
        >
          <code
            class="col-span-2 text-xs truncate text-golden-brown bg-gray-100 p-1 rounded font-mono"
            >{{ coupon._id }}</code
          >

          <span class="font-semibold col-span-1">{{ coupon.code }}</span>

          <span class="col-span-1 font-mono">
            {{
              coupon.discountPercent
                ? coupon.discountPercent + "%"
                : "₦" + formatCurrencyValue(coupon.discountAmount)
            }}
          </span>

          <span class="col-span-1">
            {{ formatDate(coupon.expiresAt) }}
          </span>

          <span class="col-span-1">{{ coupon.maxUses }}</span>

          <div class="col-span-1 flex justify-center">
            <button
              @click="toggleStatus(coupon)"
              :disabled="loading"
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer',
                coupon.isActive
                  ? 'bg-green-400 text-bone-white hover:bg-green-300'
                  : 'bg-charcoal text-bone-white hover:bg-destructive/80',
              ]"
            >
              {{ coupon.isActive ? "Active" : "Inactive" }}
            </button>
          </div>

          <div class="col-span-1 flex justify-end space-x-2">
            <button
              @click="startEdit(coupon)"
              :disabled="loading"
              class="text-pure-gold hover:text-golden-brown transition-colors disabled:opacity-50 cursor-pointer"
            >
              <font-awesome-icon icon="fa-solid fa-pen-to-square" />
            </button>
            <button
              @click="prepareDelete(coupon._id, coupon.code)"
              :disabled="loading"
              class="text-charcoal hover:text-red-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <font-awesome-icon icon="fa-solid fa-trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import FormField from "@/components/atoms/FormField.vue";
import flatPickr from "vue-flatpickr-component";
import { useToast } from "@/composables/useToast";
import "flatpickr/dist/flatpickr.css";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
} from "@/services/api.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"; // FontAwesomeIcon is already imported

const { showSuccess, showError } = useToast();

// --- UTILITY: CODE GENERATION ---
// --- UTILITY: CODE GENERATION (UPDATED) ---
const generateRandomCode = (length = 25) => {
    // Character set: Uppercase A-Z, Digits 0-9, and symbols @ and -
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@-'; 
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Ensure the output is fully uppercase (for redundancy/safety, though the source string is uppercase)
    return result.toUpperCase(); 
};

// --- HANDLERS FOR UI ---
const handleGenerateCode = () => {
    if (isEditing.value) return;
    const newCode = generateRandomCode(); // Uses the default length of 25
    couponData.value.couponCode = newCode;
    showSuccess(`Generated 25-character code: ${newCode}`);
};

// ... (rest of the script remains the same)

const handleCopyCode = async () => {
  if (!couponData.value.couponCode) {
    showError("Nothing to copy!");
    return;
  }
  try {
    await navigator.clipboard.writeText(couponData.value.couponCode);
    showSuccess(`Copied code **${couponData.value.couponCode}** to clipboard!`);
  } catch (err) {
    console.error("Failed to copy text: ", err);
    showError(
      "Failed to copy code. Your browser might not support automatic copying."
    );
  }
};

// --- STATE ---
const initialCouponState = {
  couponCode: "",
  // ... (rest of initialCouponState remains the same)
  discountPercent: null,
  discountAmount: null,
  expiryDate: "",
  minOrderValue: 0,
  maxUsage: 1,
};

// ... (rest of the script remains the same)

const coupons = ref([]);
const couponData = ref({ ...initialCouponState });

const loadingCoupons = ref(true);
const loading = ref(false);

const isEditing = ref(false);
const currentCouponId = ref(null);

// Date Picker Configuration
const datePickerConfig = {
  dateFormat: "Y-m-d",
  altFormat: "F j, Y",
  altInput: true,
  minDate: "today",
};

// Delete Confirmation State
const couponToDeleteId = ref(null);
const couponToDeleteCode = ref("");

// Form helpers
const discountType = ref("percent");

// ... (discountValue computed property remains the same)

const discountValue = computed({
  get: () =>
    discountType.value === "percent"
      ? couponData.value.discountPercent
      : couponData.value.discountAmount,
  set: (val) => {
    const numberVal = val === "" || val === null ? null : Number(val);

    if (discountType.value === "percent") {
      couponData.value.discountPercent = numberVal;
      couponData.value.discountAmount = null;
    } else {
      couponData.value.discountAmount = numberVal;
      couponData.value.discountPercent = null;
    }
  },
});

// --- UTILITY FUNCTIONS ---
const formatDate = (dateString) => {
  // Check for valid date string before formatting
  try {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const formatCurrencyValue = (value) => {
  return value ? value.toLocaleString() : "0";
};

const resetForm = () => {
  couponData.value = { ...initialCouponState };
  discountType.value = "percent";
  isEditing.value = false;
  currentCouponId.value = null;
};

// --- API FUNCTIONS ---

// 1. Fetch Coupons (Migrate error to toast)
const fetchCoupons = async () => {
  loadingCoupons.value = true;
  try {
    const response = await getAllCoupons();
    if (Array.isArray(response)) {
      coupons.value = response;
    } else {
      coupons.value = [];
    }
  } catch (err) {
    console.error("Failed to fetch coupons:", err);
    showError("Failed to load coupon data.");
  } finally {
    loadingCoupons.value = false;
  }
};

// 2. Handle Form Submission (Already migrated to toast)
const handleFormSubmit = async () => {
  loading.value = true;
  try {
    let response;
    const dataToSend = { ...couponData.value };

    if (isEditing.value) {
      // EDIT OPERATION
      if (!currentCouponId.value)
        throw new Error("Coupon ID is missing for update.");
      response = await updateCoupon(currentCouponId.value, dataToSend);
      const updatedCouponCode = response.coupon?.code || dataToSend.couponCode;
      showSuccess(`Coupon **${updatedCouponCode}** updated successfully!`);
    } else {
      // CREATE OPERATION
      response = await createCoupon(dataToSend);
      const createdCouponCode = response.coupon?.code || dataToSend.couponCode;
      showSuccess(`Coupon **${createdCouponCode}** created successfully!`);
    }

    await fetchCoupons();
    resetForm();
  } catch (err) {
    console.error("Coupon operation error:", err);
    let apiError =
      "An unknown server error occurred. Check browser console for details.";
    try {
      const parsed = JSON.parse(err.message);
      apiError = parsed.message || parsed.error || err.message;
    } catch (e) {
      apiError = err.message || apiError;
    }
    showError(`Update Failed: ${apiError}`);
  } finally {
    loading.value = false;
  }
};

// 3. Start Edit Mode (remains the same)
const startEdit = (coupon) => {
  resetForm();
  isEditing.value = true;
  currentCouponId.value = coupon._id;

  couponData.value.couponCode = coupon.code;
  couponData.value.expiryDate = coupon.expiresAt
    ? coupon.expiresAt.substring(0, 10)
    : "";
  couponData.value.minOrderValue = coupon.minOrderValue || 0;
  couponData.value.maxUsage = coupon.maxUses || 1;
  if (coupon.discountPercent !== null && coupon.discountPercent !== undefined) {
    discountType.value = "percent";
    couponData.value.discountPercent = coupon.discountPercent;
  } else if (
    coupon.discountAmount !== null &&
    coupon.discountAmount !== undefined
  ) {
    discountType.value = "amount";
    couponData.value.discountAmount = coupon.discountAmount;
  } else {
    discountType.value = "percent";
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 4. Toggle Status (Migrate to toast)
const toggleStatus = async (coupon) => {
  loading.value = true;
  const wasActive = coupon.isActive;

  try {
    const response = await toggleCoupon(coupon._id);
    const newStatus =
      response.coupon?.isActive !== undefined
        ? response.coupon.isActive
        : !wasActive;

    const index = coupons.value.findIndex((c) => c._id === coupon._id);
    if (index !== -1) {
      coupons.value[index].isActive = newStatus;
    }

    showSuccess(
      `Coupon ${coupon.code} status changed to ${
        newStatus ? "Active" : "Inactive"
      }.`
    );
  } catch (err) {
    console.error("Status toggle error:", err);
    let apiError = "An unknown server error occurred during toggle.";
    try {
      const parsed = JSON.parse(err.message);
      apiError = parsed.message || parsed.error || err.message;
    } catch (e) {
      apiError = err.message || apiError;
    }
    showError(`Failed to change status for ${coupon.code}: ${apiError}`);
  } finally {
    loading.value = false;
  }
};

// 5. Delete Coupon - Prepare for UI Confirmation (remains the same)
const prepareDelete = (id, code) => {
  couponToDeleteId.value = id;
  couponToDeleteCode.value = code;
};

// 6. Delete Coupon - Execute on Confirmation (Migrate to toast)
const handleDeleteConfirm = async () => {
  const idToDelete = couponToDeleteId.value;
  loading.value = true;
  couponToDeleteId.value = null;

  try {
    await deleteCoupon(idToDelete);
    coupons.value = coupons.value.filter((c) => c._id !== idToDelete);
    showSuccess("Coupon deleted successfully.");
  } catch (err) {
    console.error("Coupon deletion error:", err);
    showError("Failed to delete coupon.");
  } finally {
    loading.value = false;
  }
};

// --- LIFECYCLE HOOK ---
onMounted(fetchCoupons);
</script>
