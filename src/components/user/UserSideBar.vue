<template>
  <div>
    <!-- Desktop Sidebar -->
    <aside
      :class="[
        'hidden lg:flex flex-col bg-charcoal text-bone-white transition-all duration-300 ease-in-out fixed md:relative inset-y-0 left-0 z-20 h-full border-r border-golden-brown/30',
        isCollapsed ? 'w-16 md:w-20' : 'w-64 md:w-72',
      ]"
    >
      <!-- Header Section -->
      <div
        class="p-3 md:p-4 border-b border-golden-brown/30 flex items-center justify-between flex-shrink-0 min-h-[64px]"
      >
        <router-link
          :to="{ name: 'Home' }"
          class="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
          :class="isCollapsed ? 'w-full justify-center' : ''"
        >
          <transition name="fade" mode="out-in">
            <img
              v-if="!isCollapsed"
              src="@/assets/images/logo/chuvi-logo.png"
              alt="Brand Logo"
              class="h-8 w-auto filter brightness-0 invert transition-all duration-300"
            />
            <font-awesome-icon
              v-else
              icon="home"
              class="text-pure-gold text-lg md:text-xl transition-all duration-300"
            />
          </transition>
        </router-link>

        <button
          v-if="!isCollapsed"
          @click="toggleCollapse"
          class="text-bone-white/60 hover:text-pure-gold focus:outline-none transition p-1 md:p-2 rounded hover:bg-golden-brown/20 flex-shrink-0 cursor-pointer"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
        >
          <font-awesome-icon icon="angles-left" class="text-base md:text-lg" />
        </button>
      </div>

      <!-- Collapse Toggle for Collapsed State -->
      <div
        v-if="isCollapsed"
        class="flex justify-center p-2 border-b border-golden-brown/30"
      >
        <button
          @click="toggleCollapse"
          class="text-bone-white/60 hover:text-pure-gold focus:outline-none transition p-1 md:p-2 rounded hover:bg-golden-brown/20 cursor-pointer"
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <font-awesome-icon icon="angles-right" class="text-base md:text-lg" />
        </button>
      </div>

      <!-- Navigation -->
      <nav
        class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-2"
      >
        <div :class="isCollapsed ? 'px-1 space-y-1' : 'px-3 space-y-1'">
          <router-link
            v-for="item in navItems"
            :key="item.routeName"
            :to="{ name: item.routeName }"
            class="relative group flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-3 rounded-lg transition-all duration-200 ease-in-out"
            :class="[
              isActive(item.routeName)
                ? 'bg-golden-brown/30 text-pure-gold shadow-sm'
                : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/15',
              isCollapsed ? 'justify-center' : '',
            ]"
          >
            <font-awesome-icon
              :icon="item.icon"
              :class="[
                'flex-shrink-0 transition-all duration-200',
                isCollapsed ? 'text-base md:text-lg' : 'text-sm md:text-base',
              ]"
            />

            <span
              v-if="!isCollapsed"
              class="text-sm font-medium truncate whitespace-nowrap transition-all duration-200"
            >
              {{ item.name }}
            </span>

            <!-- Tooltip for collapsed state -->
            <div
              v-if="isCollapsed"
              class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-golden-brown text-navy-blue text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-lg"
            >
              {{ item.name }}
              <div class="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2">
                <div class="w-2 h-2 bg-golden-brown transform rotate-45"></div>
              </div>
            </div>
          </router-link>

          <!-- Services Section -->
          <div
            v-if="!isCollapsed"
            class="pt-4 mt-4 border-t border-golden-brown/20"
          >
            <h3
              class="text-cream text-xs font-bold uppercase mb-2 tracking-wider px-3"
            >
              Services
            </h3>
          </div>

          <div
            v-if="isCollapsed"
            class="pt-2 mt-2 border-t border-golden-brown/20"
          ></div>

          <!-- Book Service Link -->
          <router-link
            :to="{ name: 'BookPickup' }"
            class="relative group flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-3 rounded-lg transition-all duration-200 ease-in-out"
            :class="[
              isActive('BookPickup')
                ? 'bg-golden-brown/30 text-pure-gold shadow-sm'
                : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/15',
              isCollapsed ? 'justify-center' : '',
            ]"
          >
            <font-awesome-icon
              icon="calendar-plus"
              :class="[
                'flex-shrink-0',
                isCollapsed ? 'text-base md:text-lg' : 'text-sm md:text-base',
              ]"
            />

            <span
              v-if="!isCollapsed"
              class="text-sm font-medium truncate whitespace-nowrap"
            >
              Book Service
            </span>

            <div
              v-if="isCollapsed"
              class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-golden-brown text-navy-blue text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-lg"
            >
              Book Service
              <div class="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2">
                <div class="w-2 h-2 bg-golden-brown transform rotate-45"></div>
              </div>
            </div>
          </router-link>
        </div>
      </nav>

      <!-- Notifications -->
      <div :class="isCollapsed ? 'p-2' : 'p-3'">
        <router-link
          :to="{ name: 'UserNotifications' }"
          class="relative group flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-3 rounded-lg transition-all duration-200 ease-in-out w-full"
          :class="[
            isActive('UserNotifications')
              ? 'bg-golden-brown/30 text-pure-gold shadow-sm'
              : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/15',
            isCollapsed ? 'justify-center' : '',
          ]"
          aria-label="Notifications"
        >
          <font-awesome-icon
            icon="bell"
            :class="[
              'flex-shrink-0',
              isCollapsed ? 'text-base md:text-lg' : 'text-sm md:text-base',
            ]"
          />

          <!-- Notification Badge -->
          <span
            v-if="unreadCount > 0"
            class="absolute flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-charcoal"
            :class="isCollapsed ? 'top-1 right-1 px-1' : 'top-2 right-2 px-1'"
          >
            {{ unreadCount > 9 ? "9+" : unreadCount }}
          </span>

          <span
            v-if="!isCollapsed"
            class="text-sm font-medium truncate whitespace-nowrap"
          >
            Notifications
          </span>

          <div
            v-if="isCollapsed"
            class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-golden-brown text-navy-blue text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-lg"
          >
            Notifications
            <div class="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2">
              <div class="w-2 h-2 bg-golden-brown transform rotate-45"></div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Logout -->
      <div class="p-3 border-t border-golden-brown/20 flex-shrink-0">
        <button
          @click="handleLogout"
          class="relative group flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-3 w-full text-bone-white/70 hover:text-red-300 hover:bg-red-600/20 transition-all duration-200 rounded-lg cursor-pointer border border-transparent hover:border-red-600/30"
          :class="isCollapsed ? 'justify-center' : ''"
        >
          <font-awesome-icon
            icon="right-from-bracket"
            :class="[
              'flex-shrink-0',
              isCollapsed ? 'text-base md:text-lg' : 'text-sm md:text-base',
            ]"
          />
          <span
            v-if="!isCollapsed"
            class="text-sm font-medium truncate whitespace-nowrap"
          >
            Logout
          </span>

          <div
            v-if="isCollapsed"
            class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-bone-white text-charcoal text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-lg"
          >
            Logout
            <div class="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2">
              <div class="w-2 h-2 bg-bone-white transform rotate-45"></div>
            </div>
          </div>
        </button>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    <transition name="overlay">
      <div
        v-if="isOpen"
        @click="$emit('closeSidebar')"
        class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden transition-all duration-300"
      ></div>
    </transition>

    <!-- Mobile Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 w-64 bg-charcoal text-bone-white z-40 transform transition-all duration-300 ease-in-out flex flex-col shadow-2xl custom-mobile-sidebar',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div
        class="p-4 border-b border-golden-brown/30 flex items-center justify-between flex-shrink-0 min-h-[64px]"
      >
        <router-link
          :to="{ name: 'Home' }"
          class="flex items-center hover:opacity-80 transition-opacity"
          @click="$emit('closeSidebar')"
        >
          <img
            src="@/assets/images/logo/chuvi-logo-icon.png"
            alt="Brand Logo"
            class="h-10 w-auto"
          />
          <span class="ml-3 text-lg font-semibold text-bone-white">Chuvi</span>
        </router-link>
        <button
          @click="$emit('closeSidebar')"
          class="text-bone-white/60 hover:text-pure-gold focus:outline-none transition p-2 rounded-full hover:bg-golden-brown/20"
          aria-label="Close menu"
        >
          <font-awesome-icon icon="xmark" class="text-xl" />
        </button>
      </div>

      <nav
        class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4"
      >
        <div class="px-4 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.routeName"
            :to="{ name: item.routeName }"
            @click="$emit('closeSidebar')"
            class="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out active:scale-95"
            :class="[
              isActive(item.routeName)
                ? 'bg-golden-brown/30 text-pure-gold shadow-sm'
                : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/20',
            ]"
          >
            <font-awesome-icon
              :icon="item.icon"
              class="flex-shrink-0 text-base w-5 text-center"
            />
            <span class="text-sm font-medium truncate whitespace-nowrap">
              {{ item.name }}
            </span>
          </router-link>

          <!-- Notifications for Mobile -->
          <router-link
            :to="{ name: 'UserNotifications' }"
            @click="$emit('closeSidebar')"
            class="relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out active:scale-95"
            :class="[
              isActive('UserNotifications')
                ? 'bg-golden-brown/30 text-pure-gold shadow-sm'
                : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/20',
            ]"
            aria-label="Notifications"
          >
            <font-awesome-icon
              icon="bell"
              class="flex-shrink-0 text-base w-5 text-center"
            />
            <span class="text-sm font-medium truncate whitespace-nowrap">
              Notifications
            </span>
            <span
              v-if="unreadCount > 0"
              class="absolute right-4 flex items-center justify-center min-w-[20px] h-5 text-[10px] font-bold text-white bg-red-500 rounded-full"
            >
              {{ unreadCount > 9 ? "9+" : unreadCount }}
            </span>
          </router-link>

          <!-- Services Section for Mobile -->
          <div class="pt-6 mt-4 border-t border-golden-brown/30">
            <h3
              class="text-cream text-xs font-bold uppercase mb-3 tracking-wider px-3"
            >
              Services
            </h3>
          </div>

          <!-- Book Service for Mobile -->
          <router-link
            :to="{ name: 'BookPickup' }"
            @click="$emit('closeSidebar')"
            class="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out active:scale-95"
            :class="[
              isActive('BookPickup')
                ? 'bg-golden-brown/30 text-pure-gold shadow-sm'
                : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/20',
            ]"
          >
            <font-awesome-icon
              icon="calendar-plus"
              class="flex-shrink-0 text-base w-5 text-center"
            />
            <span class="text-sm font-medium truncate whitespace-nowrap">
              Book Service
            </span>
          </router-link>
        </div>
      </nav>

      <!-- Logout for Mobile -->
      <div class="p-4 border-t border-golden-brown/30 flex-shrink-0">
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-3 py-3 w-full text-bone-white/70 hover:text-red-300 hover:bg-red-600/20 transition-all duration-200 rounded-lg cursor-pointer active:scale-95 border border-transparent hover:border-red-600/30"
        >
          <font-awesome-icon
            icon="right-from-bracket"
            class="flex-shrink-0 text-base w-5 text-center"
          />
          <span class="text-sm font-medium truncate whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  ref,
  onMounted,
  watch,
  onUnmounted,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";
import { useNotifications } from "@/composables/useNotifications";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["closeSidebar"]);
const router = useRouter();
const route = useRoute();
const { showSuccess } = useToast();

const isCollapsed = ref(false);
let notificationInterval = null;

// Notification Logic
const { unreadCount, fetchNotifications } = useNotifications();

const navItems = [
  { name: "My Profile", routeName: "UserProfile", icon: "user" },
  { name: "My Subscription", routeName: "UserSubscription", icon: "crown" },
  { name: "My Bookings", routeName: "orderHistory", icon: "calendar-check" },
  { name: "My Referrals", routeName: "UserReferral", icon: "link" },
  { name: "Help Center", routeName: "HelpCenter", icon: "circle-question" },
];

const isActive = (routeName) => route.name === routeName;

const handleLogout = () => {
  localStorage.removeItem("userToken");
  showSuccess("You have been logged out successfully.");
  emit("closeSidebar");
  router.push({ name: "Home" });
};

onMounted(() => {
  // Load sidebar state
  const saved = localStorage.getItem("user-sidebar-collapsed");
  if (saved !== null) {
    isCollapsed.value = JSON.parse(saved);
  }

  // Start fetching notifications
  fetchNotifications();
  notificationInterval = setInterval(fetchNotifications, 60000);
});

onUnmounted(() => {
  // Cleanup interval
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
});

watch(isCollapsed, (newVal) => {
  localStorage.setItem("user-sidebar-collapsed", JSON.stringify(newVal));
});

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Enhanced scrollbar */
:deep(.custom-scrollbar)::-webkit-scrollbar {
  width: 6px;
}

:deep(.custom-scrollbar)::-webkit-scrollbar-track {
  background: #3c3a39;
  border-radius: 3px;
}

:deep(.custom-scrollbar)::-webkit-scrollbar-thumb {
  background-color: #996515;
  border-radius: 3px;
}

:deep(.custom-scrollbar)::-webkit-scrollbar-thumb:hover {
  background-color: #e5b80b;
}

/* Firefox */
:deep(.custom-scrollbar) {
  scrollbar-width: thin;
  scrollbar-color: #996515 #3c3a39;
}

/* Mobile touch improvements */
@media (max-width: 768px) {
  .custom-scrollbar {
    -webkit-overflow-scrolling: touch;
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
@media (max-width: 1030px) {
  aside {
    display: none !important;
  }
}
@media (min-width: 1031px) {
  .custom-mobile-sidebar {
    display: none !important;
  }
}
</style>
