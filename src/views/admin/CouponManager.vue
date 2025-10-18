<template>
  <div class="min-h-screen p-4 md:p-8" style="background-color: #F5F1ED;">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-3xl md:text-4xl font-bold mb-2" style="color: #1A3A52;">
          Coupon Manager
        </h2>
        <!-- <div class="h-1 w-16" style="background-color: #1A3A52;"></div> -->
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin text-5xl mb-4" style="color: #8B7355;" />
        <p class="text-lg" style="color: #8B7355;">Loading coupons...</p>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="couponToDeleteId"
        class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      >
        <div class="rounded-lg max-w-sm w-full p-6" style="background-color: #FFFBF7;">
          <h3 class="text-xl font-bold mb-3" style="color: #DC2626;">
            Confirm Deletion
          </h3>
          <p style="color: #374151;" class="mb-4">
            Are you sure you want to delete coupon
            <span class="font-bold" style="color: #D4A574;">{{
              couponToDeleteCode
            }}</span
            >? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="couponToDeleteId = null"
              class="px-4 py-2 rounded-md hover:opacity-80 transition-opacity cursor-pointer"
              style="background-color: #E5E7EB; color: #374151;"
            >
              Cancel
            </button>
            <button
              @click="handleDeleteConfirm"
              :disabled="loading"
              class="px-4 py-2 rounded-md text-bone-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              style="background-color: #DC2626;"
            >
              {{ loading ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="mb-10 rounded-xl  p-6 md:p-8" style="background-color: #FFFBF7;">
        <h3 class="text-2xl font-bold mb-6" style="color: #1A3A52;">
          {{ isEditing ? "Edit Coupon" : "Create New Coupon" }}
        </h3>
        <form
          @submit.prevent="handleFormSubmit"
          class="space-y-6"
        >
          <!-- Coupon Code Section -->
          <div :class="{ 'opacity-50 pointer-events-none': isEditing }">
            <label class="text-sm font-medium block mb-2" style="color: #374151;">
              Coupon Code (Required)
            </label>
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                v-model="couponData.couponCode"
                placeholder="e.g., FALL20 or click 'Generate'"
                :disabled="isEditing"
                required
                class="flex-1 p-3 border rounded-md transition duration-150 text-sm"
                style="border-color: #E5DDD5; color: #374151; background-color: #FFFBF7;"
              />

              <button
                type="button"
                @click="handleGenerateCode"
                :disabled="isEditing || loading"
                class="px-4 py-3 font-semibold text-sm rounded-md text-bone-white hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer whitespace-nowrap"
                style="background-color: #8B7355;"
              >
                Generate
              </button>

              <button
                type="button"
                @click="handleCopyCode"
                :disabled="!couponData.couponCode || isEditing || loading"
                class="px-4 py-3 font-semibold text-sm rounded-md text-bone-white hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer whitespace-nowrap"
                style="background-color: #4CAF50;"
              >
                <font-awesome-icon icon="fa-solid fa-copy" class="mr-1" /> Copy
              </button>
            </div>
          </div>

          <!-- Two Column Layout -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Discount Type -->
            <div>
              <label class="text-sm font-medium block mb-2" style="color: #374151;">
                Discount Type
              </label>
              <div class="flex gap-2 p-1 rounded-lg border" style="border-color: #E5DDD5; background-color: #F9F7F4;">
                <button
                  type="button"
                  @click="discountType = 'percent'"
                  :class="[
                    'flex-1 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer',
                    discountType === 'percent'
                      ? 'text-bone-white'
                      : 'hover:opacity-70',
                  ]"
                  :style="discountType === 'percent' ? { backgroundColor: '#1A3A52' } : { color: '#374151' }"
                >
                  Percentage (%)
                </button>

                <button
                  type="button"
                  @click="discountType = 'amount'"
                  :class="[
                    'flex-1 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer',
                    discountType === 'amount'
                      ? 'text-bone-white'
                      : 'hover:opacity-70',
                  ]"
                  :style="discountType === 'amount' ? { backgroundColor: '#1A3A52' } : { color: '#374151' }"
                >
                  Fixed Amount (₦)
                </button>
              </div>
            </div>

            <!-- Discount Value -->
            <div>
              <label class="text-sm font-medium block mb-2" style="color: #374151;">
                {{
                  discountType === 'percent'
                    ? 'Discount Percentage (%)'
                    : 'Discount Amount (₦)'
                }}
              </label>
              <input
                type="number"
                v-model.number="discountValue"
                placeholder="e.g., 15 or 500"
                required
                min="0"
                :max="discountType === 'percent' ? 100 : undefined"
                class="w-full p-3 border rounded-md transition duration-150 text-sm"
                style="border-color: #E5DDD5; color: #374151; background-color: #FFFBF7;"
              />
            </div>

            <!-- Expiry Date -->
            <div>
              <label class="text-sm font-medium block mb-2" style="color: #374151;">
                Expiry Date
              </label>
              <flat-pickr
                v-model="couponData.expiryDate"
                :config="datePickerConfig"
                placeholder="YYYY-MM-DD"
                required
                class="w-full p-3 border rounded-md transition duration-150 text-sm"
                style="border-color: #E5DDD5; color: #374151; background-color: #FFFBF7;"
              />
            </div>

            <!-- Min Order Value -->
            <div>
              <label class="text-sm font-medium block mb-2" style="color: #374151;">
                Min Order Value (₦)
              </label>
              <input
                type="number"
                v-model.number="couponData.minOrderValue"
                placeholder="e.g., 5000"
                min="0"
                class="w-full p-3 border rounded-md transition duration-150 text-sm"
                style="border-color: #E5DDD5; color: #374151; background-color: #FFFBF7;"
              />
            </div>

            <!-- Max Total Uses -->
            <div>
              <label class="text-sm font-medium block mb-2" style="color: #374151;">
                Max Total Uses
              </label>
              <input
                type="number"
                v-model.number="couponData.maxUsage"
                placeholder="e.g., 100"
                min="1"
                class="w-full p-3 border rounded-md transition duration-150 text-sm"
                style="border-color: #E5DDD5; color: #374151; background-color: #FFFBF7;"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 py-3 rounded-md font-semibold text-lg text-bone-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style="background-color: #1A3A52;"
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
              class="px-6 py-3 rounded-md font-semibold text-lg hover:opacity-90 transition-opacity cursor-pointer"
              style="background-color: #E5E7EB; color: #374151;"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Coupons List Section -->
      <div class="mb-10">
        <h3 class="text-2xl font-bold mb-4" style="color: #1A3A52;">
          All Coupons ({{ coupons.length }})
        </h3>

        <p v-if="loadingCoupons" style="color: #6B7280;" class="mb-4">Loading coupons...</p>
        <p
          v-else-if="!coupons.length"
          class="p-4 rounded-md text-center"
          style="background-color: #FFFBF7; color: #6B7280;"
        >
          No coupons found.
        </p>

        <div v-else class="space-y-4">
          <div
            v-for="coupon in coupons"
            :key="coupon._id"
            class="rounded-lg  p-4 md:p-6 border "
            style="background-color: #FFFBF7; border-color: #E5DDD5;"
          >
            <!-- Top Row: Code & Status -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div class="flex-1">
                <h4 class="text-lg font-bold" style="color: #1A3A52;">
                  {{ coupon.code }}
                </h4>
                <code
                  class="text-xs mt-1 block p-2 rounded"
                  style="background-color: #F9F7F4; color: #D4A574; font-family: monospace;"
                >
                  {{ coupon._id }}
                </code>
              </div>
              <button
                @click="toggleStatus(coupon)"
                :disabled="loading"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-semibold transition-opacity disabled:opacity-50 cursor-pointer whitespace-nowrap',
                  coupon.isActive
                    ? 'text-bone-white hover:opacity-90'
                    : 'text-bone-white hover:opacity-90',
                ]"
                :style="coupon.isActive ? { backgroundColor: '#4CAF50' } : { backgroundColor: '#374151' }"
              >
                {{ coupon.isActive ? "Active" : "Inactive" }}
              </button>
            </div>

            <!-- Middle Row: Details Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b" style="border-color: #E5DDD5;">
              <div>
                <p class="text-xs" style="color: #6B7280;">Discount</p>
                <p class="text-sm font-semibold mt-1" style="color: #374151;">
                  {{
                    coupon.discountPercent
                      ? coupon.discountPercent + "%"
                      : "₦" + formatCurrencyValue(coupon.discountAmount)
                  }}
                </p>
              </div>
              <div>
                <p class="text-xs" style="color: #6B7280;">Expiry Date</p>
                <p class="text-sm font-semibold mt-1" style="color: #374151;">
                  {{ formatDate(coupon.expiresAt) }}
                </p>
              </div>
              <div>
                <p class="text-xs" style="color: #6B7280;">Max Uses</p>
                <p class="text-sm font-semibold mt-1" style="color: #374151;">
                  {{ coupon.maxUses }}
                </p>
              </div>
              <div>
                <p class="text-xs" style="color: #6B7280;">Min Order Value</p>
                <p class="text-sm font-semibold mt-1" style="color: #374151;">
                  ₦{{ formatCurrencyValue(coupon.minOrderValue) }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3">
              <button
                @click="startEdit(coupon)"
                :disabled="loading"
                class="px-4 py-2 rounded-md transition-opacity disabled:opacity-50 cursor-pointer text-sm font-medium text-bone-white hover:opacity-90"
                style="background-color: #D4A574;"
              >
                <font-awesome-icon icon="fa-solid fa-pen-to-square" class="mr-2" />
                Edit
              </button>
              <button
                @click="prepareDelete(coupon._id, coupon.code)"
                :disabled="loading"
                class="px-4 py-2 rounded-md transition-opacity disabled:opacity-50 cursor-pointer text-sm font-medium text-bone-white hover:opacity-90"
                style="background-color: #DC2626;"
              >
                <font-awesome-icon icon="fa-solid fa-trash" class="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted, computed } from "vue";
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const { showSuccess, showError } = useToast();

// 🔹 Generate random coupon code
const generateRandomCode = (length = 8) => { // Changed default length to 8 for typical use
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Removed hyphen for cleaner codes
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.toUpperCase();
};

const handleGenerateCode = () => {
  if (isEditing.value) return;
  const newCode = generateRandomCode(10); // Generate a 10-character code
  couponData.value.couponCode = newCode;
  showSuccess(`Generated code: ${newCode}`);
};

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
    showError("Failed to copy code. Your browser might not support automatic copying.");
  }
};

// 🔹 State Initialization
const initialCouponState = {
  couponCode: "",
  discountPercent: null,
  discountAmount: null,
  expiryDate: "",
  minOrderValue: 0,
  maxUsage: 1,
};

const coupons = ref([]);
const couponData = ref({ ...initialCouponState });

const loadingCoupons = ref(true);
const loading = ref(false);

const isEditing = ref(false);
const currentCouponId = ref(null);

const datePickerConfig = {
  dateFormat: "Y-m-d",
  altFormat: "F j, Y",
  altInput: true,
  minDate: "today",
};

const couponToDeleteId = ref(null);
const couponToDeleteCode = ref("");

const discountType = ref("percent");

// 🔹 Computed: Handle dynamic discount type (percent or amount)
const discountValue = computed({
  get: () =>
    discountType.value === "percent"
      ? couponData.value.discountPercent
      : couponData.value.discountAmount,
  set: (val) => {
    // Only allow null or positive numbers
    const numberVal = val === "" || val === null || val < 0 ? null : Number(val); 
    if (discountType.value === "percent") {
      couponData.value.discountPercent = numberVal;
      couponData.value.discountAmount = null;
    } else {
      couponData.value.discountAmount = numberVal;
      couponData.value.discountPercent = null;
    }
  },
});

// 🔹 Utility Functions
const formatDate = (dateString) => {
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

// 🔹 Fetch All Coupons
const fetchCoupons = async () => {
  loadingCoupons.value = true;
  try {
    const response = await getAllCoupons();
    // Use Array.isArray check for safety, though backend returns an array
    coupons.value = Array.isArray(response) ? response : []; 
  } catch (err) {
    console.error("Failed to fetch coupons:", err);
    showError("Failed to load coupon data.");
  } finally {
    loadingCoupons.value = false;
  }
}

// 🎯 FIXED FUNCTION: handleFormSubmit
const handleFormSubmit = async () => {
  loading.value = true;
  try {
    // 1. Initial validation for the required code
    const codeValue = couponData.value.couponCode?.trim().toUpperCase();
    if (!codeValue) {
      showError("Coupon code is required");
      loading.value = false;
      return;
    }

    // 2. Build payload
    const dataToSend = {
      code: codeValue, // REQUIRED FIELD
      discountPercent:
        discountType.value === "percent" && couponData.value.discountPercent !== null
          ? Number(couponData.value.discountPercent)
          : null,
      discountAmount:
        discountType.value === "amount" && couponData.value.discountAmount !== null
          ? Number(couponData.value.discountAmount)
          : null,
      expiresAt: couponData.value.expiryDate
        ? new Date(couponData.value.expiryDate).toISOString()
        : null,
      minOrderValue: Number(couponData.value.minOrderValue || 0),
      maxUses: Number(couponData.value.maxUsage || 1),
      isActive: true,
    };

    // 3. Filtering loop (Safely remove ONLY optional, empty fields)
    Object.keys(dataToSend).forEach((key) => {
      // 🛑 FIX: Skip the 'code' key from being potentially deleted
      if (key !== 'code' && 
        (dataToSend[key] === null ||
         dataToSend[key] === undefined ||
         dataToSend[key] === "")
      ) {
        delete dataToSend[key];
      }
    });

    let response;
    if (isEditing.value) {
      response = await updateCoupon(currentCouponId.value, dataToSend);
      showSuccess(
        `Coupon ${response.coupon?.code || dataToSend.code} updated successfully!`
      );
    } else {
      response = await createCoupon(dataToSend);
      showSuccess(
        `Coupon ${response.coupon?.code || dataToSend.code} created successfully!`
      );
    }

    await fetchCoupons();
    resetForm();
  } catch (err) {
    console.error("Coupon operation error:", err);
    // Improved error parsing
    const apiError =
      err.response?.data?.message || err.message || "Unknown error";
    showError(apiError);
  } finally {
    loading.value = false;
  }
};


// 🔹 Start Editing a Coupon
const startEdit = (coupon) => {
  resetForm();
  isEditing.value = true;
  currentCouponId.value = coupon._id;

  couponData.value.couponCode = coupon.code;
  // Use substring(0, 10) to get YYYY-MM-DD format for flatpickr
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
    // Default to percent if neither is set (shouldn't happen with backend validation)
    discountType.value = "percent";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 🔹 Toggle Coupon Active/Inactive
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
    // Improved error message fallback
    const apiError = err.response?.data?.message || "An unknown error occurred during toggle.";
    showError(`Failed to change status for ${coupon.code}: ${apiError}`);
  } finally {
    loading.value = false;
  }
};

// 🔹 Delete Confirmation Handling
const prepareDelete = (id, code) => {
  couponToDeleteId.value = id;
  couponToDeleteCode.value = code;
};

const handleDeleteConfirm = async () => {
  const idToDelete = couponToDeleteId.value;
  loading.value = true;
  couponToDeleteId.value = null; // Close modal immediately
  try {
    await deleteCoupon(idToDelete);
    coupons.value = coupons.value.filter((c) => c._id !== idToDelete);
    showSuccess("Coupon deleted successfully.");
    
    // Reset form if the deleted coupon was being edited
    if (idToDelete === currentCouponId.value) {
        resetForm();
    }
  } catch (err) {
    console.error("Coupon deletion error:", err);
    showError("Failed to delete coupon.");
  } finally {
    loading.value = false;
  }
};

// 🔹 Fetch on Mount
onMounted(fetchCoupons);
</script>