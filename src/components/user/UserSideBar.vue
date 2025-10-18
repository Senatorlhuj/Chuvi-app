<template>
  <div>
    <aside
      :class="[
        'hidden md:flex flex-col bg-charcoal text-bone-white transition-all duration-300 ease-in-out fixed md:relative inset-y-0 left-0 z-20 h-full border-r border-golden-brown/30',
        isCollapsed ? 'w-20' : 'w-64',
      ]"
    >
      <div class="p-4 border-b border-golden-brown/30 flex items-center justify-between flex-shrink-0">
        <router-link
          :to="{ name: 'Home' }"
          class="flex items-center hover:opacity-80 transition-opacity"
          :class="isCollapsed ? 'w-full justify-center' : ''"
        >
          <transition name="fade">
            <img
              v-show="!isCollapsed"
              src="@/assets/images/logo/chuvi-logo.png"
              alt="Brand Logo"
              class="h-10 w-auto filter brightness-0 invert"
            />
          </transition>
          <font-awesome-icon
            v-if="isCollapsed"
            icon="home"
            class="text-pure-gold text-xl"
          />
        </router-link>

        <button
          v-if="!isCollapsed"
          class="text-bone-white/60 hover:text-pure-gold focus:outline-none transition p-2 rounded hover:bg-golden-brown/20 flex-shrink-0 cursor-pointer"
          @click="toggleCollapse"
          aria-label="Toggle sidebar"
          :title="isCollapsed ? 'Expand' : 'Collapse'"
        >
          <font-awesome-icon icon="angles-left" class="text-lg" />
        </button>
      </div>

      <div v-if="isCollapsed" class="flex justify-center p-3 border-b border-golden-brown/30">
        <button
          class="text-bone-white/60 hover:text-pure-gold focus:outline-none transition p-2 rounded hover:bg-golden-brown/20 cursor-pointer"
          @click="toggleCollapse"
          aria-label="Expand sidebar"
          :title="isCollapsed ? 'Expand' : 'Collapse'"
        >
          <font-awesome-icon icon="angles-right" class="text-lg" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto overflow-x-hidden">
        <div :class="isCollapsed ? 'p-2 space-y-1' : 'p-4 space-y-2'">
          <router-link
            v-for="item in navItems"
            :key="item.routeName"
            :to="{ name: item.routeName }"
            class="relative group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out"
            :class="[
              isActive(item.routeName)
                ? 'bg-golden-brown/30 text-pure-gold'
                : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/20',
              isCollapsed ? 'justify-center' : '',
            ]"
          >
            <font-awesome-icon
              :icon="item.icon"
              :class="['flex-shrink-0', isCollapsed ? 'text-lg' : 'text-base']"
            />

            <span
              v-if="!isCollapsed"
              class="text-sm font-medium truncate whitespace-nowrap"
            >
              {{ item.name }}
            </span>

            <div
              v-if="isCollapsed"
              class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-golden-brown text-navy-blue text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg"
            >
              {{ item.name }}
            </div>
          </router-link>

          <div v-if="!isCollapsed" class="pt-6 mt-6 border-t border-golden-brown/30">
            <h3 class="text-cream text-xs font-bold uppercase mb-3 tracking-wider px-3">
              Services
            </h3>
          </div>

          <div v-if="isCollapsed" class="pt-2 mt-2 border-t border-golden-brown/30"></div>

          <router-link
            :to="{ name: 'BookPickup' }"
            class="relative group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out"
            :class="[
              isActive('BookPickup')
                ? 'bg-golden-brown/30 text-pure-gold'
                : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/20',
              isCollapsed ? 'justify-center' : '',
            ]"
          >
            <font-awesome-icon
              icon="calendar-plus"
              :class="['flex-shrink-0', isCollapsed ? 'text-lg' : 'text-base']"
            />

            <span
              v-if="!isCollapsed"
              class="text-sm font-medium truncate whitespace-nowrap"
            >
              Book Service
            </span>

            <div
              v-if="isCollapsed"
              class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-golden-brown text-navy-blue text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg"
            >
              Book Service
            </div>
          </router-link>
        </div>
      </nav>
      
      <div :class="isCollapsed ? 'p-2' : 'p-3'">
        <router-link
          :to="{ name: 'UserNotifications' }"
          class="relative group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out w-full"
          :class="[
            isActive('UserNotifications')
              ? 'bg-golden-brown/30 text-pure-gold'
              : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/20',
            isCollapsed ? 'justify-center' : '',
          ]"
          aria-label="Notifications"
        >
          <font-awesome-icon
            icon="bell"
            :class="['flex-shrink-0', isCollapsed ? 'text-lg' : 'text-base']"
          />
          <span
            v-if="unreadCount > 0"
            class="absolute top-2 right-2 flex items-center justify-center h-4 w-4 text-[10px] font-bold text-white bg-red-500 rounded-full"
            :class="isCollapsed ? 'right-auto left-1/2 -translate-x-1/2 top-1' : ''"
          >
            {{ unreadCount }}
          </span>

          <span
            v-if="!isCollapsed"
            class="text-sm font-medium truncate whitespace-nowrap"
          >
            Notifications
          </span>

          <div
            v-if="isCollapsed"
            class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-golden-brown text-navy-blue text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg"
          >
            Notifications
          </div>
        </router-link>
      </div>

      <div class="p-3 border-t border-golden-brown/30 flex-shrink-0">
        <button
          @click="handleLogout"
          class="relative group flex items-center gap-3 px-3 py-3 w-full text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/20 transition-all duration-200 rounded-lg cursor-pointer"
          :class="isCollapsed ? 'justify-center' : ''"
        >
          <font-awesome-icon
            icon="right-from-bracket"
            :class="['flex-shrink-0', isCollapsed ? 'text-lg' : 'text-base']"
          />
          <span
            v-if="!isCollapsed"
            class="text-sm font-medium truncate whitespace-nowrap"
          >
            Logout
          </span>

          <div
            v-if="isCollapsed"
            class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-bone-white text-charcoal text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg"
          >
            Logout
          </div>
        </button>
      </div>
    </aside>

    <transition name="overlay">
      <div
        v-if="isOpen"
        @click="$emit('closeSidebar')"
        class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
      ></div>
    </transition>

    <div
      :class="[
        'fixed inset-y-0 left-0 w-64 bg-navy-blue text-bone-white z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="p-4 border-b border-golden-brown/30 flex items-center justify-between flex-shrink-0">
        <router-link
          :to="{ name: 'Home' }"
          class="flex items-center hover:opacity-80 transition-opacity"
        >
          <img
            src="@/assets/images/logo/chuvi-logo-icon.png"
            alt="Brand Logo"
            class="h-10 w-auto"
          />
        </router-link>
        <button
          @click="$emit('closeSidebar')"
          class="text-bone-white/60 hover:text-pure-gold focus:outline-none transition p-2 rounded hover:bg-golden-brown/20"
        >
          <font-awesome-icon icon="xmark" class="text-lg" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto overflow-x-hidden">
        <div class="p-4 space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.routeName"
            :to="{ name: item.routeName }"
            @click="$emit('closeSidebar')"
            class="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out"
            :class="[
              isActive(item.routeName)
                ? 'bg-golden-brown/30 text-pure-gold'
                : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/20',
            ]"
          >
            <font-awesome-icon :icon="item.icon" class="flex-shrink-0 text-base" />
            <span class="text-sm font-medium truncate whitespace-nowrap">
              {{ item.name }}
            </span>
          </router-link>
          
          <router-link
            :to="{ name: 'UserNotifications' }"
            @click="$emit('closeSidebar')"
            class="relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out"
            :class="[
              isActive('UserNotifications')
                ? 'bg-golden-brown/30 text-pure-gold'
                : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/20',
            ]"
            aria-label="Notifications"
          >
            <font-awesome-icon icon="bell" class="flex-shrink-0 text-base" />
            <span class="text-sm font-medium truncate whitespace-nowrap">
              Notifications
            </span>
            <span
              v-if="unreadCount > 0"
              class="absolute right-4 flex items-center justify-center h-5 w-5 text-[10px] font-bold text-white bg-red-500 rounded-full"
            >
              {{ unreadCount }}
            </span>
          </router-link>

          <div class="pt-6 mt-6 border-t border-golden-brown/30">
            <h3 class="text-cream text-xs font-bold uppercase mb-3 tracking-wider px-3">
              Services
            </h3>
          </div>

          <router-link
            :to="{ name: 'BookPickup' }"
            @click="$emit('closeSidebar')"
            class="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out"
            :class="[
              isActive('BookPickup')
                ? 'bg-golden-brown/30 text-pure-gold'
                : 'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/20',
            ]"
          >
            <font-awesome-icon icon="calendar-plus" class="flex-shrink-0 text-base" />
            <span class="text-sm font-medium truncate whitespace-nowrap">
              Book Service
            </span>
          </router-link>
        </div>
      </nav>

      <div class="p-3 border-t border-golden-brown/30 flex-shrink-0">
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-3 py-3 w-full text-bone-white/70 hover:text-pure-gold hover:bg-red-600/20 transition-all duration-200 rounded-lg cursor-pointer"
        >
          <font-awesome-icon icon="right-from-bracket" class="flex-shrink-0 text-base" />
          <span class="text-sm font-medium truncate whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
// Assuming you have a composable for notifications
import { useNotifications } from '@/composables/useNotifications'; 

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['closeSidebar']);
const router = useRouter();
const route = useRoute();
const { showSuccess } = useToast();

const isCollapsed = ref(false);

// 🔔 Notification Logic Dropped Here
const { unreadCount, fetchNotifications } = useNotifications();

const navItems = [
  { name: 'My Profile', routeName: 'UserProfile', icon: 'user' },
  { name: 'My Subscription', routeName: 'UserSubscription', icon: 'crown' },
  { name: 'My Bookings', routeName: 'orderHistory', icon: 'calendar-check' },
  { name: 'My Referrals', routeName: 'UserReferral', icon: 'link' },
  { name: 'Help Center', routeName: 'HelpCenter', icon: 'circle-question' },
];

const isActive = (routeName) => route.name === routeName;

const handleLogout = () => {
  localStorage.removeItem('userToken');
  showSuccess('You have been logged out successfully.');
  emit('closeSidebar');
  router.push({ name: 'Home' });
};

onMounted(() => {
  const saved = localStorage.getItem('user-sidebar-collapsed');
  if (saved !== null) {
    isCollapsed.value = JSON.parse(saved);
  }
  
  // 🔔 Start fetching notifications on mount and every minute
  fetchNotifications();
  setInterval(fetchNotifications, 60000); 
});

watch(isCollapsed, (newVal) => {
  localStorage.setItem('user-sidebar-collapsed', JSON.stringify(newVal));
});

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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
</style>