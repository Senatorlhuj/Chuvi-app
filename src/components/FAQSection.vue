<template>
  <section
    id="faq"
    ref="sectionRef"
    class="py-12 sm:py-16 md:py-20 lg:py-24 bg-bone-white opacity-0 translate-y-10 transition-all duration-700 ease-out"
    aria-labelledby="faq-heading"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Header -->
      <header class="text-center mb-8 sm:mb-12 lg:mb-16" id="faq-heading">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-3">
          Frequently Asked Questions
        </h2>
        <p class="text-base sm:text-lg text-charcoal/80 max-w-2xl mx-auto px-4">
          Everything you need to know about our laundry services
        </p>
      </header>

      <!-- Search -->
      <div class="max-w-2xl mx-auto mb-8 sm:mb-12">
        <form
          @submit.prevent="handleSearch"
          role="search"
          aria-label="Search FAQs"
          class="relative"
        >
          <label for="faq-search" class="sr-only">Search FAQs</label>
          <input
            id="faq-search"
            name="faq-search"
            type="text"
            v-model="searchQuery"
            @keydown.enter.prevent="handleSearch"
            placeholder="Search questions..."
            class="w-full py-3 pl-4 pr-12 rounded-xl sm:rounded-2xl border-2 border-golden-brown/30 text-charcoal text-sm sm:text-base focus:border-golden-brown focus:ring-2 focus:ring-golden-brown/25 focus:outline-none  transition-all duration-200"
            autocomplete="off"
            aria-label="Search frequently asked questions"
          />

          <!-- Search Button -->
          <button
            type="submit"
            aria-label="Search"
            title="Search"
            class="absolute right-2 top-1/2 -translate-y-1/2  text-golden-brown text-xl font-bold p-2.5 rounded-full hover:opacity-95 cursor-pointer"
          >
            <font-awesome-icon :icon="['fas','search']" />
          </button>

          <!-- Clear Button -->
          <button
            v-if="searchQuery"
            @click.prevent="clearSearch"
            aria-label="Clear search"
            title="Clear search"
            class="absolute right-12 top-1/2 -translate-y-1/2 text-charcoal/60  focus:outline-none cursor-pointer"
          >
            <font-awesome-icon :icon="['fas','xmark']" />
          </button>
        </form>
      </div>

      <!-- Category Tabs -->
      <div class="mb-8 sm:mb-10 lg:mb-12">
        <div
          class="flex overflow-x-auto pb-4 gap-3 sm:gap-4 no-scrollbar md:flex-wrap md:justify-center scroll-smooth snap-x snap-mandatory"
        >
          <button
            v-for="(group, index) in displayFaqs"
            :key="group.category + index"
            @click="selectCategory(index)"
            :aria-pressed="String(activeCategory === index)"
            :class="[
              'flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 text-sm sm:text-base snap-start cursor-pointer',
              activeCategory === index
                ? 'bg-golden-brown text-bone-white  scale-105'
                : 'bg-white text-charcoal border border-charcoal/10 hover:bg-golden-brown/5'
            ]"
          >
            <span>{{ group.category }}</span>
            <span
              v-if="group.items?.length"
              class="ml-2 text-xs bg-charcoal/5 text-pure-gold font-bold rounded-full px-2 py-0.5"
            >
              {{ group.items.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- FAQ content -->
      <div class="max-w-4xl mx-auto">
        <!-- No results -->
        <div
          v-if="displayFaqs.length === 0 || (displayFaqs[activeCategory]?.items?.length === 0)"
          class="text-center py-12 sm:py-16"
        >
          <div class="text-5xl sm:text-6xl mb-4 text-charcoal/30"></div>
          <p class="text-lg sm:text-xl text-charcoal/70">
            No questions found matching your search
          </p>
          <p v-if="searchQuery" class="text-sm text-charcoal/60 mt-2">
            Try different keywords like "pickup", "price", or "delivery".
          </p>
        </div>

        <!-- FAQ List -->
        <div v-else class="space-y-3 sm:space-y-4">
          <div
            v-for="(faq, faqIndex) in displayFaqs[activeCategory]?.items"
            :key="`${activeCategory}-${faqIndex}-${faq.question}`"
            class="bg-white rounded-xl sm:rounded-2xl  border border-charcoal/6 overflow-hidden"
          >
            <button
              @click="toggleFaq(faqIndex)"
              :aria-expanded="activeItem === faqIndex ? 'true' : 'false'"
              class="w-full flex justify-between items-start gap-4 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5 focus:outline-none cursor-pointer"
            >
              <div class="flex items-start gap-3 flex-1 min-w-0">
                <div
                  :class="[
                    'flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200',
                    activeItem === faqIndex ? 'bg-golden-brown text-bone-white' : 'bg-charcoal/5 text-charcoal/70'
                  ]"
                  aria-hidden="true"
                >
                  <font-awesome-icon :icon="activeItem === faqIndex ? ['fas','minus'] : ['fas','plus']" />
                </div>
                <span class="font-semibold text-charcoal text-base sm:text-lg break-words">
                  {{ faq.question }}
                </span>
              </div>
            </button>

            <transition
              @before-enter="beforeEnter"
              @enter="enter"
              @before-leave="beforeLeave"
              @leave="leave"
            >
              <div
                v-if="activeItem === faqIndex"
                class="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 pt-0 bg-bone-white/50"
              >
                <div
                  class="border-l-4 border-golden-brown/30 p-4 sm:p-5 rounded-lg sm:pl-6"
                >
                  <p
                    class="text-charcoal/80 text-sm sm:text-base leading-relaxed whitespace-pre-wrap"
                  >
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div
        class="mt-12 sm:mt-16 text-center bg-golden-brown rounded-2xl p-6 sm:p-8 lg:p-10  text-bone-white"
      >
        <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
          Still have questions?
        </h3>
        <p
          class="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg"
        >
          We're here to help! Reach out to us anytime.
        </p>
        <button
          class="bg-bone-white text-golden-brown px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:opacity-95 transition-all cursor-pointer"
          @click="$router.push({ name: 'Contact' }).catch(() => {})"
        >
          Contact Support
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch, faPlus, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
library.add(faSearch, faPlus, faMinus, faXmark);

const sectionRef = ref(null);
const searchQuery = ref("");
const activeCategory = ref(0);
const activeItem = ref(null);

// Animate section when in view
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sectionRef.value.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  if (sectionRef.value) observer.observe(sectionRef.value);
});

// --- Full FAQ dataset (same content) ---
const faqs = ref([
  {
    category: 'Booking & Pickups',
 
    items: [
      { question: 'How do I book a pickup?', answer: 'Book on our website (simple form) or message us on WhatsApp. We confirm your time quickly.' },
      { question: 'What info do you need when I book?', answer: 'Your name, phone, address/nearest landmark, preferred pickup time, service type, and any special care notes. (We keep it simple and fast.)' },
      { question: 'Can I reschedule or cancel?', answer: "Yes. Send us a WhatsApp message or use the link in your confirmation. We'll adjust your slot." },
      { question: 'Do you send reminders or updates?', answer: 'Yes—short WhatsApp/SMS updates like "On the way" or "Order ready for delivery."' },
      { question: "What if I'm not home at pickup time?", answer: "Tell us early and we'll reschedule. If we arrive and cannot reach you, we'll try again later that day or another day." },
    ],
  },
  {
    category: 'Areas We Serve',
 
    items: [
      { question: 'Where do you operate?', answer: "Awka city and nearby areas. Some distant locations may have a small delivery fee (we'll tell you before pickup)." },
    ],
  },
  {
    category: 'Services & Pricing',
 
    items: [
      { question: 'What services do you offer?', answer: 'Wash & Fold, Wash & Iron, Iron Only, plus careful handling for native wear and select delicate items. Pickup and delivery included.' },
      { question: 'Do you handle delicate or native outfits?', answer: 'Yes. We tag, note special instructions, and handle trims/embroidery gently.' },
      { question: 'Do you remove stains?', answer: "We pretreat and recheck stains. Tough stains may need extra care or more time; we'll discuss options with you." },
      { question: 'What are your prices?', answer: "Clear per-item pricing. Extra fees only for add-ons like Express or long-distance delivery (we'll show these before you confirm)." },
    ],
  },
  {
    category: 'Turnaround & Express',
   
    items: [
      { question: 'How fast is standard service?', answer: 'Standard is usually 48 hours.' },
      { question: 'Do you have Express?', answer: 'Yes—24 hours for limited slots with an extra fee.' },
      { question: "What if there's a delay (power, traffic, machine issue)?", answer: 'We tell you early and give options. If we caused the delay, we may offer a small courtesy (e.g., discount) as our apology.' },
    ],
  },
  {
    category: 'Quality & Care',
   
    items: [
      { question: 'How do you make sure my clothes are not mixed up or lost?', answer: 'Every item is tagged and logged at intake. We track stages digitally to prevent mix-ups.' },
      { question: 'Do you have a quality guarantee?', answer: "Yes—our Care Promise: we stand by our work. If something isn't right, tell us and we'll re-press or re-clean as needed." },
      { question: 'What happens if an item is lost or damaged?', answer: 'We follow a clear compensation policy (documented) so issues are handled fairly and fast. (Exact limits are set in our shop policy.)' },
      { question: 'What detergents do you use?', answer: "Premium, fabric-safe detergents. If you're sensitive to fragrance, ask for hypoallergenic—we can save this preference for next time." },
      { question: 'How do you prevent color bleed or shrinkage?', answer: 'We sort, use correct cycles and temperatures, and check items mid-process. Delicates are handled on gentler cycles or by hand when needed.' },
    ],
  },
  {
    category: 'Payments & Receipts',
  
    items: [
      { question: 'How can I pay?', answer: 'Bank transfer, POS on delivery, or cash. We send a simple receipt by WhatsApp or email.' },
      { question: 'Do you offer online card payments?', answer: "Yes or coming soon (depends on gateway setup). We'll show it at checkout if available." },
    ],
  },
  {
    category: 'Memberships, Bundles & Offers',

    items: [
      { question: 'Do you have a monthly membership? (DRAFT)', answer: "Yes/Planned: a small monthly fee for free delivery and priority windows. We'll show full details on the site." },
      { question: 'Do you have a \"bag\" or \"bundle\" plan? (DRAFT)', answer: 'Yes/Planned: one bag up to a set number of items at a flat fee—great for students and families.' },
      { question: 'Do you have referrals or coupons? (DRAFT)', answer: 'Yes: share your code—both of you get a discount. You can also enter coupon codes at booking.' },
    ],
  },
  {
    category: 'Communication & Preferences',

    items: [
      { question: 'Will you remember my preferences?', answer: 'Yes—like "fold shirts, not hang" or "no strong fragrance." We save it to your profile so we repeat it correctly next time.' },
      { question: 'Do you confirm before delivery?', answer: 'Yes. We send a short "Out for delivery" message and an expected time.' },
    ],
  },
  {
    category: 'Policies & Problems',

    items: [
      { question: "What if I'm not happy with the result?", answer: "Tell us within 24–48 hours of delivery. We'll re-press or re-clean where needed—fast and polite. (This is part of our Care Promise.)" },
      { question: 'Do you charge a cancellation or no-show fee? (DRAFT)', answer: 'Only if our rider has already arrived and waited without contact. We try to be fair—please tell us early if plans change.' },
      { question: 'Do you have a minimum order? (DRAFT)', answer: "Not for nearby areas. For longer distances, we may set a small minimum or fee to cover transport; we'll tell you before pickup." },
      { question: 'How long will you keep unclaimed items? (DRAFT)', answer: "We'll contact you several times. After a set period (for example, 60–90 days), we'll follow our posted policy." },
    ],
  },
  {
    category: 'Corporate & Bulk',
  
    items: [
      { question: 'Do you serve offices, hotels, or events?', answer: 'Yes. We offer scheduled pickups (e.g., weekly) and reliable turnaround for teams and uniforms. Contact us for a simple quote.' },
    ],
  },
  {
    category: 'Privacy & Data (NDPR-aware)',
   
    items: [
      { question: 'What personal data do you collect and why?', answer: 'Only what we need to serve you: name, contact, address, order details, and your preferences. We use it to deliver, support you, and improve service.' },
      { question: 'How do you protect my data?', answer: "We keep access limited to staff who need it, use secure tools, and keep simple logs. We don't sell your data." },
      { question: 'Can I ask you to delete my data?', answer: "Yes. Message us anytime and we'll delete what we can while keeping what the law requires." },
    ],
  },
  {
    category: 'Operations & Reliability',
  
    items: [
      { question: 'How do you keep things on time?', answer: "We plan capacity daily, track every order's due time, and review any late job immediately. Target: ≥95% on-time." },
      { question: 'How do you handle power or water issues?', answer: "We use backup power/stabilizers and manage supplies carefully so service keeps moving. If there's a risk of delay, we tell you early" },
    ],
  },
]);

// Search across all categories
const filteredFaqs = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return faqs.value;
  return faqs.value
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (it) =>
          it.question.toLowerCase().includes(q) ||
          it.answer.toLowerCase().includes(q)
      ),
    }))
    .filter((category) => category.items.length);
});

const displayFaqs = computed(() => (searchQuery.value ? filteredFaqs.value : faqs.value));

watch(displayFaqs, (next) => {
  if (!next.length) {
    activeCategory.value = 0;
    activeItem.value = null;
  } else if (activeCategory.value >= next.length) {
    activeCategory.value = 0;
    activeItem.value = null;
  }
});

const toggleFaq = (index) => {
  activeItem.value = activeItem.value === index ? null : index;
};
const selectCategory = (index) => {
  activeCategory.value = index;
  activeItem.value = null;
};
const handleSearch = () => {
  if (displayFaqs.value.length > 0) {
    activeCategory.value = 0;
    activeItem.value = null;
  }
};
const clearSearch = () => {
  searchQuery.value = "";
  activeCategory.value = 0;
  activeItem.value = null;
};

// Expand/collapse transitions
const beforeEnter = (el) => {
  el.style.height = "0px";
  el.style.opacity = "0";
};
const enter = (el) => {
  el.style.height = el.scrollHeight + "px";
  el.style.opacity = "1";
  el.style.transition = "height 320ms ease, opacity 240ms ease";
};
const beforeLeave = (el) => {
  el.style.height = el.scrollHeight + "px";
  el.style.opacity = "1";
};
const leave = (el) => {
  el.style.height = "0px";
  el.style.opacity = "0";
  el.style.transition = "height 320ms ease, opacity 240ms ease";
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Smooth fade-up reveal */
.opacity-0.translate-y-10 {
  opacity: 0;
  transform: translateY(2rem);
}
.opacity-100.translate-y-0 {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Ensure left padding for answers on mobile */
@media (max-width: 640px) {
  .border-l-4 {
    padding-left: 1rem !important;
  }
}
</style>
