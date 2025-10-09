<template>
  <header
    :class="{ ' shadow-md': scrolled }"
    class="fixed top-0 bg-bone-white left-0 w-full z-50 transition-all duration-500 ease-in-out py-4"
  >
    <div
      class="container mx-auto px-4 md:px-8 flex items-center justify-between relative"
    >
      <button
        @click="toggleMobileNav"
        class="text-charcoal md:hidden absolute left-4 z-10 cursor-pointer"
      >
        <font-awesome-icon
          :icon="isMobileNavOpen ? 'times' : 'bars'"
          class="w-7 h-7 transition-all duration-300 text-2xl"
        />
      </button>

      <router-link to="/" class="mx-auto md:mx-0">
        <img
          src="@/assets/images/logo/chuvi-logo.png"
          alt="Company Logo"
          class="h-10 transition-all duration-500"
          :class="{ 'h-12': scrolled }"
        />
      </router-link>

      <nav class="hidden md:flex space-x-6 items-center text-lg">
        <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="link.href"
          class="text-charcoal hover:text-golden-brown transition-colors duration-300"
        >
          {{ link.name }}
        </router-link>
      </nav>

      <div class="hidden md:flex items-center space-x-4 lg:ml-16">
        <router-link
          :to="authLink.path"
          class="bg-charcoal text-bone-white py-2 px-5 rounded-full font-semibold transition-all duration-300 hover:scale-105"
        >
          {{ authLink.text }}
        </router-link>

        <transition
          enter-active-class="transition-all duration-300 ease-in"
          leave-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-x-4"
          enter-to-class="opacity-100 scale-100 translate-x-0"
          leave-from-class="opacity-100 scale-100 translate-x-0"
          leave-to-class="opacity-0 scale-95 translate-x-4"
        >
          <base-button
            v-if="scrolled"
            :to="bookPickupLink.path"
            :text="bookPickupLink.text"
          />
        </transition>
      </div>
    </div>

    <aside
      :class="[
        'fixed top-0 left-0 h-full w-64 bg-charcoal z-50 transform transition-transform duration-300 md:hidden',
        isMobileNavOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex justify-end p-4">
        <button
          @click="closeMobileNav"
          class="text-bone-white hover:text-golden-brown transition-colors duration-300"
        >
          <font-awesome-icon icon="times" class="w-6 h-6" />
        </button>
      </div>

      <div class="px-6 flex flex-col space-y-4">
        <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="link.href"
          @click="closeMobileNav"
          class="flex items-center space-x-3 text-bone-white py-3 px-4 rounded hover:bg-golden-brown transition-colors duration-300"
        >
          <font-awesome-icon
            :icon="link.icon"
            class="w-5 h-5 text-bone-white"
          />
          <span>{{ link.name }}</span>
        </router-link>

        <hr class="border-gray-600 my-4" />

        <router-link
          :to="authLink.path"
          @click="closeMobileNav"
          class="bg-charcoal text-bone-white py-2 px-4 rounded-full font-semibold text-center hover:text-golden-brown transition-colors duration-300"
        >
          {{ authLink.text }}
        </router-link>

        <base-button
          @click="closeMobileNav"
          border-radius="rounded-md"
          hover-color="pure-gold"
          :to="bookPickupLink.path"
          :text="bookPickupLink.text"
        />
      </div>
    </aside>

    <div
      v-show="isMobileNavOpen"
      @click="closeMobileNav"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
    ></div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import BaseButton from "@/components/atoms/BaseButton.vue";

const scrolled = ref(false);
const isMobileNavOpen = ref(false);
const isUserLoggedIn = computed(() => {
  return !!localStorage.getItem("userToken");
});
const authLink = computed(() => {
  if (isUserLoggedIn.value) {
    return {
      text: "My Account",
      path: { name: "UserProfile" },
    };
  } else {
    return {
      text: "Login",
      path: { name: "Login" },
    };
  }
});
const bookPickupLink = computed(() => {
  if (isUserLoggedIn.value) {
    return {
      text: "Book Pickup",
      path: { name: "BookPickup" },
    };
  } else {
    return {
      text: "Book Pickup",
      path: { name: "Register" },
    };
  }
});
const navLinks = [
  { name: "Home", href: { name: "Home" }, icon: "home" },
  { name: "Services & pricing", href: { name: "Our-services" }, icon: "cogs" },
  { name: "About", href: "/about", icon: "info-circle" },
];
const handleScroll = () => {
  const heroHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  scrolled.value = window.scrollY > heroHeight * 0.9;
};

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
};

const closeMobileNav = () => {
  isMobileNavOpen.value = false;
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

