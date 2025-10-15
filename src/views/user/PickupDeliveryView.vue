<template>
  <div class="p-4 sm:p-6 lg:p-10 min-h-screen">
    <h1 class="text-2xl sm:text-3xl font-font-display font-bold mb-6 text-navy-blue">
      Schedule Pickup & Delivery
    </h1>

    <!-- User Info Section -->
    <div v-if="userLoaded" class="mb-6 p-4 rounded-lg border border-golden-brown/30 space-y-4">
      <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        <div class="flex-1">
          <label class="block text-sm font-medium text-charcoal mb-1">Full Name</label>
          <input
            type="text"
            v-model="user.fullName"
            readonly
            class="w-full p-3 border border-golden-brown/30 rounded-md bg-bone-white text-navy-blue cursor-not-allowed"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-charcoal mb-1">Phone Number</label>
          <input
            type="text"
            v-model="user.phone"
            readonly
            class="w-full p-3 border border-golden-brown/30 rounded-md bg-bone-white text-navy-blue cursor-not-allowed"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Pickup & Delivery Form -->
      <div class="flex-1 space-y-8 p-6 bg-bone-white rounded-lg border border-golden-brown/30">
        <!-- Pickup Section -->
        <section class="space-y-4">
          <h2 class="text-xl font-semibold text-charcoal border-b-2 border-golden-brown pb-2">
            1. Pickup Details
          </h2>

          <label
            v-if="user.addresses && user.addresses.length > 0"
            class="flex items-center cursor-pointer select-none space-x-2 mb-4"
          >
            <input
              type="checkbox"
              v-model="useCurrentAddress"
              @change="prefillCurrentAddress"
              class="form-checkbox h-4 w-4 text-golden-brown border-2 border-charcoal rounded transition-colors accent-golden-brown cursor-pointer"
            />
            <span class="text-sm font-medium text-charcoal">
              Use Current Address (
              {{
                user.addresses && user.addresses.length > 0
                  ? user.addresses[0].label || 'First Saved Address'
                  : 'No Saved Address'
              }}
              )
            </span>
          </label>

          <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div class="flex-1">
              <label class="block text-sm font-medium text-charcoal"
                >Pickup Date <span class="text-red-600">*</span></label
              >
              <FlatPickr
                v-model="pickupDate"
                :config="flatpickrOptions"
                class="mt-1 block w-full p-3 border-2 border-charcoal rounded-md text-navy-blue"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-charcoal">Time Window</label>
              <input
                type="text"
                v-model="pickupWindow"
                placeholder="e.g. 9am - 12pm"
                class="mt-1 block w-full p-3 border-2 border-charcoal rounded-md text-navy-blue"
              />
            </div>
          </div>

          <!-- Pickup Address -->
          <div class="space-y-3">
            <label class="block text-sm font-medium text-charcoal"
              >Pickup Address Details <span class="text-red-600">*</span></label
            >
            <textarea
              v-model="pickupLine1"
              rows="2"
              placeholder="Street Address"
              class="w-full p-3 border-2 border-charcoal rounded-md text-navy-blue"
            ></textarea>
            <textarea
              v-model="pickupLine2"
              rows="1"
              placeholder="Additional Info (optional)"
              class="w-full p-3 border-2 border-charcoal rounded-md text-navy-blue"
            ></textarea>

            <div class="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <input
                v-model="pickupCity"
                placeholder="City *"
                class="flex-1 p-3 border-2 border-charcoal rounded-md text-navy-blue"
              />
              <select
                v-model="pickupLga"
                class="flex-1 p-3 border-2 border-charcoal rounded-md text-navy-blue bg-white"
              >
                <option value="" disabled>LGA *</option>
                <option v-for="lga in anambraLgas" :key="lga" :value="lga">{{ lga }}</option>
              </select>
            </div>

            <div class="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <input
                v-model="pickupState"
                readonly
                class="flex-1 p-3 border-2 border-charcoal rounded-md text-navy-blue cursor-not-allowed"
              />
              <input
                v-model="pickupLandmark"
                placeholder="Landmark (optional)"
                class="flex-1 p-3 border-2 border-charcoal rounded-md text-navy-blue"
              />
            </div>

            <input
              v-model="pickupZone"
              placeholder="Zone (optional)"
              class="w-full p-3 border-2 border-charcoal rounded-md text-navy-blue"
            />
          </div>
        </section>

        <!-- Delivery Section -->
        <section class="space-y-4">
          <h2 class="text-xl font-semibold text-charcoal border-b-2 border-golden-brown pb-2">
            2. Delivery Details
          </h2>

          <label class="flex items-center cursor-pointer select-none space-x-2 mb-3">
            <input
              type="checkbox"
              v-model="sameAsPickup"
              @change="syncDeliveryAddress"
              class="form-checkbox h-4 w-4 text-golden-brown border-2 border-charcoal rounded transition-colors accent-golden-brown cursor-pointer"
            />
            <span class="text-sm text-charcoal"
              >Delivery address is the same as Pickup address</span
            >
          </label>

          <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div class="flex-1">
              <label class="block text-sm font-medium text-charcoal"
                >Delivery Date <span class="text-red-600">*</span></label
              >
              <FlatPickr
                v-model="deliveryDate"
                :config="flatpickrOptions"
                class="mt-1 block w-full p-3 border-2 border-charcoal rounded-md text-navy-blue"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-charcoal">Time Window</label>
              <input
                type="text"
                v-model="deliveryWindow"
                placeholder="e.g. 3pm - 6pm"
                class="mt-1 block w-full p-3 border-2 border-charcoal rounded-md text-navy-blue"
              />
            </div>
          </div>

          <div v-if="!sameAsPickup" class="space-y-3">
            <textarea
              v-model="deliveryLine1"
              rows="2"
              placeholder="Street Address / Landmark"
              class="w-full p-3 border-2 border-charcoal rounded-md text-navy-blue"
            ></textarea>
            <textarea
              v-model="deliveryLine2"
              rows="1"
              placeholder="Additional Info (optional)"
              class="w-full p-3 border-2 border-charcoal rounded-md text-navy-blue"
            ></textarea>

            <div class="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <input
                v-model="deliveryCity"
                placeholder="City *"
                class="flex-1 p-3 border-2 border-charcoal rounded-md text-navy-blue"
              />
              <select
                v-model="deliveryLga"
                class="flex-1 p-3 border-2 border-charcoal rounded-md text-navy-blue bg-white"
              >
                <option value="" disabled>LGA *</option>
                <option v-for="lga in anambraLgas" :key="lga" :value="lga">{{ lga }}</option>
              </select>
            </div>

            <div class="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <input
                v-model="deliveryState"
                readonly
                class="flex-1 p-3 border-2 border-charcoal rounded-md text-navy-blue cursor-not-allowed"
              />
              <input
                v-model="deliveryLandmark"
                placeholder="Landmark (optional)"
                class="flex-1 p-3 border-2 border-charcoal rounded-md text-navy-blue"
              />
            </div>

            <input
              v-model="deliveryZone"
              placeholder="Zone (optional)"
              class="w-full p-3 border-2 border-charcoal rounded-md text-navy-blue"
            />
          </div>
        </section>

        <!-- Extras -->
        <section class="space-y-4 pt-4 border-t border-golden-brown/40">
          <h2 class="text-xl font-semibold text-charcoal border-b-2 border-golden-brown pb-2">
            3. Extras
          </h2>

          <div>
            <label class="block text-sm font-medium text-charcoal mb-1">Coupon Code (optional)</label>
            <input
              type="text"
              v-model="couponCode"
              placeholder="Enter coupon code"
              class="w-full p-3 border-2 border-charcoal rounded-md text-navy-blue focus:ring-1 focus:ring-golden-brown"
            />
          </div>

          <!-- Photo Upload -->
          <div>
            <label class="block text-sm font-medium text-charcoal mb-2">
              Upload Photos (optional)
              <span class="text-xs text-charcoal/70">(Max 5 photos)</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleFileUpload"
              :disabled="photoFiles.length >= MAX_PHOTOS"
              class="block w-full text-sm text-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-900/10 file:text-navy-blue hover:file:bg-charcoal hover:file:text-bone-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p v-if="photoFiles.length >= MAX_PHOTOS" class="mt-1 text-sm text-red-600">
              Maximum of 5 photos reached.
            </p>

            <div v-if="photoPreviews.length" class="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
              <div v-for="(src, i) in photoPreviews" :key="i" class="relative group">
                <img :src="src" class="h-24 w-full object-cover rounded-lg border border-golden-brown" />
                <button
                  type="button"
                  @click="removePhoto(i)"
                  class="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  title="Remove photo"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </section>

        <button
          @click="proceedToSummary"
          :disabled="!isFormValid"
          class="py-3 px-4 w-full rounded-lg font-bold transition-colors disabled:opacity-50 cursor-pointer"
          :class="[
            isFormValid
              ? 'bg-golden-brown text-bone-white hover:bg-golden-brown/90'
              : 'bg-charcoal text-cream/70',
          ]"
        >
          Review & Checkout
        </button>
      </div>

      <!-- Order Summary -->
      <aside class="lg:w-80 flex-shrink-0 lg:sticky lg:top-4 mt-6 lg:mt-0">
        <div class="p-6 bg-charcoal border border-golden-brown/30 text-bone-white rounded-xl">
          <h2 class="text-2xl font-bold border-b border-cream/50 pb-4 mb-4 flex items-center">
            <i class="fas fa-shopping-basket mr-3 text-golden-brown"></i> Order Summary
          </h2>
          <div
            v-for="item in orderPayload.items"
            :key="item.serviceCode"
            class="flex justify-between text-sm mb-1"
          >
            <span class="text-cream/80">{{ item.serviceName }}</span>
            <span class="font-medium text-bone-white">
              {{ item.quantity }} × ₦{{ (item.price + item.addOns.reduce((s, a) => s + a.price, 0)).toFixed(2) }}
            </span>
          </div>
          <div class="pt-4 border-t border-cream/50 space-y-2">
            <p class="flex justify-between font-semibold text-md text-cream">
              <span>Total Items:</span>
              <span>{{ totalItemCount }}</span>
            </p>
            <p class="flex justify-between font-extrabold text-lg text-pure-gold">
              <span>Subtotal:</span>
              <span>₦{{ estimatedSubtotal ? estimatedSubtotal.toLocaleString() : "0" }}</span>
            </p>
          </div>
          <button
            @click="router.push({ name: 'BookPickup' })"
            class="mt-4 py-2 w-full text-sm rounded-lg border-2 border-pure-gold text-pure-gold hover:bg-pure-gold/10 cursor-pointer"
          >
            ← Change Items
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import FlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { useOrderItems } from "@/composables/useOrderItems";
import { fetchUserProfile } from "@/services/api";

const router = useRouter();
const { orderPayload, totalItemCount, estimatedSubtotal } = useOrderItems();

// Constants
const MAX_PHOTOS = 5;
const anambraLgas = [
  "Aguata","Anambra East","Anambra West","Anaocha","Awka North","Awka South",
  "Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South","Ihiala",
  "Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South",
  "Orumba North","Orumba South","Oyi"
];

// User
const user = ref({ fullName: "", phone: "", addresses: [] });
const userLoaded = ref(false);
const useCurrentAddress = ref(false);

onMounted(async () => {
  try {
    const res = await fetchUserProfile();
    user.value = res?.data || res;
  } catch (err) {
    console.error("Failed to fetch user:", err);
  } finally {
    userLoaded.value = true;
  }
});

// Flatpickr
const flatpickrOptions = {
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
  minDate: "today",
};

// Pickup and delivery refs
const pickupDate = ref("");
const pickupWindow = ref("9:00 AM - 12:00 PM");
const pickupLine1 = ref("");
const pickupLine2 = ref("");
const pickupCity = ref("");
const pickupLga = ref("");
const pickupState = ref("Anambra");
const pickupLandmark = ref("");
const pickupZone = ref("");

const sameAsPickup = ref(true);
const deliveryDate = ref("");
const deliveryWindow = ref("3:00 PM - 6:00 PM");
const deliveryLine1 = ref("");
const deliveryLine2 = ref("");
const deliveryCity = ref("");
const deliveryLga = ref("");
const deliveryState = ref("Anambra");
const deliveryLandmark = ref("");
const deliveryZone = ref("");

// Coupon and photos
const couponCode = ref("");
const photoFiles = ref([]);
const photoPreviews = ref([]);

// Photo logic
const handleFileUpload = (e) => {
  const newFiles = Array.from(e.target.files);
  const total = photoFiles.value.length + newFiles.length;
  if (total > MAX_PHOTOS) newFiles.splice(MAX_PHOTOS - photoFiles.value.length);
  photoFiles.value.push(...newFiles);
  photoPreviews.value = photoFiles.value.map((f) =>
    typeof f === "string" ? f : URL.createObjectURL(f)
  );
  e.target.value = null;
};

const removePhoto = (i) => {
  URL.revokeObjectURL(photoPreviews.value[i]);
  photoFiles.value.splice(i, 1);
  photoPreviews.value.splice(i, 1);
};

// Prefill current address
const prefillCurrentAddress = () => {
  if (useCurrentAddress.value && user.value.addresses?.length > 0) {
    const addr = user.value.addresses[0];
    pickupLine1.value = addr.line1 || "";
    pickupLine2.value = addr.line2 || "";
    pickupCity.value = addr.city || "";
    pickupLga.value = anambraLgas.includes(addr.lga) ? addr.lga : "";
    pickupLandmark.value = addr.landmark || "";
    pickupZone.value = addr.zone || "";
    if (sameAsPickup.value) syncDeliveryAddress();
  } else {
    pickupLine1.value = pickupLine2.value = pickupCity.value = pickupLga.value = pickupLandmark.value = pickupZone.value = "";
  }
};

// Sync delivery with pickup
const syncDeliveryAddress = () => {
  if (sameAsPickup.value) {
    deliveryLine1.value = pickupLine1.value;
    deliveryLine2.value = pickupLine2.value;
    deliveryCity.value = pickupCity.value;
    deliveryLga.value = pickupLga.value;
    deliveryState.value = pickupState.value;
    deliveryLandmark.value = pickupLandmark.value;
    deliveryZone.value = pickupZone.value;
  }
};

// Validate form
const isFormValid = computed(() =>
  pickupDate.value &&
  pickupCity.value &&
  pickupLga.value &&
  deliveryDate.value &&
  (sameAsPickup.value ||
    (deliveryCity.value && deliveryLga.value && deliveryLine1.value))
);

// Proceed to summary
const proceedToSummary = async () => {
  if (!isFormValid.value) {
    alert("Please complete all required fields");
    return;
  }

  orderPayload.value.pickup = {
    date: pickupDate.value,
    window: pickupWindow.value,
    address: {
      line1: pickupLine1.value,
      line2: pickupLine2.value,
      city: pickupCity.value,
      lga: pickupLga.value,
      state: pickupState.value,
      landmark: pickupLandmark.value,
      zone: pickupZone.value,
    },
  };

  orderPayload.value.delivery = {
    date: deliveryDate.value,
    window: deliveryWindow.value,
    address: {
      line1: deliveryLine1.value,
      line2: deliveryLine2.value,
      city: deliveryCity.value,
      lga: deliveryLga.value,
      state: deliveryState.value,
      landmark: deliveryLandmark.value,
      zone: deliveryZone.value,
    },
  };

  orderPayload.value.couponCode = couponCode.value || null;
  orderPayload.value.photos = photoFiles.value;

  // ✅ Ensure reactivity is fully applied before routing
  await nextTick();
  router.push({ name: "OrderSummary" });
};
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
