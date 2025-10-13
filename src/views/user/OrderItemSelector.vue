<template>
  <div class="p-4 sm:p-6 lg:p-10 min-h-screen ">
    <!-- Header -->
    <h1 class="text-3xl sm:text-4xl font-display font-bold mb-8 text-navy-blue flex items-center">
      <svg class="w-8 h-8 mr-3 text-pure-gold" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172l-4.293-4.293a2 2 0 00-2.828 2.828l6 6a2 2 0 002.828 0l10-10a2 2 0 000-2.828zM10 18a8 8 0 100-16 8 8 0 000 16zM10 4a6 6 0 110 12 6 6 0 010-12z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
      Select Your Laundry Items
    </h1>

    <!-- Loading & Error States -->
    <div v-if="isLoadingServices" class="text-golden-brown text-center py-20 ">
      <i class="fas fa-spinner fa-spin fa-3x"></i>
      <!-- <p class="mt-4 text-charcoal text-lg">Fetching services and prices...</p> -->
    </div>
    <div  
      v-else-if="servicesError"
      class="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-6 rounded-lg"
    >
      <p class="font-semibold mb-2">check your internet connection  {{ servicesError }}</p>
      <button
        @click="fetchServices"
        class="mt-2 text-sm underline text-destructive-foreground/80 hover:text-destructive-foreground"
      >
        <i class="fas fa-redo-alt mr-1"></i> Retry Loading
      </button>
    </div>

    <!-- Main Grid Layout -->
    <div v-else class="grid lg:grid-cols-3 gap-8">
      
      <!-- Left (Services & Configuration) -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Configuration Panel -->
        <div class="p-6 rounded-xl  border border-golden-brown/30  space-y-4">
          <h2 class="text-xl font-semibold text-navy-blue border-b pb-2 mb-4">Order Configuration</h2>
          <div class="grid sm:grid-cols-2 gap-4 sm:gap-6">
            
            <!-- Service Tier Selector (Using CustomSelect) -->
            <div>
              <CustomSelect
                :model-value="orderPayload.serviceTier"
                @update:model-value="handleTierChange"
                :options="[
                  { label: 'Standard', value: 'STANDARD' },
                  { label: 'Premium', value: 'PREMIUM' },
                  { label: 'VIP', value: 'VIP' },
                ]"
                label="Service Tier"
                placeholder="Choose Service Tier"
              />
              <p class="text-xs text-charcoal/70 mt-1">Updates price for all items.</p>
            </div>

            <!-- Pricing Model Selector (Using CustomSelect) -->
            <div>
              <CustomSelect
                v-model="orderPayload.pricingModel"
                :options="[
                  { label: 'Retail', value: 'RETAIL' },
                  { label: 'Subscription', value: 'SUBSCRIPTION' },
                ]"
                label="Pricing Model"
                placeholder="Choose Pricing Model"
              />
              <p v-if="orderPayload.pricingModel === 'SUBSCRIPTION'" class="text-xs text-charcoal/70 mt-1">Requires an active subscription.</p>
            </div>
          </div>
        </div>

        <!-- Subscription Warning -->
        <p v-if="!subscriptionValid" class="text-charcoal font-semibold p-4 bg-red-900/10 rounded-lg border-l-4 border-destructive">
          <i class="fas fa-exclamation-triangle mr-2"></i> {{ subscriptionError }}
        </p>

        <!-- Available Services List -->
        <h2 class="text-xl font-semibold text-charcoal border-b border-input pb-2 pt-4">
          Services ({{ orderPayload.pricingModel }} - {{ orderPayload.serviceTier }})
        </h2>

        <div v-if="groupedServices.length === 0" class="text-center py-10 text-charcoal/70">
          No services available for the selected model.
        </div>

        <!-- Service Item Cards -->
        <div
          v-for="service in groupedServices"
          :key="service.code"
          class="flex flex-col p-4 rounded-xl"
          :class="{
            'bg-red-900/10': isItemSelected(service.code),
            'bg-bone-white border border-golden-brown/30': !isItemSelected(service.code),
            'opacity-70': !subscriptionValid
          }"
        >
          <!-- Main Service Info & Controls -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3">
            
            <!-- Details -->
            <div class="flex-1 mb-3 sm:mb-0">
              <p class="font-bold text-xl text-navy-blue">{{ service.name }}</p>
              <p class="text-base text-charcoal mt-1">
                <span class="font-extrabold text-golden-brown">
                  ₦{{ getTierPrice(service.tiers).toLocaleString() }}
                </span>
                per {{ service.unit }}
              </p>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center space-x-3">
              <!-- Minus Button -->
              <button
                @click="removeItem(service.code, selectedAddOns[service.code] || [])"
                :disabled="!isItemSelected(service.code)"
                class="h-7 w-7 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                :class="[
                  isItemSelected(service.code)
                    ? 'bg-charcoal text-bone-white hover:bg-golden-brown/90'
                    : 'bg-charcoal/20 text-charcoal/60',
                ]"
              >
                <i class="fas fa-minus"></i>
              </button>

              <span class="w-8 text-center font-extrabold text-xl text-navy-blue transition-colors duration-300">
                {{ getItemQuantity(service.code) }}
              </span>

              <!-- Plus Button -->
              <button
                @click="addItemWithAddOns(service)"
                :disabled="!subscriptionValid"
                class="h-7 w-7 rounded-full flex items-center justify-center transition-all text-sm cursor-pointer"
                :class="[
                  subscriptionValid 
                  ? 'bg-charcoal text-white hover:bg-golden-brown/90' 
                  : 'bg-charcoal/30 text-charcoal/50 cursor-not-allowed'
                ]"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <!-- Add-ons Section -->
          <div v-if="service.addOns && service.addOns.length" class="pt-3 mt-3 border-t border-input/50">
            <p class="text-sm font-semibold text-charcoal/90 mb-2">Available Add-ons:</p>
            <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <label
                v-for="addon in service.addOns"
                :key="addon.key"
                class="inline-flex items-center text-charcoal/80 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  :value="addon"
                  :checked="isAddOnSelected(service.code, addon)"
                  @change="toggleAddOn(service.code, addon)"
                  class="form-checkbox h-4 w-4 text-golden-brown border-input rounded  transition-colors accent-golden-brown disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  :disabled="!subscriptionValid"
                />
                <span class="ml-2 font-medium group-hover:text-navy-blue">
                  {{ addon.name }} 
                  <span class="text-xs text-charcoal/60">(+₦{{ addon.price.toLocaleString() }})</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Right (Order Summary) -->
      <div class="lg:col-span-1">
        <!-- Sticky Summary Card on larger screens -->
        <div class="sticky lg:top-10 p-6 rounded-xl bg-charcoal border border-golden-brown/30 text-bone-white">
          <h2 class="text-2xl font-bold border-b border-cream/50 pb-4 mb-4 flex items-center">
            <i class="fas fa-shopping-basket mr-3 text-golden-brown"></i> Order Summary
          </h2>

          <div v-if="orderPayload.items.length === 0" class="text-center py-6 text-cream/70">
            Your basket is empty. Select items to begin your order.
          </div>

          <div v-else class="space-y-4">
            <!-- Item List -->
            <div 
              v-for="(item, index) in orderPayload.items" 
              :key="`${item.serviceCode}-${index}`" 
              class="flex flex-col text-sm border-b border-cream/20 pb-3 last:border-b-0"
            >
              <div class="flex justify-between font-bold">
                <span class="text-bone-white/90">{{ item.serviceName }}</span>
                <span class="text-pure-gold">₦{{ (item.quantity * item.price).toLocaleString() }}</span>
              </div>
              <p class="text-xs text-cream/60">{{ item.quantity }} x ₦{{ item.price.toLocaleString() }} ({{ item.serviceTier }})</p>
              
              <!-- Add-ons in summary -->
              <ul v-if="item.addOns && item.addOns.length" class="text-xs text-cream/70 ml-2 mt-1 space-y-0.5">
                <li v-for="addon in item.addOns" :key="addon.key" class="flex justify-between">
                  <span>+ {{ addon.name }}</span>
                  <span class="font-medium text-pure-gold/80">₦{{ addon.price.toLocaleString() }}</span>
                </li>
              </ul>
            </div>

            <!-- Totals -->
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
          </div>

          <!-- Call to Action Button -->
          <button
            @click="proceedToNextStep"
            :disabled="!subscriptionValid || orderPayload.items.length === 0"
            class="mt-6 py-4 px-4 w-full rounded-lg font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed  cursor-pointer"
            :class="[
              orderPayload.items.length > 0 && subscriptionValid
                ? 'bg-pure-gold text-navy-blue hover:bg-pure-gold/90 transform hover:-translate-y-0.5'
                : 'bg-charcoal text-cream/70',
            ]"
          >
            
            schedule pickup ({{ totalItemCount }} Items)
          </button>

          <p v-if="orderPayload.items.length > 0" class="mt-4 text-xs text-cream/60 text-center">
            * Final price (including discounts and delivery fee) is calculated next.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useOrderItems } from "@/composables/useOrderItems";
import { useRouter } from "vue-router";
import { authorizedFetch } from "@/services/api"; // Assuming these imports are correct
import { useUser } from "@/composables/useUser"; // Assuming these imports are correct
import CustomSelect from '@/components/atoms/CustomSelect.vue'; // Import CustomSelect

// Assuming useUser and useOrderItems are available in the scope
const { user, loadUser } = useUser(); 

const {
  orderPayload,
  groupedServices,
  isLoadingServices,
  servicesError,
  fetchServices,
  addItem,
  removeItem,
  totalItemCount,
  isItemSelected,
  getItemQuantity,
  estimatedSubtotal,
  updateAllItemPricesForTier,
} = useOrderItems();

const router = useRouter();
const selectedAddOns = ref({});
const subscriptionValid = ref(true);
const subscriptionError = ref("");

// --- Subscription Check ---
const checkUserSubscription = async () => {
  if (orderPayload.value.pricingModel === "SUBSCRIPTION") {
    // Note: loadUser might not work without a full Firebase/Auth setup, but keeping it for functionality
    await loadUser(); 
    
    // Mock check for demonstration purposes if user is not fully implemented
    const isUserSubscribed = user.value?.subscription?.active;

    if (!isUserSubscribed) {
      subscriptionValid.value = false;
      subscriptionError.value = "You do not have an active subscription. Items cannot be added until you switch to Retail or subscribe.";
    } else {
      subscriptionValid.value = true;
      subscriptionError.value = "";
    }
  } else {
    subscriptionValid.value = true;
    subscriptionError.value = "";
  }
};

// Watch pricing model changes to check subscription status
watch(() => orderPayload.value.pricingModel, () => {
  checkUserSubscription();
});

// Add-ons logic (Preserved from original)
const isAddOnSelected = (serviceCode, addon) => {
  const selected = selectedAddOns.value[serviceCode] || [];
  return selected.some((a) => a.key === addon.key);
};

const toggleAddOn = (serviceCode, addon) => {
  if (!subscriptionValid.value) return;

  if (!selectedAddOns.value[serviceCode]) {
      selectedAddOns.value[serviceCode] = [];
  }
  let currentAddOns = selectedAddOns.value[serviceCode];
  const existingIndex = currentAddOns.findIndex((a) => a.key === addon.key);

  const addonNameLower = addon.name.toLowerCase();

  if (existingIndex >= 0) {
    // Remove addon
    currentAddOns.splice(existingIndex, 1);
  } else {
    // Check for mutual exclusion
    if (addonNameLower.includes("express")) {
      // Remove same-day if express is selected
      currentAddOns = currentAddOns.filter(a => !a.name.toLowerCase().includes("same-day"));
    } else if (addonNameLower.includes("same-day")) {
      // Remove express if same-day is selected
      currentAddOns = currentAddOns.filter(a => !a.name.toLowerCase().includes("express"));
    }
    currentAddOns.push(addon);
  }
  selectedAddOns.value[serviceCode] = currentAddOns;
};

// Tier price lookup
const getTierPrice = (tiers) => {
  const currentTier = orderPayload.value.serviceTier;
  return tiers[currentTier] ? tiers[currentTier].pricePerItem : 0;
};

// Handle tier change from CustomSelect
const handleTierChange = (newTier) => {
  orderPayload.value.serviceTier = newTier; // Update payload first
  updateAllItemPricesForTier(newTier); // Trigger price recalculation
};

// Add item with currently selected add-ons
const addItemWithAddOns = (service) => {
  if (!subscriptionValid.value) return;
  const addOnsForService = selectedAddOns.value[service.code] || [];
  
  // The structure passed to addItem needs to contain the details for itemization
  addItem(
    {
      ...service,
      serviceCode: service.code,
      serviceName: service.name,
      unit: service.unit,
      serviceTier: orderPayload.value.serviceTier,
      pricingModel: orderPayload.value.pricingModel,
      price: getTierPrice(service.tiers) // Use the price for the currently selected tier
    },
    addOnsForService
  );
};

// Next Step
const proceedToNextStep = () => {
  if (!subscriptionValid.value) {
    console.error("Cannot proceed: Subscription is invalid.");
    return;
  }
  if (orderPayload.value.items.length > 0) {
    router.push({ name: "PickupDelivery" });
  }
};

// Watch for changes in selectedAddOns and apply them to the orderPayload items
watch(selectedAddOns, (newVal) => {
  for (const [serviceCode, addOns] of Object.entries(newVal)) {
    // Find all items in the payload that match this service code (as quantity is aggregated)
    // NOTE: This assumes `addItem` creates separate entries or updates the *first* matching entry's addOns. 
    // The original logic is slightly ambiguous here, so we will update all matching items for consistency.
    orderPayload.value.items
      .filter((i) => i.serviceCode === serviceCode)
      .forEach(item => {
        // Create a deep copy of the selected addOns to assign
        item.addOns = JSON.parse(JSON.stringify(addOns)); 
      });
  }
}, { deep: true });


onMounted(() => {
  fetchServices();
  checkUserSubscription();
});
</script>
