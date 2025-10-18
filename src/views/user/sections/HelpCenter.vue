<template>
  <div class="p-6 lg:p-10 max-w-5xl mx-auto text-navy-blue">
    <!-- Back Button -->
    <button
      @click="goBack"
      class="flex items-center gap-2 text-golden-brown hover:text-golden-brown/80 mb-6"
    >
      <i class="fas fa-arrow-left"></i>
      <span>Back</span>
    </button>

    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">Help Center</h1>
      <p class="text-gray-500 mt-1">
        Get answers, explore topics, or contact our team directly.
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex justify-center mb-6 border-b border-golden-brown/30">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'px-6 py-2 font-semibold transition-all',
          activeTab === tab
            ? 'text-golden-brown border-b-2 border-golden-brown'
            : 'text-gray-500 hover:text-golden-brown/80',
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- FAQ Section -->
    <div v-if="activeTab === 'FAQ'">
      <!-- Filter -->
      <div class="mb-6">
        <div class="relative">
          <i
            class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          ></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search FAQs..."
            class="w-full pl-10 pr-4 py-2 border border-golden-brown/30 rounded-xl focus:ring focus:ring-golden-brown/20 focus:outline-none"
          />
        </div>
      </div>

      <!-- FAQs grouped by category -->
      <div class="space-y-6">
        <div
          v-for="category in filteredFaqs"
          :key="category.category"
          class="border border-golden-brown/30 rounded-xl bg-bone-white overflow-hidden"
        >
          <!-- Category Header -->
          <button
            @click="toggleCategory(category)"
            class="flex justify-between items-center w-full p-4 bg-bone-white text-left font-semibold"
          >
            <span>{{ category.category }}</span>
            <i
              :class="[
                'fas transition-transform duration-200',
                category.open ? 'fa-chevron-up' : 'fa-chevron-down',
              ]"
            ></i>
          </button>

          <!-- Category Questions -->
          <transition name="accordion">
            <div
              v-if="category.open"
              class="border-t border-golden-brown/20 bg-white divide-y divide-golden-brown/10"
            >
              <div
                v-for="faq in category.items"
                :key="faq.question"
                class="p-4"
              >
                <button
                  @click="toggleQuestion(faq)"
                  class="flex justify-between w-full text-left"
                >
                  <span class="font-medium">{{ faq.question }}</span>
                  <i
                    :class="[
                      'fas transition-transform duration-200 text-sm',
                      faq.open ? 'fa-chevron-up' : 'fa-chevron-down',
                    ]"
                  ></i>
                </button>

                <transition name="accordion">
                  <div
                    v-if="faq.open"
                    class="mt-2 text-gray-600 pl-1 border-l-2 border-golden-brown/40 ml-2"
                  >
                    {{ faq.answer }}
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Contact Us Section -->
    <div v-else class="space-y-6">
      <!-- Contact Info -->
      <div class="space-y-4">
        <div class="flex items-center gap-3 text-lg">
          <i class="fas fa-phone-alt text-golden-brown"></i>
          <a href="tel:+2348090000000" class="hover:text-golden-brown/80">
            +234 809 000 0000
          </a>
        </div>
        <div class="flex items-center gap-3 text-lg">
          <i class="fas fa-map-marker-alt text-golden-brown"></i>
          <span>123 Chuvi Plaza, Awka, Anambra State, Nigeria</span>
        </div>
      </div>

      <!-- Social Media Accordion -->
      <div
        v-for="social in socials"
        :key="social.name"
        class="border border-golden-brown/30 rounded-xl overflow-hidden bg-bone-white"
      >
        <button
          @click="toggleSocial(social)"
          class="flex justify-between items-center w-full p-4 text-left"
        >
          <div class="flex items-center gap-3">
            <i :class="[social.icon, 'text-golden-brown text-lg']"></i>
            <span class="font-medium">{{ social.name }}</span>
          </div>
          <i
            :class="[
              'fas transition-transform duration-200',
              social.open ? 'fa-chevron-up' : 'fa-chevron-down',
            ]"
          ></i>
        </button>

        <transition name="accordion">
          <div
            v-if="social.open"
            class="px-4 pb-4 text-gray-600 border-t border-golden-brown/20"
          >
            <a
              :href="social.link"
              target="_blank"
              class="text-golden-brown hover:underline"
              >{{ social.link }}</a
            >
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const goBack = () => router.back();

const tabs = ["FAQ", "Contact Us"];
const activeTab = ref("FAQ");
const searchQuery = ref("");

// --- FAQs ---
const faqs = ref([
  {
    category: "Booking & Pickups",
    items: [
      {
        question: "How do I book a pickup?",
        answer:
          "Book on our website (simple form) or message us on WhatsApp. We confirm your time quickly.",
      },
      {
        question: "What info do you need when I book?",
        answer:
          "Your name, phone, address/nearest landmark, preferred pickup time, service type, and any special care notes.",
      },
      {
        question: "Can I reschedule or cancel?",
        answer:
          "Yes. Send us a WhatsApp message or use the link in your confirmation. We'll adjust your slot.",
      },
      {
        question: "Do you send reminders or updates?",
        answer:
          "Yes—short WhatsApp/SMS updates like 'On the way' or 'Order ready for delivery.'",
      },
      {
        question: "What if I'm not home at pickup time?",
        answer:
          "Tell us early and we'll reschedule. If we arrive and cannot reach you, we'll try again later that day or another day.",
      },
    ],
  },
  {
    category: "Areas We Serve",

    items: [
      {
        question: "Where do you operate?",
        answer:
          "Awka city and nearby areas. Some distant locations may have a small delivery fee (we'll tell you before pickup).",
      },
    ],
  },
  {
    category: "Services & Pricing",

    items: [
      {
        question: "What services do you offer?",
        answer:
          "Wash & Fold, Wash & Iron, Iron Only, plus careful handling for native wear and select delicate items. Pickup and delivery included.",
      },
      {
        question: "Do you handle delicate or native outfits?",
        answer:
          "Yes. We tag, note special instructions, and handle trims/embroidery gently.",
      },
      {
        question: "Do you remove stains?",
        answer:
          "We pretreat and recheck stains. Tough stains may need extra care or more time; we'll discuss options with you.",
      },
      {
        question: "What are your prices?",
        answer:
          "Clear per-item pricing. Extra fees only for add-ons like Express or long-distance delivery (we'll show these before you confirm).",
      },
    ],
  },
  {
    category: "Turnaround & Express",

    items: [
      {
        question: "How fast is standard service?",
        answer: "Standard is usually 48 hours.",
      },
      {
        question: "Do you have Express?",
        answer: "Yes—24 hours for limited slots with an extra fee.",
      },
      {
        question: "What if there's a delay (power, traffic, machine issue)?",
        answer:
          "We tell you early and give options. If we caused the delay, we may offer a small courtesy (e.g., discount) as our apology.",
      },
    ],
  },
  {
    category: "Quality & Care",

    items: [
      {
        question: "How do you make sure my clothes are not mixed up or lost?",
        answer:
          "Every item is tagged and logged at intake. We track stages digitally to prevent mix-ups.",
      },
      {
        question: "Do you have a quality guarantee?",
        answer:
          "Yes—our Care Promise: we stand by our work. If something isn't right, tell us and we'll re-press or re-clean as needed.",
      },
      {
        question: "What happens if an item is lost or damaged?",
        answer:
          "We follow a clear compensation policy (documented) so issues are handled fairly and fast. (Exact limits are set in our shop policy.)",
      },
      {
        question: "What detergents do you use?",
        answer:
          "Premium, fabric-safe detergents. If you're sensitive to fragrance, ask for hypoallergenic—we can save this preference for next time.",
      },
      {
        question: "How do you prevent color bleed or shrinkage?",
        answer:
          "We sort, use correct cycles and temperatures, and check items mid-process. Delicates are handled on gentler cycles or by hand when needed.",
      },
    ],
  },
  {
    category: "Payments & Receipts",

    items: [
      {
        question: "How can I pay?",
        answer:
          "Bank transfer, POS on delivery, or cash. We send a simple receipt by WhatsApp or email.",
      },
      {
        question: "Do you offer online card payments?",
        answer:
          "Yes or coming soon (depends on gateway setup). We'll show it at checkout if available.",
      },
    ],
  },
  {
    category: "Memberships, Bundles & Offers",

    items: [
      {
        question: "Do you have a monthly membership? (DRAFT)",
        answer:
          "Yes/Planned: a small monthly fee for free delivery and priority windows. We'll show full details on the site.",
      },
      {
        question: 'Do you have a "bag" or "bundle" plan? (DRAFT)',
        answer:
          "Yes/Planned: one bag up to a set number of items at a flat fee—great for students and families.",
      },
      {
        question: "Do you have referrals or coupons? (DRAFT)",
        answer:
          "Yes: share your code—both of you get a discount. You can also enter coupon codes at booking.",
      },
    ],
  },
  {
    category: "Communication & Preferences",

    items: [
      {
        question: "Will you remember my preferences?",
        answer:
          'Yes—like "fold shirts, not hang" or "no strong fragrance." We save it to your profile so we repeat it correctly next time.',
      },
      {
        question: "Do you confirm before delivery?",
        answer:
          'Yes. We send a short "Out for delivery" message and an expected time.',
      },
    ],
  },
  {
    category: "Policies & Problems",

    items: [
      {
        question: "What if I'm not happy with the result?",
        answer:
          "Tell us within 24–48 hours of delivery. We'll re-press or re-clean where needed—fast and polite. (This is part of our Care Promise.)",
      },
      {
        question: "Do you charge a cancellation or no-show fee? (DRAFT)",
        answer:
          "Only if our rider has already arrived and waited without contact. We try to be fair—please tell us early if plans change.",
      },
      {
        question: "Do you have a minimum order? (DRAFT)",
        answer:
          "Not for nearby areas. For longer distances, we may set a small minimum or fee to cover transport; we'll tell you before pickup.",
      },
      {
        question: "How long will you keep unclaimed items? (DRAFT)",
        answer:
          "We'll contact you several times. After a set period (for example, 60–90 days), we'll follow our posted policy.",
      },
    ],
  },
  {
    category: "Corporate & Bulk",

    items: [
      {
        question: "Do you serve offices, hotels, or events?",
        answer:
          "Yes. We offer scheduled pickups (e.g., weekly) and reliable turnaround for teams and uniforms. Contact us for a simple quote.",
      },
    ],
  },
  {
    category: "Privacy & Data (NDPR-aware)",

    items: [
      {
        question: "What personal data do you collect and why?",
        answer:
          "Only what we need to serve you: name, contact, address, order details, and your preferences. We use it to deliver, support you, and improve service.",
      },
      {
        question: "How do you protect my data?",
        answer:
          "We keep access limited to staff who need it, use secure tools, and keep simple logs. We don't sell your data.",
      },
      {
        question: "Can I ask you to delete my data?",
        answer:
          "Yes. Message us anytime and we'll delete what we can while keeping what the law requires.",
      },
    ],
  },
  {
    category: "Operations & Reliability",

    items: [
      {
        question: "How do you keep things on time?",
        answer:
          "We plan capacity daily, track every order's due time, and review any late job immediately. Target: ≥95% on-time.",
      },
      {
        question: "How do you handle power or water issues?",
        answer:
          "We use backup power/stabilizers and manage supplies carefully so service keeps moving. If there's a risk of delay, we tell you early",
      },
    ],
  },
]);

// --- Socials ---
const socials = ref([
  {
    name: "Instagram",
    icon: "fab fa-instagram",
    link: "https://instagram.com/chuviapp",
    open: false,
  },
  {
    name: "Facebook",
    icon: "fab fa-facebook",
    link: "https://facebook.com/chuviapp",
    open: false,
  },
  {
    name: "Twitter",
    icon: "fab fa-x-twitter",
    link: "https://twitter.com/chuviapp",
    open: false,
  },
  {
    name: "WhatsApp",
    icon: "fab fa-whatsapp",
    link: "https://wa.me/2348090000000",
    open: false,
  },
]);

// --- Toggles ---
const toggleCategory = (cat) => (cat.open = !cat.open);
const toggleQuestion = (faq) => (faq.open = !faq.open);
const toggleSocial = (s) => (s.open = !s.open);

// --- Search Filtering ---
const filteredFaqs = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return faqs.value;

  return faqs.value
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
      ),
    }))
    .filter((cat) => cat.items.length > 0);
});
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 400px;
}
</style>
