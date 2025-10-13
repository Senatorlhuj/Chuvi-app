<template>
  <section
    class="py-16 bg-bone-white opacity-0 translate-y-10 transition-all duration-1000 ease-out"
    id="pricing"
    ref="pricingSection"
  >
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
      <h2
        class="text-4xl font-extrabold text-charcoal text-center mb-16"
        style="font-family: var(--font-display)"
      >
        Choose Your Ideal Plan
      </h2>

      <!-- Loading State -->
    
<div v-if="isLoading" class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div
    v-for="n in 3"
    :key="n"
    class="animate-pulse bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between h-80"
  >
    <!-- Image placeholder -->
    <div class="h-32 bg-gray-200 rounded-xl mb-4"></div>

    <!-- Title placeholder -->
    <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>

    <!-- Tier placeholder -->
    <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

    <!-- Price placeholder -->
    <div class="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>

    <!-- Features list placeholders -->
    <div class="space-y-2">
      <div class="h-4 bg-gray-200 rounded w-full"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>

    <!-- Button placeholder -->
    <div class="h-10 bg-gray-300 rounded w-full mt-4"></div>
  </div>
</div>


      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-destructive p-4 rounded-lg text-destructive-foreground text-center"
      >
        {{ error }}
      </div>

      <!-- Main Pricing Layout -->
      <div v-else class="flex flex-col md:flex-row gap-8">
        <!-- LEFT: Plans List -->
        <div class="flex-1 space-y-4">
          <div
            v-for="(plan, index) in plans"
            :key="plan.code"
            @click="selectedPlan = plan"
            class="cursor-pointer p-6 rounded-2xl border-1 transition-all duration-500 "
            :class="[
              selectedPlan?.code === plan.code
                ? 'border-pure-gold bg-cream scale-[1.02]'
                : 'border-golden-brown/30 bg-white',
            ]"
            ref="planCards"
          >
            <h3
              class="text-xl font-bold mb-1"
              :class="
                selectedPlan?.code === plan.code
                  ? 'text-navy-blue'
                  : 'text-charcoal'
              "
            >
              {{ plan.name }}
            </h3>
            <p class="text-sm text-muted-foreground mb-2 capitalize">
              {{ plan.tier.toLowerCase() }}
            </p>
            <p class="text-2xl font-extrabold text-golden-brown">
              {{ formatPrice(plan.price_ngn) }}
              <span class="text-sm font-normal text-charcoal">/month</span>
            </p>
          </div>
        </div>

        <!-- RIGHT: Selected Plan Details -->
        <div
          v-show="selectedPlan"
          class="flex-1 bg-white p-8 rounded-2xl border-2 border-golden-brown/30  transition-all duration-500 opacity-0 translate-y-8"
          ref="planDetails"
        >
          <h3 class="text-3xl font-bold text-navy-blue mb-6">
            {{ selectedPlan.name }}
          </h3>
          <ul class="space-y-4 mb-8 text-charcoal">
            <li class="flex items-center">
              <font-awesome-icon
                :icon="faCheckCircle"
                class="text-pure-gold mr-3"
              />
              <span>{{ selectedPlan.monthly_items }} Items / Month</span>
            </li>
            <li class="flex items-center">
              <font-awesome-icon
                :icon="
                  selectedPlan.rollover_limit_items > 0
                    ? faCheckCircle
                    : faTimesCircle
                "
                :class="
                  selectedPlan.rollover_limit_items > 0
                    ? 'text-pure-gold'
                    : 'text-gray-400'
                "
                class="mr-3"
              />
              <span>
                {{
                  selectedPlan.rollover_limit_items > 0
                    ? `${selectedPlan.rollover_limit_items} Item Rollover`
                    : "No Rollover"
                }}
              </span>
            </li>
            <li class="flex items-center">
              <font-awesome-icon
                :icon="faCheckCircle"
                class="text-pure-gold mr-3"
              />
              {{ selectedPlan.included_trips }} Free Delivery Trips
            </li>
            <li class="flex items-center">
              <font-awesome-icon
                :icon="faCheckCircle"
                class="text-pure-gold mr-3"
              />
              SLA: {{ selectedPlan.sla_hours }} Hours
            </li>
          </ul>

          <button
            @click="selectPlan(selectedPlan.code)"
            class="w-full py-4 flex items-center justify-center bg-pure-gold text-navy-blue font-bold rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer"
          >
            <font-awesome-icon :icon="faShoppingCart" class="mr-2" />
            Subscribe to {{ selectedPlan.name }}
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Payment Modal -->
  <div
    v-if="isPaymentModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
  >
    <div class="bg-bone-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-navy-blue">Select Payment Method</h3>
        <button
          @click="closeModal"
          class="text-charcoal hover:text-golden-brown cursor-pointer"
        >
          <font-awesome-icon :icon="faWindowClose" class="w-10 h-10" />
        </button>
      </div>

      <p class="mb-4 text-charcoal">
        Choose how to pay for:
        <span class="font-semibold text-pure-gold">{{
          selectedPlan?.name
        }}</span>
      </p>

      <div class="space-y-4 mb-6">
        <button
          @click="selectedGateway = 'PAYSTACK'"
          :disabled="isSubscribing"
          class="w-full p-4 border-2 rounded-lg transition-all flex items-center justify-center font-semibold cursor-pointer"
          :class="
            selectedGateway === 'PAYSTACK'
              ? 'bg-pure-gold text-navy-blue border-pure-gold'
              : 'bg-cream text-charcoal border-gray-300 hover:bg-bone-white'
          "
        >
          <font-awesome-icon :icon="faCreditCard" class="mr-3" />
          Paystack (Recommended)
        </button>

        <button
          @click="selectedGateway = 'MONNIFY'"
          :disabled="isSubscribing"
          class="w-full p-4 border-2 rounded-lg transition-all flex items-center justify-center font-semibold cursor-pointer"
          :class="
            selectedGateway === 'MONNIFY'
              ? 'bg-pure-gold text-navy-blue border-pure-gold'
              : 'bg-cream text-charcoal border-gray-300 hover:bg-bone-white'
          "
        >
          <font-awesome-icon :icon="faCreditCard" class="mr-3" />
          Monnify
        </button>
      </div>

      <div
        v-if="paymentError"
        class="bg-destructive p-3 rounded text-destructive-foreground mb-4"
      >
        {{ paymentError }}
      </div>

      <button
        @click="initiateSubscription"
        :disabled="!selectedGateway || isSubscribing"
        class="w-full py-3 bg-navy-blue text-cream font-bold rounded-lg transition-colors disabled:opacity-50 hover:bg-golden-brown cursor-pointer"
      >
        <span v-if="isSubscribing">Initializing Payment...</span>
        <span v-else>Continue to {{ selectedGateway }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import {
  fetchUserPlans,
  subscribeToPlan,
  fetchUserProfile,
} from "@/services/api";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCheckCircle,
  faShoppingCart,
  faTimesCircle,
  faCreditCard,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";

const plans = ref([]);
const selectedPlan = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isPaymentModalOpen = ref(false);
const selectedGateway = ref(null);
const isSubscribing = ref(false);
const paymentError = ref(null);
const isAuthenticated = ref(false);

const pricingSection = ref(null);
const planCards = ref([]);
const planDetails = ref(null);

// Currency format
const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

// Check auth
const checkAuth = async () => {
  try {
    await fetchUserProfile();
    isAuthenticated.value = true;
  } catch {
    isAuthenticated.value = false;
  }
};

// Fetch Plans
const loadPlans = async () => {
  isLoading.value = true;
  try {
    const cached = localStorage.getItem("pricingPlans");
    if (cached) plans.value = JSON.parse(cached);

    const response = await fetchUserPlans();
    plans.value = response;
    localStorage.setItem("pricingPlans", JSON.stringify(response));

    if (!selectedPlan.value && plans.value.length > 0) {
      selectedPlan.value = plans.value[0];
    }
  } catch (err) {
    console.error(err);
    error.value = err.message || "Failed to load plans, please check your internet connection.";
  } finally {
    isLoading.value = false;
  }
};

// Select Plan
const selectPlan = (code) => {
  if (!isAuthenticated.value) {
    localStorage.setItem("redirectAfterRegister", window.location.pathname);
    window.location.href = "/register";
    return;
  }
  isPaymentModalOpen.value = true;
};

// Payment
const initiateSubscription = async () => {
  if (!selectedGateway.value) {
    paymentError.value = "Please select a payment gateway.";
    return;
  }

  isSubscribing.value = true;
  try {
    const response = await subscribeToPlan({
      planCode: selectedPlan.value.code,
      gateway: selectedGateway.value,
    });
    window.location.href = response.paymentLink;
  } catch (err) {
    paymentError.value = err.message || "Payment failed.";
  } finally {
    isSubscribing.value = false;
  }
};

const closeModal = () => {
  isPaymentModalOpen.value = false;
  selectedGateway.value = null;
  paymentError.value = null;
};

// Fade-in animation
const animateOnScroll = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.remove("opacity-0", "translate-y-10", "translate-y-8");
    entry.target.classList.add("opacity-100", "translate-y-0");
    observer.unobserve(entry.target); // so it doesn't toggle again
  }
});

    },
    { threshold: 0.2 }
  );

  if (pricingSection.value) observer.observe(pricingSection.value);
  planCards.value.forEach((el) => observer.observe(el));
  if (planDetails.value) observer.observe(planDetails.value);
};

onMounted(async () => {
  await checkAuth();
  await loadPlans();
  await nextTick();
  animateOnScroll();
});
</script>
