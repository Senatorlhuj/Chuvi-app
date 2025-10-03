<template>
  <aside
    class="w-64 bg-navy-blue p-6 shadow-2xl flex flex-col flex-shrink-0 min-h-full"
  >
    <!-- Logo/Branding for Desktop -->
    <div
      class="hidden md:block pb-6 mb-6 border-b border-golden-brown/50 flex items-center justify-center"
    >
      <router-link :to="{ name: 'Home' }">
        <img src="@/assets/images/logo/chuvi-logo.png" alt="brand Logo" class="h-10 w-auto" />
      </router-link>
    </div>

    <!-- Navigation Links -->
    <nav class="space-y-1 flex-grow">
      <h3
        class="text-cream text-sm uppercase font-semibold mb-3 tracking-wider"
      >
        Account
      </h3>

      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.routeName }"
        @click="$emit('closeSidebar')"
        class="group flex items-center p-3 rounded-xl transition-all duration-200 ease-in-out"
        :class="[
          isActive(item.routeName)
            ? 'bg-golden-brown text-navy-blue font-semibold shadow-lg transform translate-x-1'
            : 'text-bone-white hover:bg-golden-brown/20 hover:text-golden-brown',
        ]"
      >
        <font-awesome-icon
          :icon="item.icon"
          class="w-5 h-5 mr-3 transition-colors duration-200"
          :class="
            isActive(item.routeName)
              ? 'text-navy-blue'
              : 'text-golden-brown group-hover:text-golden-brown'
          "
        />
        <span class="text-base">{{ item.name }}</span>
      </router-link>

      <div class="pt-6 mt-6 border-t border-golden-brown/50">
        <h3
          class="text-cream text-sm uppercase font-semibold mb-3 tracking-wider"
        >
          Services
        </h3>

        <!-- Book Pickup Action -->
        <router-link
          :to="{ name: 'BookPickup' }"
          @click="$emit('closeSidebar')"
          class="flex items-center p-3 rounded-xl transition-all duration-200 ease-in-out"
          :class="[
            $route.name === 'BookPickup'
              ? 'bg-pure-gold text-navy-blue font-semibold shadow-lg transform translate-x-1'
              : 'text-bone-white hover:bg-pure-gold/20 hover:text-pure-gold',
          ]"
        >
          <font-awesome-icon
            icon="calendar-plus"
            class="w-5 h-5 mr-3 text-pure-gold"
            :class="{ '!text-navy-blue': $route.name === 'BookPickup' }"
          />
          <span class="text-base">Book New Pickup</span>
        </router-link>
      </div>
    </nav>

    <!-- Logout Button (Fixed at Bottom) -->
    <div class="pt-8 mt-auto border-t border-golden-brown/50">
      <button
        @click="handleLogout"
        class="w-full flex items-center justify-center p-3 rounded-xl text-cream bg-charcoal/50 hover:bg-red-700/80 hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        <font-awesome-icon
          icon="sign-out-alt"
          class="w-5 h-5 mr-3 text-red-400"
        />
        Log Out
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useToast } from "@/composables/useToast";
import { defineEmits } from "vue"; // FontAwesome is already registered globally in main.js

// router + route instances
const router = useRouter();
const route = useRoute();

// toast composable
const { showSuccess } = useToast();

// navigation items
const navItems = [
  { name: "My Profile", routeName: "UserProfile", icon: "user" },
  {
    name: "Addresses",
    routeName: "UserAddressManager",
    icon: "map-marked-alt",
  },
  { name: "Preferences", routeName: "UserPreferences", icon: "cogs" },
  // { name: 'Membership', routeName: 'UserMembership', icon: 'crown' },
  { name: "Referrals", routeName: "UserReferral", icon: "user" },
];

// emit event to close sidebar
const emit = defineEmits(["closeSidebar"]);

// ✅ simplified active link check (no Dashboard anymore)
const isActive = (routeName) => route.name === routeName;

// logout handler
const handleLogout = () => {
  // 1. Clear token
  localStorage.removeItem("userToken");

  // 2. Close the sidebar on mobile
  emit("closeSidebar");

  // 3. Toast message
  showSuccess("You have been logged out successfully.");

  // 4. Redirect to login
  router.push({ name: "Login" });
};
</script>
