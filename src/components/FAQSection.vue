<template>
  <section class="py-16 md:py-24 bg-bone-white text-charcoal">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
        Frequently Asked Questions
      </h2>
      <div class="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 w-full">
        <div class="md:w-1/4 flex-shrink-0 bg-charcoal rounded-xl p-4 md:p-8 space-y-2 h-[32rem] overflow-y-auto custom-scrollbar">
          <button
            v-for="(group, index) in faqs"
            :key="index"
            @click="activeCategory = index"
            class="w-full text-left py-3 px-4 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
            :class="{
              'bg-bone-white text-charcoal': activeCategory === index,
              'bg-transparent text-bone-white/80 hover:bg-bone-white/10': activeCategory !== index,
            }"
          >
            {{ group.category }}
          </button>
        </div>

        <div class="md:w-3/4">
          <transition name="fade" mode="out-in">
            <div v-if="faqs[activeCategory]" :key="activeCategory">
              <h3 class="text-2xl font-bold text-golden-brown mb-6">
                {{ faqs[activeCategory].category }}
              </h3>
              <div
                v-for="(faq, faqIndex) in faqs[activeCategory].items"
                :key="faqIndex"
                class="mb-4 last:mb-0"
              >
                <button
                  @click="toggleFaq(faqIndex)"
                  class="w-full flex justify-between items-center text-left py-4 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
                  :class="{
                    'bg-charcoal text-bone-white rounded-b-none': activeItem === faqIndex,
                    'bg-charcoal text-bone-white/80 hover:bg-charcoal/80': activeItem !== faqIndex,
                  }"
                >
                  <span class="font-semibold text-lg">{{ faq.question }}</span>
                  <font-awesome-icon
                    :icon="activeItem === faqIndex ? 'fa-solid fa-xmark' : 'fa-solid fa-plus'"
                    class="transform transition-transform duration-200 text-xl"
                  />
                </button>
                <transition
                  @before-enter="beforeEnter"
                  @enter="enter"
                  @before-leave="beforeLeave"
                  @leave="leave"
                >
                  <div
                    v-if="activeItem === faqIndex"
                    class="px-6 py-4 bg-charcoal rounded-b-lg text-bone-white/80 overflow-hidden"
                  >
                    <p>{{ faq.answer }}</p>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus, faXmark);

const activeCategory = ref(0);
const activeItem = ref(null);

const toggleFaq = (index) => {
  if (activeItem.value === index) {
    activeItem.value = null;
  } else {
    activeItem.value = index;
  }
};

const beforeEnter = (el) => {
  el.style.height = '0';
  el.style.opacity = '0';
};

const enter = (el, done) => {
  el.style.height = `${el.scrollHeight}px`;
  el.style.opacity = '1';
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
  done();
};

const beforeLeave = (el) => {
  el.style.height = `${el.scrollHeight}px`;
  el.style.opacity = '1';
};

const leave = (el, done) => {
  el.style.height = '0';
  el.style.opacity = '0';
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
  done();
};

const faqs = ref([
  {
    category: 'Booking & Pickups',
    items: [
      {
        question: 'How do I book a pickup?',
        answer: 'Book on our website (simple form) or message us on WhatsApp. We confirm your time quickly.',
      },
      {
        question: 'What info do you need when I book?',
        answer: 'Your name, phone, address/nearest landmark, preferred pickup time, service type, and any special care notes. (We keep it simple and fast.)',
      },
      {
        question: 'Can I reschedule or cancel?',
        answer: 'Yes. Send us a WhatsApp message or use the link in your confirmation. We’ll adjust your slot.',
      },
      {
        question: 'Do you send reminders or updates?',
        answer: 'Yes—short WhatsApp/SMS updates like “On the way” or “Order ready for delivery.”',
      },
      {
        question: 'What if I’m not home at pickup time?',
        answer: 'Tell us early and we’ll reschedule. If we arrive and cannot reach you, we’ll try again later that day or another day.',
      },
    ],
  },
  {
    category: 'Areas We Serve',
    items: [
      {
        question: 'Where do you operate?',
        answer: 'Awka city and nearby areas. Some distant locations may have a small delivery fee (we’ll tell you before pickup).',
      },
    ],
  },
  {
    category: 'Services & Pricing',
    items: [
      {
        question: 'What services do you offer?',
        answer: 'Wash & Fold, Wash & Iron, Iron Only, plus careful handling for native wear and select delicate items. Pickup and delivery included.',
      },
      {
        question: 'Do you handle delicate or native outfits?',
        answer: 'Yes. We tag, note special instructions, and handle trims/embroidery gently.',
      },
      {
        question: 'Do you remove stains?',
        answer: 'We pretreat and recheck stains. Tough stains may need extra care or more time; we’ll discuss options with you.',
      },
      {
        question: 'What are your prices?',
        answer: 'Clear per-item pricing. Extra fees only for add-ons like Express or long-distance delivery (we’ll show these before you confirm).',
      },
    ],
  },
  {
    category: 'Turnaround & Express',
    items: [
      {
        question: 'How fast is standard service?',
        answer: 'Standard is usually 48 hours.',
      },
      {
        question: 'Do you have Express?',
        answer: 'Yes—24 hours for limited slots with an extra fee.',
      },
      {
        question: 'What if there’s a delay (power, traffic, machine issue)?',
        answer: 'We tell you early and give options. If we caused the delay, we may offer a small courtesy (e.g., discount) as our apology.',
      },
    ],
  },
  {
    category: 'Quality & Care',
    items: [
      {
        question: 'How do you make sure my clothes are not mixed up or lost?',
        answer: 'Every item is tagged and logged at intake. We track stages digitally to prevent mix-ups.',
      },
      {
        question: 'Do you have a quality guarantee?',
        answer: 'Yes—our Care Promise: we stand by our work. If something isn’t right, tell us and we’ll re-press or re-clean as needed.',
      },
      {
        question: 'What happens if an item is lost or damaged?',
        answer: 'We follow a clear compensation policy (documented) so issues are handled fairly and fast. (Exact limits are set in our shop policy.)',
      },
      {
        question: 'What detergents do you use?',
        answer: 'Premium, fabric-safe detergents. If you’re sensitive to fragrance, ask for hypoallergenic—we can save this preference for next time.',
      },
      {
        question: 'How do you prevent color bleed or shrinkage?',
        answer: 'We sort, use correct cycles and temperatures, and check items mid-process. Delicates are handled on gentler cycles or by hand when needed.',
      },
    ],
  },
  {
    category: 'Payments & Receipts',
    items: [
      {
        question: 'How can I pay?',
        answer: 'Bank transfer, POS on delivery, or cash. We send a simple receipt by WhatsApp or email.',
      },
      {
        question: 'Do you offer online card payments?',
        answer: 'Yes or coming soon (depends on gateway setup). We’ll show it at checkout if available.',
      },
    ],
  },
  {
    category: 'Memberships, Bundles & Offers',
    items: [
      {
        question: 'Do you have a monthly membership? (DRAFT)',
        answer: 'Yes/Planned: a small monthly fee for free delivery and priority windows. We’ll show full details on the site.',
      },
      {
        question: 'Do you have a “bag” or “bundle” plan? (DRAFT)',
        answer: 'Yes/Planned: one bag up to a set number of items at a flat fee—great for students and families.',
      },
      {
        question: 'Do you have referrals or coupons? (DRAFT)',
        answer: 'Yes: share your code—both of you get a discount. You can also enter coupon codes at booking.',
      },
    ],
  },
  {
    category: 'Communication & Preferences',
    items: [
      {
        question: 'Will you remember my preferences?',
        answer: 'Yes—like “fold shirts, not hang” or “no strong fragrance.” We save it to your profile so we repeat it correctly next time.',
      },
      {
        question: 'Do you confirm before delivery?',
        answer: 'Yes. We send a short “Out for delivery” message and an expected time.',
      },
    ],
  },
  {
    category: 'Policies & Problems',
    items: [
      {
        question: 'What if I’m not happy with the result?',
        answer: 'Tell us within 24–48 hours of delivery. We’ll re-press or re-clean where needed—fast and polite. (This is part of our Care Promise.)',
      },
      {
        question: 'Do you charge a cancellation or no-show fee? (DRAFT)',
        answer: 'Only if our rider has already arrived and waited without contact. We try to be fair—please tell us early if plans change.',
      },
      {
        question: 'Do you have a minimum order? (DRAFT)',
        answer: 'Not for nearby areas. For longer distances, we may set a small minimum or fee to cover transport; we’ll tell you before pickup.',
      },
      {
        question: 'How long will you keep unclaimed items? (DRAFT)',
        answer: 'We’ll contact you several times. After a set period (for example, 60–90 days), we’ll follow our posted policy.',
      },
    ],
  },
  {
    category: 'Corporate & Bulk',
    items: [
      {
        question: 'Do you serve offices, hotels, or events?',
        answer: 'Yes. We offer scheduled pickups (e.g., weekly) and reliable turnaround for teams and uniforms. Contact us for a simple quote.',
      },
    ],
  },
  {
    category: 'Privacy & Data (NDPR-aware)',
    items: [
      {
        question: 'What personal data do you collect and why?',
        answer: 'Only what we need to serve you: name, contact, address, order details, and your preferences. We use it to deliver, support you, and improve service.',
      },
      {
        question: 'How do you protect my data?',
        answer: 'We keep access limited to staff who need it, use secure tools, and keep simple logs. We don’t sell your data.',
      },
      {
        question: 'Can I ask you to delete my data?',
        answer: 'Yes. Message us anytime and we’ll delete what we can while keeping what the law requires.',
      },
    ],
  },
  {
    category: 'Operations & Reliability',
    items: [
      {
        question: 'How do you keep things on time?',
        answer: 'We plan capacity daily, track every order’s due time, and review any late job immediately. Target: ≥95% on-time.',
      },
      {
        question: 'How do you handle power or water issues?',
        answer: 'We use backup power/stabilizers and manage supplies carefully so service keeps moving. If there’s a risk of delay, we tell you early',
      },
    ],
  },
]);
</script>

<style scoped>

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-golden-brown);
  border-radius: 4px;
}

/* Tab Transition Styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>