<template>
  <header class="bg-bone-white fixed top-0 w-full z-30 transform translate-x-0">
    <div class="flex justify-between md:justify-end items-center px-4 py-3">
      <router-link to="/" class="flex items-center md:hidden">
        <img
          src="@/assets/images/logo/chuvi-logo.png"
          alt="Company Logo"
          class="h-8 transition-all duration-500"
        />
      </router-link>

      <div class="flex items-center space-x-4">
        <!-- 🛎️ Notification Bell -->
        <router-link
          :to="{ name: 'UserNotifications' }"
          class="relative flex items-center text-charcoal font-bold hover:text-golden-brown transition-colors duration-200 cursor-pointer"
          aria-label="Notifications"
        >
          <font-awesome-icon icon="bell" class="w-5 h-5" />
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-[10px] font-bold text-white bg-red-500 rounded-full"
          >
            {{ unreadCount }}
          </span>
        </router-link>

     

        <!-- Sidebar Toggle -->
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
import { useNotifications } from "@/composables/useNotifications";

// Props & Emits
defineProps({ isSidebarOpen: Boolean });
defineEmits(["toggleSidebar"]);

const router = useRouter();
const { showSuccess } = useToast();

const { unreadCount, fetchNotifications } = useNotifications();


onMounted(() => {
  fetchNotifications();
  setInterval(fetchNotifications, 60000);
});


</script>
