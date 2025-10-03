<template>
  <div class="bg-bone-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto my-12">
    <FormStepIndicator :current-step="currentStep" />

    <div v-if="currentStep === 1" class="mt-8">
      <h2 class="text-3xl font-bold text-charcoal mb-6">Service and Details</h2>

      <FormField
        label="Service Type"
        type="radio"
        name="service-type"
        :options="['Wash & Fold', 'Dry Cleaning', 'Hang Dry']"
        v-model="formData.serviceType"
      />

      <FormField
        label="Estimated Number of Items"
        type="number"
        name="estimated-items"
        v-model="formData.estimatedItems"
      />

      <FormField
        label="Add-ons"
        type="checkbox"
        name="add-ons"
        :options="['Starch', 'Fabric Softener', 'Hypoallergenic Detergent']"
        v-model="formData.addons"
      />

      <FormField
        label="Special Care Notes"
        type="textarea"
        name="special-notes"
        v-model="formData.specialNotes"
      />

      <FormField
        label="Add Photo (Optional)"
        type="file"
        name="photo"
        @update:modelValue="handleFileUpload"
      />

      <FormField
        label="Coupon Code"
        type="text"
        name="coupon"
        v-model="formData.couponCode"
      />

      <div class="text-right text-lg font-semibold text-charcoal mt-4">
        Estimated Total: ₦{{ pricing.total.toFixed(2) }}
      </div>

      <div class="mt-8 flex justify-end">
        <button
          @click="nextStep"
          class="bg-golden-brown text-bone-white py-3 px-6 rounded-md font-semibold hover:bg-pure-gold transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>

    <div v-else-if="currentStep === 2" class="mt-8">
      <h2 class="text-3xl font-bold text-charcoal mb-6">Time and Address</h2>

      <FormField
        label="Full Name"
        type="text"
        name="full-name"
        v-model="formData.fullName"
      />

      <FormField
        label="Phone Number"
        type="tel"
        name="phone-number"
        v-model="formData.phoneNumber"
      />

      <FormField
        label="Address"
        type="text"
        name="address"
        v-model="formData.address"
      />

      <FormField
        label="Nearest Landmark"
        type="text"
        name="landmark"
        v-model="formData.landmark"
      />

      <FormField
        label="Pickup Time Window"
        type="select"
        name="pickup-time"
        :options="['8am - 10am', '10am - 12pm', '12pm - 2pm']"
        v-model="formData.pickupTime"
      />

      <FormField
        label="Delivery Time Window"
        type="select"
        name="delivery-time"
        :options="['2pm - 4pm', '4pm - 6pm', '6pm - 8pm']"
        v-model="formData.deliveryTime"
      />

      <div class="text-right text-lg font-semibold text-charcoal mt-4">
        Delivery Fee: ₦{{ pricing.deliveryFee.toFixed(2) }}
      </div>

      <div class="mt-8 flex justify-between">
        <button
          @click="currentStep--"
          class="bg-gray-300 text-charcoal py-3 px-6 rounded-md font-semibold hover:bg-gray-400 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          @click="nextStep"
          class="bg-golden-brown text-bone-white py-3 px-6 rounded-md font-semibold hover:bg-pure-gold transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>

    <div v-else-if="currentStep === 3" class="mt-8">
      <h2 class="text-3xl font-bold text-charcoal mb-6">
        Confirm your Details
      </h2>

      <div class="space-y-4 text-gray-700">
        <p>
          <strong>Service:</strong>
          {{ formData.serviceType || "Not specified" }}
        </p>
        <p>
          <strong>Estimated Items:</strong>
          {{ formData.estimatedItems || "Not specified" }}
        </p>
        <p>
          <strong>Add-ons:</strong> {{ formData.addons.join(", ") || "None" }}
        </p>
        <p>
          <strong>Full Name:</strong> {{ formData.fullName || "Not specified" }}
        </p>
        <p>
          <strong>Phone:</strong> {{ formData.phoneNumber || "Not specified" }}
        </p>
        <p>
          <strong>Address:</strong> {{ formData.address || "Not specified" }},
          {{ formData.landmark || "Not specified" }}
        </p>
        <p>
          <strong>Pickup:</strong> {{ formData.pickupTime || "Not specified" }}
        </p>
        <p>
          <strong>Delivery:</strong>
          {{ formData.deliveryTime || "Not specified" }}
        </p>
        <p>
          <strong>Special Notes:</strong> {{ formData.specialNotes || "None" }}
        </p>
      </div>

      <div class="mt-8">
        <div
          class="flex justify-between items-center text-lg font-bold text-charcoal"
        >
          <span>Final Total:</span>
          <span>₦{{ pricing.finalTotal.toFixed(2) }}</span>
        </div>
      </div>

      <div class="mt-8 flex justify-between items-center">
        <label class="flex items-center space-x-2">
          <input
            type="checkbox"
            v-model="saveDetails"
            class="form-checkbox text-golden-brown rounded"
          />
          <span class="text-gray-600">Save details for future use</span>
        </label>
      </div>

      <div class="mt-8 flex justify-between">
        <button
          @click="currentStep--"
          class="bg-gray-300 text-charcoal py-3 px-6 rounded-md font-semibold hover:bg-gray-400 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          @click="submitForm"
          class="bg-golden-brown text-bone-white py-3 px-6 rounded-md font-semibold hover:bg-brand-blue transition-colors cursor-pointer"
        >
          Book Pickup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
import FormStepIndicator from "@/components/atoms/FormStepIndicator.vue";
import FormField from "@/components/atoms/FormField.vue";
import { useOrderStore } from "@/stores/useOrderStore";

const router = useRouter();
const orderStore = useOrderStore();
const currentStep = ref(1);
const saveDetails = ref(false);

const formData = ref({
  serviceType: "",
  estimatedItems: 0,
  addons: [],
  specialNotes: "",
  photo: null,
  couponCode: "",
  fullName: "",
  phoneNumber: "",
  address: "",
  landmark: "",
  pickupTime: "",
  deliveryTime: "",
});

// Reactive object for pricing
const pricing = reactive({
  baseTotal: 0,
  deliveryFee: 9.95, //
  discount: 0,
  get total() {
    return this.baseTotal - this.discount;
  },
  get finalTotal() {
    return this.baseTotal + this.deliveryFee - this.discount;
  },
});

// A computed property to estimate the base cost
const estimatedBaseCost = computed(() => {
  // This is a simplified calculation, a real app would use a more complex pricing table.
  let cost = formData.value.estimatedItems * 5; // Example base cost
  if (formData.value.addons.length > 0) {
    cost += 2.5 * formData.value.addons.length; // Example addon cost
  }
  return cost;
});

// Watch for changes in form data to update the estimated total
watch(estimatedBaseCost, (newCost) => {
  pricing.baseTotal = newCost;
});

// Watch for coupon code changes
watch(
  () => formData.value.couponCode,
  (newCode) => {
    if (newCode === "SAVE20") {
      pricing.discount = 5; // Example discount
    } else {
      pricing.discount = 0;
    }
  }
);

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const handleFileUpload = (event) => {
  if (event?.target?.files?.length) {
    formData.value.photo = event.target.files[0];
  }
};

const submitForm = () => {
  // Generate new order number
  const newOrderNumber = "RNS-" + Math.floor(Math.random() * 100000);

  // Save in Pinia store
  orderStore.setOrder(newOrderNumber, formData.value);

  // Navigate to success page (make sure the route exists)
  router.push("/order-success"); // or { name: 'OrderSuccess' }
};
</script>
