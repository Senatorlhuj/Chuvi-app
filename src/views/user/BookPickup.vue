<template>
  <div class="p-6 space-y-10 min-h-screen">
    <div
      class="rounded-xl p-6"
     
    >
      <h2
        class="text-3xl font-bold mb-6 border-b pb-3 border-charcoal/20"
        :style="{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-navy-blue)',
        }"
      >
        Place Your Order
      </h2>

      <form @submit.prevent="createOrderHandler" class="space-y-8">
        <section class="space-y-4">
          <h3
            class="font-semibold text-xl mb-3 border-l-4 pl-3"
            :style="{
              color: 'var(--color-navy-blue)',
              borderLeftColor: 'var(--color-golden-brown)',
            }"
          >
            1. User and Service Selection
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              v-model="form.userName"
              placeholder="Enter Your Full Name "
              class="custom-input"
              required
            />
            <input
              v-model="form.userPhone"
              placeholder="Enter Your Phone Number"
              class="custom-input"
              required
            />
            <input
              v-model="form.couponCode"
              placeholder="Coupon Code (Optional)"
              class="custom-input"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomSelect
              v-model="form.pricingModel"
              :options="pricingModelOptions"
              placeholder="Select Pricing Model"
              label="Pricing Model Selection"
              @update:modelValue="updateAllItemDetails"
            />

            <CustomSelect
              v-model="form.serviceTier"
              :options="serviceTierOptions"
              placeholder="Select Service Tier"
              label="Service Tier Selection"
              @update:modelValue="updateAllItemDetails"
            />

            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="sameDay"
                v-model="form.sameDay"
                class="h-5 w-5 rounded custom-checkbox"
              />
              <label for="sameDay" class="text-charcoal font-medium"
                >Same-Day Service</label
              >
            </div>
          </div>

          <textarea
            v-model="form.notes"
            placeholder="General Notes (e.g., Handle whites separately)"
            class="custom-input"
          ></textarea>

          <p
            v-if="loadingCatalog"
            class="text-charcoal/70 text-sm font-semibold mt-2"
          >
            Loading service catalog...
          </p>
          <p
            v-else-if="!servicesCatalog.length"
            class="text-red-600 text-sm font-semibold mt-2"
          >
          No services found, please check your internet connection 
          </p>
        </section>

        <hr class="border-charcoal/10" />

        <section>
          <h3
            class="font-semibold text-xl mb-4 border-l-4 pl-3"
            :style="{
              color: 'var(--color-navy-blue)',
              borderLeftColor: 'var(--color-golden-brown)',
            }"
          >
            2. Order Items (Select Service)
          </h3>

          <div class="space-y-4">
            <div
              v-for="(item, idx) in form.items"
              :key="idx"
              class="border border-charcoal/30 rounded-lg p-4 relative"
             
            >
              <button
                type="button"
                @click="removeItem(idx)"
                class="absolute -top-3 -right-3 h-7 w-7 text-white flex items-center justify-center rounded-full hover:bg-red-700 cursor-pointer"
                :style="{ backgroundColor: 'var(--color-charcoal)' }"
                title="Remove item"
              >
                <font-awesome-icon icon="trash" class="text-xs" />
              </button>

              <div class="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end">
                <div class="col-span-2">
                  <label class="block text-xs font-medium text-charcoal/70 mb-1"
                    >Service</label
                  >

                  <CustomSelect
                    v-model="item.serviceCode"
                    :options="itemServiceOptions"
                    :disabled="!servicesCatalog.length"
                    placeholder="Select a Service"
                    :label="`Service Selection for Item ${idx + 1}`"
                    @update:modelValue="updateItemDetails(idx)"
                    :key="`service-${idx}`"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-charcoal/70 mb-1"
                    >Base Price (₦)</label
                  >
                  <input
                    :value="item.price.toLocaleString() || 0"
                    placeholder="Price"
                    class="custom-input"
                    readonly
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-charcoal/70 mb-1"
                    >Quantity</label
                  >
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    placeholder="Qty"
                    class="custom-input"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-charcoal/70 mb-1"
                    >Unit</label
                  >
                  <input
                    :value="item.unit || 'N/A'"
                    placeholder="Unit"
                    class="custom-input"
                    readonly
                  />
                </div>
              </div>

              <div v-if="item.serviceCode" class="grid grid-cols-4 gap-3">
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :id="'express-' + idx"
                    v-model="item.express"
                    class="h-5 w-5 rounded custom-checkbox"
                  />
                  <label
                    :for="'express-' + idx"
                    class="text-charcoal text-sm font-medium"
                    >Express</label
                  >
                </div>

                <div
                  v-for="addOn in getServiceAddOns(item.serviceCode)"
                  :key="addOn.key"
                  class="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    :id="`${item.serviceCode}-${addOn.key}`"
                    v-model="item.addOns"
                    :value="addOn.key"
                    class="h-5 w-5 rounded custom-checkbox"
                  />
                  <label
                    :for="`${item.serviceCode}-${addOn.key}`"
                    class="text-charcoal text-sm"
                  >
                    {{ addOn.name }} (₦{{ addOn.price.toLocaleString() }})
                  </label>
                </div>
              </div>

              <textarea
                v-model="item.itemNotes"
                placeholder="Item notes (optional, e.g., 'Do not iron the silk shirt')"
                class="custom-input mt-3"
              ></textarea>
            </div>
          </div>

          <button
            type="button"
            @click="addItem"
            class="mt-4 px-6 py-2 rounded-md font-medium transition-colors w-full md:w-auto bg-golden-brown text-bone-white hover:bg-golden-brown/90 cursor-pointer"
           
          >
            <font-awesome-icon icon="plus" class="mr-2" /> Add Item
          </button>
        </section>

        <hr class="border-charcoal/10" />

        <section class="grid md:grid-cols-2 gap-8">
          <div>
            <h3
              class="font-semibold text-xl mb-4 border-l-4 pl-3"
              :style="{
                color: 'var(--color-navy-blue)',
                borderLeftColor: 'var(--color-golden-brown)',
              }"
            >
              3. Pickup Details
            </h3>
            <input
              v-model="form.pickup.date"
              placeholder="Pickup Date (e.g., 2025-10-20)"
              type="text"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.pickup.window"
              placeholder="Time Window (e.g., 9:00 AM - 12:00 PM)"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.pickup.address.label"
              placeholder="Address Label (e.g., Home)"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.pickup.address.line1"
              placeholder="Address Line 1"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.pickup.address.line2"
              placeholder="Address Line 2 (Optional)"
              class="custom-input mb-3"
            />
            <input
              v-model="form.pickup.address.city"
              placeholder="City"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.pickup.address.state"
              placeholder="State"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.pickup.address.landmark"
              placeholder="Landmark (Optional)"
              class="custom-input"
            />
          </div>

          <div>
            <h3
              class="font-semibold text-xl mb-4 border-l-4 pl-3"
              :style="{
                color: 'var(--color-navy-blue)',
                borderLeftColor: 'var(--color-golden-brown)',
              }"
            >
              4. Delivery Details
            </h3>
            <input
              v-model="form.delivery.date"
              placeholder="Preferred Delivery Date (e.g., 2025-10-23)"
              type="text"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.delivery.window"
              placeholder="Time Window (e.g., 5:00 PM - 8:00 PM)"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.delivery.address.label"
              placeholder="Address Label (e.g., Office)"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.delivery.address.line1"
              placeholder="Address Line 1"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.delivery.address.line2"
              placeholder="Address Line 2 (Optional)"
              class="custom-input mb-3"
            />
            <input
              v-model="form.delivery.address.city"
              placeholder="City"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.delivery.address.state"
              placeholder="State"
              class="custom-input mb-3"
              required
            />
            <input
              v-model="form.delivery.address.landmark"
              placeholder="Landmark (Optional)"
              class="custom-input"
            />
          </div>
        </section>

        <hr class="border-charcoal/10" />

        <section>
          <h3
            class="font-semibold text-xl mb-4 border-l-4 pl-3"
            :style="{
              color: 'var(--color-navy-blue)',
              borderLeftColor: 'var(--color-golden-brown)',
            }"
          >
            5. Payment Method
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomSelect
              v-model="form.payment.method"
              :options="paymentMethodOptions"
              placeholder="Select Payment Method"
              label="Payment Method Selection"
            />

            <CustomSelect
              v-model="form.payment.mode"
              :options="paymentModeOptions"
              placeholder="Select Payment Mode"
              label="Payment Mode Selection"
            />
          </div>
          <p class="text-sm text-golden-brown/80 self-center my-3">
            The final price will be calculated and displayed after submission.
          </p>
        </section>

        <button
          type="submit"
          class="px-8 py-3 rounded-lg font-bold text-lg transition-transform transform bg-golden-brown text-bone-white hover:bg-golden-brown/90 w-auto cursor-pointer"
      
        >
          Submit Order
        </button>
      </form>
    </div>

    <div
      class="rounded-xl p-6 border"
      :style="{ borderColor: 'var(--color-charcoal)' }"
    >
      <h2
        class="text-3xl font-bold mb-6 border-b pb-3 border-charcoal/20"
        :style="{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-navy-blue)',
        }"
      >
        My Order History
      </h2>

      <div class="flex flex-col md:flex-row gap-3 mb-6">
        <input
          v-model="userPhone"
          placeholder="Enter phone number to search (e.g., 08012345678)"
          class="custom-input flex-1"
        />
        <button
          @click="fetchOrders"
          class="px-6 py-2 rounded-md font-medium transition-colors bg-golden-brown text-bone-white hover:bg-golden-brown/90 cursor-pointer"
          
        >
          <font-awesome-icon icon="search" class="mr-2" /> Fetch Orders
        </button>
      </div>

      <div v-if="orders.length" class="space-y-4">
        <div
          v-for="order in orders"
          :key="order._id"
          class="border rounded-lg p-4"
          :style="{ borderColor: 'var(--color-charcoal)' }"
        >
          <div class="flex justify-between items-start mb-2 border-b pb-2">
            <div
              class="font-bold text-lg"
              :style="{ color: 'var(--color-navy-blue)' }"
            >
              Order #{{ order._id.substring(0, 8) }}...
            </div>
            <span
              class="px-3 py-1 text-sm font-semibold rounded-full"
              :class="getStatusClass(order.status)"
            >
              {{ order.status }}
            </span>
          </div>

          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-y-1 text-sm"
            :style="{ color: 'var(--color-charcoal)' }"
          >
            <div>
              <span class="font-medium">Total:</span>
              <span
                class="font-bold ml-1"
                :style="{ color: 'var(--color-navy-blue)' }"
                >₦{{ order.totals?.grandTotal?.toLocaleString() ?? "-" }}</span
              >
            </div>
            <div>
              <span class="font-medium">Model:</span> {{ order.pricingModel }}
            </div>
            <div>
              <span class="font-medium">Tier:</span> {{ order.serviceTier }}
            </div>
            <div>
              <span class="font-medium">Items:</span> {{ order.items.length }}
            </div>
            <div class="col-span-2">
              <span class="font-medium">Pickup:</span>
              {{ formatDate(order.pickup?.date) }}
            </div>
            <div class="col-span-2">
              <span class="font-medium">Delivery:</span>
              {{ formatDate(order.delivery?.date) }}
            </div>
          </div>

          <div
            class="mt-3 flex justify-end gap-3 pt-2 border-t"
            :style="{ borderColor: 'var(--color-charcoal)' }"
          >
            <button
              v-if="['Booked', 'Picked Up'].includes(order.status)"
              @click="cancelOrderHandler(order._id)"
              class="px-4 py-1 text-sm font-medium rounded-md text-white hover:opacity-90"
              :style="{ backgroundColor: 'var(--color-charcoal)' }"
            >
              <font-awesome-icon icon="times" class="mr-1" /> Cancel Order
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-charcoal text-center py-4">
        No orders found for that phone number.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import CustomSelect from "@/components/atoms/CustomSelect.vue";
import {
  createOrder,
  getUserOrders,
  cancelUserOrder,
  getAllServicesCatalog,
} from "@/services/api.js";
import { useToast } from "@/composables/useToast";

const { showSuccess, showError } = useToast();

const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

// --- API CATALOG DATA ---
const servicesCatalog = ref([]);
const loadingCatalog = ref(false);

// --- OPTIONS DATA FOR CUSTOM SELECTS ---

const pricingModelOptions = [
  { label: "RETAIL (One-time)", value: "RETAIL" },
  { label: "SUBSCRIPTION (Member Plan)", value: "SUBSCRIPTION" },
];

const serviceTierOptions = [
  { label: "STANDARD", value: "STANDARD" },
  { label: "PREMIUM", value: "PREMIUM" },
  { label: "SIGNATURE", value: "SIGNATURE" },
];

const paymentModeOptions = [
  { label: "Full Payment", value: "FULL" },
  { label: "Installment Plan", value: "INSTALLMENT" },
];

const paymentMethodOptions = computed(() => {
  const options = [
    { label: "Debit/Credit Card", value: "CARD" },
    { label: "Bank Transfer", value: "BANK_TRANSFER" },
    { label: "Wallet Balance", value: "WALLET" },
  ];
  // Conditionally enable Subscription Credit
  if (form.value.pricingModel === "SUBSCRIPTION") {
    options.push({ label: "Subscription Credit", value: "SUBSCRIPTION" });
  }
  return options;
});

// Converts the servicesCatalog into the { label, value } format required by CustomSelect
const itemServiceOptions = computed(() => {
  return servicesCatalog.value.map((service) => ({
    label: service.name,
    value: service.code,
  }));
});

// --- FORM DATA ---
const form = ref({
  userPhone: storedUser.phone || "",
  userName: storedUser.name || "",
  notes: "",
  couponCode: "",
  pricingModel: "",
  serviceTier: "",
  sameDay: false,
  items: [
    {
      serviceCode: "",
      serviceName: "",
      quantity: 1,
      unit: "",
      itemNotes: "",
      price: 0,
      express: false,
      addOns: [], // Array to store selected add-on keys (e.g., ["iron", "perfume"])
    },
  ],
  pickup: {
    date: "",
    window: "",
    address: {
      label: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      landmark: "",
      zone: "",
    },
  },
  delivery: {
    date: "",
    window: "",
    address: {
      label: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      landmark: "",
      zone: "",
    },
  },
  payment: {
    method: "",
    mode: "FULL",
    installments: [],
  },
});

const userPhone = ref(storedUser.phone || "");
const orders = ref([]);

// --- LIFECYCLE HOOK ---
onMounted(async () => {
  loadingCatalog.value = true;
  try {
    const servicesData = await getAllServicesCatalog();
    servicesCatalog.value = servicesData || [];
    updateAllItemDetails(); // Attempt to populate prices if a tier is already selected
  } catch (e) {
    console.error("Failed to load service catalog:", e);
    showError("Failed to load service catalog from /api/services.");
  } finally {
    loadingCatalog.value = false;
  }
});

// --- ITEM CATALOG LOOKUP ---

/**
 * Returns the add-ons array for a given service code.
 */
function getServiceAddOns(serviceCode) {
  const service = servicesCatalog.value.find((s) => s.code === serviceCode);
  return service ? service.addOns || [] : [];
}

/**
 * Updates serviceName, price, and unit for a single item based on serviceCode and serviceTier.
 */
function updateItemDetails(index) {
  const item = form.value.items[index];
  const selectedCode = item.serviceCode;
  const selectedTier = form.value.serviceTier;

  // Reset details on change
  item.serviceName = "";
  item.price = 0;
  item.unit = "";

  if (!selectedCode || !selectedTier) {
    return;
  }

  // 1. Find the master service detail
  const serviceDetail = servicesCatalog.value.find(
    (s) => s.code === selectedCode
  );

  if (!serviceDetail) {
    showError(`Service code ${selectedCode} not found in catalog.`);
    return;
  }

  item.serviceName = serviceDetail.name;
  // The base unit is stored on the service object
  item.unit = serviceDetail.unit || "N/A";

  // 2. Find the SPECIFIC Pricing based on Code, PricingModel, and Tier
  const pricing = serviceDetail.pricings.find(
    (p) =>
      p.serviceCode === selectedCode &&
      p.serviceTier === selectedTier &&
      p.pricingModel === form.value.pricingModel // Ensure model is also matched
  );

  if (pricing) {
    // Use pricePerItem from the pricing rule
    item.price = pricing.pricePerItem || 0;
  } else {
    // Fallback for missing pricing
    // showError(`Pricing not set for ${item.serviceName} (${selectedTier}, ${form.value.pricingModel}).`);
    item.price = 0;
  }
}

/**
 * Triggers a price/unit update for all existing items when the global Service Tier or Pricing Model changes.
 */
function updateAllItemDetails() {
  form.value.items.forEach((_, index) => updateItemDetails(index));
}

function addItem() {
  form.value.items.push({
    serviceCode: "",
    serviceName: "",
    quantity: 1,
    unit: "",
    itemNotes: "",
    price: 0,
    express: false,
    addOns: [],
  });
}

function removeItem(index) {
  form.value.items.splice(index, 1);
}

// --- ORDER HANDLERS ---

async function createOrderHandler() {
  try {
    // Basic Required Field Validation
    if (
      !form.value.userName ||
      !form.value.userPhone ||
      !form.value.pricingModel ||
      !form.value.serviceTier ||
      !form.value.pickup.date ||
      !form.value.delivery.date ||
      !form.value.payment.method ||
      form.value.items.length === 0
    ) {
      showError(
        "Please fill in all required user, service, and pickup/delivery fields."
      );
      return;
    }

    const invalidItem = form.value.items.find(
      (item) => !item.serviceCode || item.quantity <= 0 || item.price <= 0
    );
    if (invalidItem) {
      showError(
        "Each item must have a selected service, quantity (>0), and valid price. Check your Service Tier selection."
      );
      return;
    }

    const payload = { ...form.value };

    if (!payload.couponCode) delete payload.couponCode;

    console.log("-----------------------------------------");
    console.log(
      "PAYLOAD BEING SENT TO BACKEND (Check for empty/missing required fields):"
    );
    console.log(JSON.stringify(payload, null, 2));
    console.log("-----------------------------------------");

    const response = await createOrder(payload);

    showSuccess("Order created successfully! Redirecting to payment...");

    // Simulate payment redirect
    if (response.paymentInitResponse?.paymentUrl) {
      // window.location.href = response.paymentInitResponse.paymentUrl;
      showSuccess(
        "Simulated redirect to payment URL: " +
          response.paymentInitResponse.paymentUrl
      );
    }

    // Reset form after successful submission
    form.value.items = [
      {
        serviceCode: "",
        serviceName: "",
        quantity: 1,
        unit: "",
        itemNotes: "",
        price: 0,
        express: false,
        addOns: [],
      },
    ];
    form.value.notes = "";
    form.value.couponCode = "";
    form.value.serviceTier = "";
  } catch (err) {
    console.error("Create order failed:", err);
    showError(
      err.message || "Failed to create order. Please check all details."
    );
  }
}

async function fetchOrders() {
  try {
    if (!userPhone.value) {
      showError("Please enter phone number to fetch orders.");
      orders.value = [];
      return;
    }
    const data = await getUserOrders(userPhone.value);
    orders.value = Array.isArray(data) ? data : [];
    showSuccess(`Fetched ${orders.value.length} orders successfully!`);
  } catch (err) {
    console.error("Fetch orders failed:", err);
    orders.value = [];
    showError(err.message || "Failed to fetch orders.");
  }
}

async function cancelOrderHandler(orderId) {
  if (
    !confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    )
  )
    return;

  try {
    await cancelUserOrder(orderId, { note: "Cancelled by user via app/web" });
    showSuccess(`Order ${orderId.substring(0, 8)}... has been cancelled.`);
    await fetchOrders();
  } catch (err) {
    console.error("Cancel order failed:", err);
    showError(err.message || "Failed to cancel order.");
  }
}

// --- UTILITY FUNCTIONS ---

function formatDate(date) {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return date;
  }
}

function getStatusClass(status) {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Ready":
      return "bg-blue-100 text-blue-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}
</script>

<style scoped>
.custom-input {
  width: 100%;
  border: 1px solid var(--color-charcoal);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  /* background-color: var(--color-bone-white); */
  color: var(--color-charcoal);
}

.custom-input:focus {
  border-color: var(--color-golden-brown);
}

/* Custom Checkbox Styling using the Golden Brown color */
.custom-checkbox {
  appearance: none; 
  display: inline-block;
  height: 1.25rem; 
  width: 1.25rem; 
  border-radius: 0.25rem; 
  border: 1px solid var(--color-charcoal); 
  cursor: pointer;
  /* background-color: var(--color-bone-white); */
  transition: all 0.2s;
}

.custom-checkbox:checked {
  background-color: var(
    --color-golden-brown
  ); /* Fill with golden brown when checked */
  border-color: var(--color-golden-brown);
  /* Use a white checkmark icon via content/background-image */
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 00-1.414 0L7 8.586 4.207 5.793a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0l5-5a1 1 0 000-1.414z'/%3e%3c/svg%3e");
}

.custom-checkbox:focus {
  outline: none;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}
</style>