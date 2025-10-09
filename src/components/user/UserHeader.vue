<template>
<header class="bg-bone-white fixed top-0 w-full z-30 transform translate-x-0">

    <div class="flex justify-between items-center px-4 py-3">
      <router-link to="/" class="flex items-center">
        <img
          src="@/assets/images/logo/chuvi-logo.png"
          alt="Company Logo"
          class="h-8 transition-all duration-500"
        />
      </router-link>

      <div class="flex items-center space-x-4">
        <router-link
          :to="{ name: 'UserNotifications' }"
          class="relative flex items-center text-charcoal font-bold hover:text-golden-brown transition-colors duration- cursor-pointer"
          aria-label="Notifications"
        >
          <font-awesome-icon icon="bell" class="w-5 h-5" />
          <span
            v-if="unreadCount > 0"
            class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"
          ></span>
        </router-link>

        <button
          @click="handleLogout"
          class="flex items-center space-x-2 text-charcoal hover:text-golden-brown transition-colors duration-200 cursor-pointer"
        >
          <font-awesome-icon icon="sign-out-alt" class="w-5 h-5" />
          <span class="hidden sm:inline text-base font-bold">Logout</span>
        </button>

        <button
          @click="$emit('toggleSidebar')"
          class="text-charcoal font-bold p-2 rounded-lg transition-colors duration-200 hover:bg-golden-brown/20 sm:hidden"
          aria-label="Toggle navigation menu"
        >
          <font-awesome-icon
            :icon="isSidebarOpen ? 'times' : 'bars'"
            class="w-6 h-6"
          />
        </button>

        <button
          @click="$emit('toggleSidebar')"
          class="text-charcoal font-bold text-xl p-2 rounded-lg transition-colors duration-200 hover:bg-golden-brown/20 hidden sm:block"
          aria-label="Toggle navigation menu"
        ></button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";

// Props
defineProps({
  isSidebarOpen: {
    type: Boolean,
    required: true,
  },
});

defineEmits(["toggleSidebar"]);

const router = useRouter();
const { showSuccess } = useToast();

// Simulated unread count — replace with real state later
const unreadCount = ref(3);

// Logout logic
const handleLogout = () => {
  localStorage.removeItem("userToken");
  showSuccess("You have been logged out successfully.");
  router.push({ name: "Home" });
};
</script>