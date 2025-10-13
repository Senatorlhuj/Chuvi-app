<template>
  <header
    :class="[
      'fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out py-4',
      scrolled && !isMobileNavOpen
        ? 'shadow-xl backdrop-blur-sm bg-charcoal/95 py-3'
        : 'bg-charcoal',
    ]"
  >
    <div
      class="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-between relative max-w-[1400px]"
    >
      <router-link to="/" class="flex-shrink-0 z-10">
        <img
          src="@/assets/images/logo/chuvi-logo.png"
          alt="Company Logo"
          class="transition-all duration-300 ease-in-out"
          :class="[
            scrolled ? 'h-8 md:h-10' : 'h-10 md:h-12',
            'filter brightness-0 invert',
          ]"
        />
      </router-link>

      <nav
        class="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2"
      >
        <div class="flex space-x-6 xl:space-x-8 2xl:space-x-10">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="link.href"
            class="relative text-bone-white hover:text-pure-gold transition-colors duration-300 group font-light tracking-wide whitespace-nowrap text-base xl:text-lg"
            :class="{
              'text-pure-gold font-semibold':
                link.href.hash === activeSection ||
                (link.href.name === 'Contact' &&
                  activeSection === 'contact-route') ||
                (link.href.name === 'Our-services' &&
                  activeSection === 'services-route'),
            }"
            @click="handleNavClick(link.href)"
          >
            {{ link.name }}
            <span
              class="absolute bottom-[-4px] left-0 w-full h-[2px] bg-pure-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              :class="{
                'scale-x-100 !bg-pure-gold':
                  link.href.hash === activeSection ||
                  (link.href.name === 'Contact' &&
                    activeSection === 'contact-route') ||
                  (link.href.name === 'Our-services' &&
                    activeSection === 'services-route'),
              }"
            ></span>
          </router-link>
        </div>
      </nav>

      <div class="hidden lg:flex items-center space-x-4 xl:space-x-6 z-10">
        <router-link
          :to="authLink.path"
          class="text-pure-gold hover:text-pure-gold transition-colors duration-300 text-base font-bold whitespace-nowrap"
        >
          {{ authLink.text }}
        </router-link>

        <base-button
          :to="bookPickupLink.path"
          :text="bookPickupLink.text"
          class="bg-pure-gold text-navy-blue py-2.5 px-5 xl:px-6 rounded-md font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-sm xl:text-base whitespace-nowrap"
        />
      </div>

      <button
        @click="toggleMobileNav"
        class="text-bone-white lg:hidden cursor-pointer p-2 -mr-2 z-10"
        aria-label="Toggle mobile menu"
      >
        <font-awesome-icon
          :icon="isMobileNavOpen ? 'times' : 'bars'"
          class="w-6 h-6 transition-transform duration-300 text-2xl"
        />
      </button>
    </div>

    <aside
      :class="[
        'fixed top-0 right-0 h-full w-64 bg-charcoal z-[60] transform transition-transform duration-300 lg:hidden',
        isMobileNavOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full',
      ]"
    >
      <div class="flex justify-end p-4">
        <button
          @click="closeMobileNav"
          class="text-bone-white hover:text-pure-gold transition-colors duration-300"
          aria-label="Close mobile menu"
        >
          <font-awesome-icon icon="times" class="w-6 h-6" />
        </button>
      </div>

      <div class="px-6 flex flex-col space-y-2 pt-4">
        <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="link.href"
          @click="handleNavClick(link.href)"
          class="flex items-center space-x-3 text-bone-white py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-charcoal/50"
          :class="{
            'bg-pure-gold text-charcoal font-semibold':
              link.href.hash === activeSection ||
              (link.href.name === 'Contact' &&
                activeSection === 'contact-route') ||
              (link.href.name === 'Our-services' &&
                activeSection === 'services-route'),
          }"
        >
          <font-awesome-icon :icon="link.icon" class="w-5 h-5" />
          <span>{{ link.name }}</span>
        </router-link>

        <hr class="border-charcoal/50 mt-4 mb-6" />

        <router-link
          :to="authLink.path"
          @click="closeMobileNav"
          class="text-center py-2 text-pure-gold hover:text-bone-white transition-colors duration-300 font-bold"
        >
          {{ authLink.text }}
        </router-link>

        <base-button
          @click="closeMobileNav"
          class="w-full bg-pure-gold text-navy-blue py-2 px-4 rounded-md font-semibold shadow-lg hover:opacity-90 transition-opacity"
          :to="bookPickupLink.path"
          :text="bookPickupLink.text"
        />
      </div>
    </aside>

    <div
      v-show="isMobileNavOpen"
      @click="closeMobileNav"
      class="fixed inset-0 bg-black/70 z-40 lg:hidden"
    ></div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseButton from "@/components/atoms/BaseButton.vue";

const router = useRouter();
const route = useRoute();

const scrolled = ref(false);
const isMobileNavOpen = ref(false);
const activeSection = ref(""); // Tracks current visible section or route

const scrollSections = ["#hero", "#about", "#how-it-works", "#testimonials"];

const isUserLoggedIn = computed(() => !!localStorage.getItem("userToken"));

const authLink = computed(() =>
  isUserLoggedIn.value
    ? { text: "My Account", path: { name: "UserProfile" } }
    : { text: "Login", path: { name: "Login" } }
);

const bookPickupLink = computed(() =>
  isUserLoggedIn.value
    ? { text: "Book Pickup", path: { name: "BookPickup" } }
    : { text: "Book Pickup", path: { name: "Register" } }
);

// ✅ Navigation links (some are sections, others are routes)
const navLinks = [
  { name: "Home", href: { path: "/", hash: "#hero" }, icon: "home" },
  { name: "About", href: { path: "/", hash: "#about" }, icon: "info-circle" },
  {
    name: "How It Works",
    href: { path: "/", hash: "#how-it-works" },
    icon: "list-ol",
  },
  {
    name: "Testimonials",
    href: { path: "/", hash: "#testimonials" },
    icon: "star",
  },
  { name: "Contact", href: { name: "Contact" }, icon: "envelope" },
  { name: "Services", href: { name: "Our-services" }, icon: "cogs" },
];

const handleScroll = () => {
  scrolled.value = window.scrollY > 100;
};

// ✅ Smooth scroll for homepage sections
const handleNavClick = async (href) => {
  closeMobileNav();
  if (href.path === "/" && href.hash) {
    await router.push({ path: "/", hash: href.hash });
    setTimeout(() => {
      const el = document.querySelector(href.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } else {
    router.push(href);
  }
};

const toggleMobileNav = () => (isMobileNavOpen.value = !isMobileNavOpen.value);
const closeMobileNav = () => (isMobileNavOpen.value = false);

// ✅ Watch route changes to handle Contact and Services pages
watch(
  () => route.name,
  (newRoute) => {
    if (newRoute === "Contact") {
      activeSection.value = "contact-route";
    } else if (newRoute === "Our-services") {
      activeSection.value = "services-route";
    } else {
      activeSection.value = "";
    }
  },
  { immediate: true }
);

// ✅ Observe homepage sections to update activeSection
onMounted(() => {
  window.addEventListener("scroll", handleScroll);

  const sections = document.querySelectorAll(scrollSections.join(", "));
  const observer = new IntersectionObserver(
    (entries) => {
      let visible = entries.find((entry) => entry.isIntersecting);
      if (visible && route.path === "/") {
        activeSection.value = `#${visible.target.id}`;
      } else if (!visible && route.path === "/") {
        // If user scrolls beyond all tracked sections, clear highlight
        const scrollY = window.scrollY + window.innerHeight / 2;
        const lastSection = sections[sections.length - 1];
        const lastBottom = lastSection.offsetTop + lastSection.offsetHeight;
        if (scrollY > lastBottom) activeSection.value = "";
      }
    },
    { threshold: 0.15 }
  );

  sections.forEach((section) => observer.observe(section));

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
    observer.disconnect();
  });
});
</script>
