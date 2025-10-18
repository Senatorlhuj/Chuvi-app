<template>
  <header class="bg-bone-white md:bg-white fixed top-0 w-full z-30 transform translate-x-0">
    <div class="flex justify-between md:justify-end items-center px-4 py-3">
      <router-link to="/" class="flex items-center md:hidden">
        <img
          src="@/assets/images/logo/chuvi-logo.png"
          alt="Company Logo"
          class="h-8 transition-all duration-500 "
        />
      </router-link>

      <div class="flex items-center space-x-4">
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
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";
// import { useNotifications } from "@/composables/useNotifications"; // Removed

// Props & Emits
defineProps({ isSidebarOpen: Boolean });
defineEmits(["toggleSidebar"]);

const router = useRouter();
const { showSuccess } = useToast();

// const { unreadCount, fetchNotifications } = useNotifications(); // Removed

// Logic for fetching notifications is now removed from onMounted as well.
onMounted(() => {
  // fetchNotifications(); // Removed
  // setInterval(fetchNotifications, 60000); // Removed
});
</script>