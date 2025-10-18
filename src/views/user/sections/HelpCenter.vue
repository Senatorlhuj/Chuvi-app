<template>
  <div class="min-h-screen p-4 md:p-8" style="background-color: #F5F1ED;">
    <div class="max-w-5xl mx-auto">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="flex items-center gap-2 font-semibold mb-8 hover:opacity-80 transition-opacity"
        style="color: #D4A574;"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Back</span>
      </button>

      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-3" style="color: #1A3A52;">
          Help Center
        </h1>
        <p class="text-lg" style="color: #6B7280;">
          Find answers, explore topics, or reach out to our team directly.
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex justify-center mb-10 border-b" style="border-color: #E5DDD5;">
        <div class="flex gap-4">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            class="px-6 py-3 font-semibold text-base transition-all duration-200"
            :style="{
              color: activeTab === tab ? '#1A3A52' : '#9CA3AF',
              borderBottom: activeTab === tab ? '3px solid #1A3A52' : 'none',
              marginBottom: '-1px'
            }"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- FAQ Section -->
      <div v-if="activeTab === 'FAQ'" class="space-y-6">
        <!-- Search Bar -->
        <div class="mb-8">
          <div class="relative">
            <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2" style="color: #D4A574;"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search FAQs..."
              class="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm md:text-base"
              style="border-color: #E5DDD5; color: #374151; background-color: #FFFBF7;"
              :style="{ '--tw-ring-color': '#D4A574' }"
            />
          </div>
        </div>

        <!-- FAQs List -->
        <div class="space-y-4">
          <div
            v-for="category in filteredFaqs"
            :key="category.category"
            class="rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            style="background-color: #FFFBF7; border-color: #E5DDD5;"
          >
            <!-- Category Header -->
            <button
              @click="toggleCategory(category)"
              class="flex justify-between items-center w-full p-4 md:p-5 text-left font-semibold transition-colors hover:opacity-80"
              :style="{ color: '#1A3A52', backgroundColor: category.open ? '#F9F7F4' : 'transparent' }"
            >
              <span class="text-base md:text-lg">{{ category.category }}</span>
              <i
                :class="[
                  'fas text-sm transition-transform duration-300',
                  category.open ? 'fa-chevron-up' : 'fa-chevron-down',
                ]"
                style="color: #D4A574;"
              ></i>
            </button>

            <!-- Category Questions -->
            <transition name="accordion">
              <div
                v-if="category.open"
                class="divide-y"
                style="border-color: #E5DDD5; background-color: #FFFBF7;"
              >
                <div
                  v-for="(faq, idx) in category.items"
                  :key="idx"
                  class="p-4 md:p-5"
                >
                  <button
                    @click="toggleQuestion(faq)"
                    class="flex justify-between items-start w-full text-left group"
                  >
                    <span 
                      class="font-medium text-sm md:text-base flex-1 transition-colors group-hover:opacity-80"
                      :style="{ color: faq.open ? '#1A3A52' : '#374151' }"
                    >
                      {{ faq.question }}
                    </span>
                    <i
                      :class="[
                        'fas text-xs transition-transform duration-300 ml-3 mt-0.5 flex-shrink-0',
                        faq.open ? 'fa-chevron-up' : 'fa-chevron-down',
                      ]"
                      :style="{ color: '#D4A574' }"
                    ></i>
                  </button>

                  <transition name="accordion">
                    <div
                      v-if="faq.open"
                      class="mt-3 pt-3 text-sm md:text-base leading-relaxed border-t"
                      style="color: #6B7280; border-color: #E5DDD5;"
                    >
                      {{ faq.answer }}
                    </div>
                  </transition>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- No Results -->
        <div
          v-if="filteredFaqs.length === 0"
          class="text-center py-12 rounded-lg"
          style="background-color: #FFFBF7; border: 2px dashed #E5DDD5;"
        >
          <i class="fas fa-search text-4xl mb-3" style="color: #D4A574;"></i>
          <p class="font-semibold text-lg" style="color: #374151;">
            No results found
          </p>
          <p class="text-sm mt-1" style="color: #9CA3AF;">
            Try adjusting your search terms
          </p>
        </div>
      </div>

      <!-- Contact Us Section -->
      <div v-else class="space-y-8">
        <!-- Contact Info -->
        <div class="rounded-lg p-6 md:p-8" style="background-color: #FFFBF7; border: 1px solid #E5DDD5;">
          <h2 class="text-2xl font-bold mb-6" style="color: #1A3A52;">
            Get in Touch
          </h2>
          <div class="space-y-4">
            <a
              href="tel:+2348090000000"
              class="flex items-center gap-4 p-4 rounded-lg transition-all hover:opacity-80"
              style="background-color: #F9F7F4;"
            >
              <div class="p-3 rounded-lg flex-shrink-0" style="background-color: #E5DDD5;">
                <i class="fas fa-phone-alt text-lg" style="color: #D4A574;"></i>
              </div>
              <div>
                <p class="text-xs font-medium" style="color: #9CA3AF;">Phone</p>
                <p class="text-base md:text-lg font-semibold" style="color: #1A3A52;">
                  +234 809 000 0000
                </p>
              </div>
            </a>

            <div class="flex items-center gap-4 p-4 rounded-lg" style="background-color: #F9F7F4;">
              <div class="p-3 rounded-lg flex-shrink-0" style="background-color: #E5DDD5;">
                <i class="fas fa-map-marker-alt text-lg" style="color: #D4A574;"></i>
              </div>
              <div>
                <p class="text-xs font-medium" style="color: #9CA3AF;">Address</p>
                <p class="text-base md:text-lg font-semibold" style="color: #1A3A52;">
                  123 Chuvi Plaza, Awka, Anambra State, Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div>
          <h2 class="text-2xl font-bold mb-6" style="color: #1A3A52;">
            Follow Us
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.link"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-4 p-4 md:p-5 rounded-lg border transition-all hover:shadow-md"
              style="background-color: #FFFBF7; border-color: #E5DDD5;"
            >
              <div class="p-3 rounded-lg flex-shrink-0" style="background-color: #E5DDD5;">
                <i :class="[social.icon, 'text-lg']" style="color: #D4A574;"></i>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-base" style="color: #1A3A52;">
                  {{ social.name }}
                </p>
                <p class="text-xs mt-1" style="color: #9CA3AF;">
                  Connect with us
                </p>
              </div>
              <i class="fas fa-arrow-right text-sm" style="color: #D4A574;"></i>
            </a>
          </div>
        </div>
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
    open: false,
    items: [
      {
        question: "How do I book a pickup?",
        answer:
          "Book on our website (simple form) or message us on WhatsApp. We confirm your time quickly.",
        open: false,
      },
      {
        question: "What info do you need when I book?",
        answer:
          "Your name, phone, address/nearest landmark, preferred pickup time, service type, and any special care notes.",
        open: false,
      },
      {
        question: "Can I reschedule or cancel?",
        answer:
          "Yes. Send us a WhatsApp message or use the link in your confirmation. We'll adjust your slot.",
        open: false,
      },
      {
        question: "Do you send reminders or updates?",
        answer:
          "Yes—short WhatsApp/SMS updates like 'On the way' or 'Order ready for delivery.'",
        open: false,
      },
      {
        question: "What if I'm not home at pickup time?",
        answer:
          "Tell us early and we'll reschedule. If we arrive and cannot reach you, we'll try again later that day or another day.",
        open: false,
      },
    ],
  },
  {
    category: "Areas We Serve",
    open: false,
    items: [
      {
        question: "Where do you operate?",
        answer:
          "Awka city and nearby areas. Some distant locations may have a small delivery fee (we'll tell you before pickup).",
        open: false,
      },
    ],
  },
  {
    category: "Services & Pricing",
    open: false,
    items: [
      {
        question: "What services do you offer?",
        answer:
          "Wash & Fold, Wash & Iron, Iron Only, plus careful handling for native wear and select delicate items. Pickup and delivery included.",
        open: false,
      },
      {
        question: "Do you handle delicate or native outfits?",
        answer:
          "Yes. We tag, note special instructions, and handle trims/embroidery gently.",
        open: false,
      },
      {
        question: "Do you remove stains?",
        answer:
          "We pretreat and recheck stains. Tough stains may need extra care or more time; we'll discuss options with you.",
        open: false,
      },
      {
        question: "What are your prices?",
        answer:
          "Clear per-item pricing. Extra fees only for add-ons like Express or long-distance delivery (we'll show these before you confirm).",
        open: false,
      },
    ],
  },
  {
    category: "Turnaround & Express",
    open: false,
    items: [
      {
        question: "How fast is standard service?",
        answer: "Standard is usually 48 hours.",
        open: false,
      },
      {
        question: "Do you have Express?",
        answer: "Yes—24 hours for limited slots with an extra fee.",
        open: false,
      },
      {
        question: "What if there's a delay (power, traffic, machine issue)?",
        answer:
          "We tell you early and give options. If we caused the delay, we may offer a small courtesy (e.g., discount) as our apology.",
        open: false,
      },
    ],
  },
  {
    category: "Quality & Care",
    open: false,
    items: [
      {
        question: "How do you make sure my clothes are not mixed up or lost?",
        answer:
          "Every item is tagged and logged at intake. We track stages digitally to prevent mix-ups.",
        open: false,
      },
      {
        question: "Do you have a quality guarantee?",
        answer:
          "Yes—our Care Promise: we stand by our work. If something isn't right, tell us and we'll re-press or re-clean as needed.",
        open: false,
      },
      {
        question: "What happens if an item is lost or damaged?",
        answer:
          "We follow a clear compensation policy (documented) so issues are handled fairly and fast. (Exact limits are set in our shop policy.)",
        open: false,
      },
      {
        question: "What detergents do you use?",
        answer:
          "Premium, fabric-safe detergents. If you're sensitive to fragrance, ask for hypoallergenic—we can save this preference for next time.",
        open: false,
      },
      {
        question: "How do you prevent color bleed or shrinkage?",
        answer:
          "We sort, use correct cycles and temperatures, and check items mid-process. Delicates are handled on gentler cycles or by hand when needed.",
        open: false,
      },
    ],
  },
  {
    category: "Payments & Receipts",
    open: false,
    items: [
      {
        question: "How can I pay?",
        answer:
          "Bank transfer, POS on delivery, or cash. We send a simple receipt by WhatsApp or email.",
        open: false,
      },
      {
        question: "Do you offer online card payments?",
        answer:
          "Yes or coming soon (depends on gateway setup). We'll show it at checkout if available.",
        open: false,
      },
    ],
  },
  {
    category: "Memberships, Bundles & Offers",
    open: false,
    items: [
      {
        question: "Do you have a monthly membership?",
        answer:
          "Yes/Planned: a small monthly fee for free delivery and priority windows. We'll show full details on the site.",
        open: false,
      },
      {
        question: 'Do you have a "bag" or "bundle" plan?',
        answer:
          "Yes/Planned: one bag up to a set number of items at a flat fee—great for students and families.",
        open: false,
      },
      {
        question: "Do you have referrals or coupons?",
        answer:
          "Yes: share your code—both of you get a discount. You can also enter coupon codes at booking.",
        open: false,
      },
    ],
  },
  {
    category: "Communication & Preferences",
    open: false,
    items: [
      {
        question: "Will you remember my preferences?",
        answer:
          'Yes—like "fold shirts, not hang" or "no strong fragrance." We save it to your profile so we repeat it correctly next time.',
        open: false,
      },
      {
        question: "Do you confirm before delivery?",
        answer:
          'Yes. We send a short "Out for delivery" message and an expected time.',
        open: false,
      },
    ],
  },
  {
    category: "Policies & Problems",
    open: false,
    items: [
      {
        question: "What if I'm not happy with the result?",
        answer:
          "Tell us within 24–48 hours of delivery. We'll re-press or re-clean where needed—fast and polite. (This is part of our Care Promise.)",
        open: false,
      },
      {
        question: "Do you charge a cancellation or no-show fee?",
        answer:
          "Only if our rider has already arrived and waited without contact. We try to be fair—please tell us early if plans change.",
        open: false,
      },
      {
        question: "Do you have a minimum order?",
        answer:
          "Not for nearby areas. For longer distances, we may set a small minimum or fee to cover transport; we'll tell you before pickup.",
        open: false,
      },
      {
        question: "How long will you keep unclaimed items?",
        answer:
          "We'll contact you several times. After a set period (for example, 60–90 days), we'll follow our posted policy.",
        open: false,
      },
    ],
  },
  {
    category: "Corporate & Bulk",
    open: false,
    items: [
      {
        question: "Do you serve offices, hotels, or events?",
        answer:
          "Yes. We offer scheduled pickups (e.g., weekly) and reliable turnaround for teams and uniforms. Contact us for a simple quote.",
        open: false,
      },
    ],
  },
  {
    category: "Privacy & Data (NDPR-aware)",
    open: false,
    items: [
      {
        question: "What personal data do you collect and why?",
        answer:
          "Only what we need to serve you: name, contact, address, order details, and your preferences. We use it to deliver, support you, and improve service.",
        open: false,
      },
      {
        question: "How do you protect my data?",
        answer:
          "We keep access limited to staff who need it, use secure tools, and keep simple logs. We don't sell your data.",
        open: false,
      },
      {
        question: "Can I ask you to delete my data?",
        answer:
          "Yes. Message us anytime and we'll delete what we can while keeping what the law requires.",
        open: false,
      },
    ],
  },
  {
    category: "Operations & Reliability",
    open: false,
    items: [
      {
        question: "How do you keep things on time?",
        answer:
          "We plan capacity daily, track every order's due time, and review any late job immediately. Target: ≥95% on-time.",
        open: false,
      },
      {
        question: "How do you handle power or water issues?",
        answer:
          "We use backup power/stabilizers and manage supplies carefully so service keeps moving. If there's a risk of delay, we tell you early",
        open: false,
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
  },
  {
    name: "Facebook",
    icon: "fab fa-facebook",
    link: "https://facebook.com/chuviapp",
  },
  {
    name: "Twitter",
    icon: "fab fa-x-twitter",
    link: "https://twitter.com/chuviapp",
  },
  {
    name: "WhatsApp",
    icon: "fab fa-whatsapp",
    link: "https://wa.me/2348090000000",
  },
]);

// --- Toggles ---
const toggleCategory = (cat) => (cat.open = !cat.open);
const toggleQuestion = (faq) => (faq.open = !faq.open);

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
  transition: all 0.3s ease;
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
  max-height: 500px;
}
</style>