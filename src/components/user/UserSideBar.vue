<template>
  <aside
    :class="[ 
      'flex flex-col flex-shrink-0 h-full bg-dark-brown shadow-xl transition-all duration-300 ease-in-out z-40 overflow-hidden',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Top Section -->
    <div class="flex items-center justify-between p-4 border-b border-golden-brown/30">
      <router-link 
        :to="{ name: 'Home' }" 
        class="flex items-center hover:opacity-80 transition-opacity"
        :class="isCollapsed ? 'mx-auto' : ''"
      >
        <img
          v-if="!isCollapsed"
          src="@/assets/images/logo/chuvi-logo.png"
          alt="brand Logo"
          class="h-10 w-auto"
        />
        <font-awesome-icon
          v-else
          icon="home"
          class="text-golden-brown text-xl"
        />
      </router-link>

      <!-- Collapse Button -->
      <button
        v-if="!isCollapsed"
        class="hidden md:flex items-center justify-center text-golden-brown hover:text-cream transition flex-shrink-0"
        @click="$emit('toggleCollapse')"
        aria-label="Toggle sidebar"
      >
        <font-awesome-icon icon="angle-left" class="text-lg" />
      </button>
    </div>

    <!-- Expand Button (when collapsed) -->
    <div v-if="isCollapsed" class="flex justify-center p-3 border-b border-golden-brown/30">
      <button
        class="hidden md:flex items-center justify-center text-golden-brown hover:text-cream transition"
        @click="$emit('toggleCollapse')"
        aria-label="Expand sidebar"
      >
        <font-awesome-icon icon="angle-right" class="text-lg" />
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-2 scrollbar-hide">
      <router-link
        v-for="item in navItems"
        :key="item.routeName"
        :to="{ name: item.routeName }"
        @click="$emit('closeSidebar')"
        class="flex items-center p-3 rounded-xl transition-all duration-200 ease-in-out min-h-[48px]"
        :class="[ 
          isActive(item.routeName)
            ? 'bg-golden-brown text-bone-white font-semibold shadow-lg'
            : 'text-bone-white hover:bg-golden-brown/20 hover:text-golden-brown',
          isCollapsed ? 'justify-center' : ''
        ]"
      >
        <font-awesome-icon
          :icon="item.icon"
          class="w-5 h-5 flex-shrink-0"
          :class="isCollapsed ? '' : 'mr-3'"
        />
        <span
          v-if="!isCollapsed"
          class="text-base whitespace-nowrap"
        >
          {{ item.name }}
        </span>
      </router-link>

      <!-- Services Section -->
      <div class="pt-6 mt-6 border-t border-golden-brown/50">
        <h3 
          v-if="!isCollapsed"
          class="text-cream text-sm uppercase font-semibold mb-3 tracking-wider px-3"
        >
          Services
        </h3>

        <router-link
          :to="{ name: 'BookPickup' }"
          @click="$emit('closeSidebar')"
          class="flex items-center p-3 rounded-xl transition-all duration-200 ease-in-out min-h-[48px]"
          :class="[ 
            isActive('BookPickup')
              ? 'bg-golden-brown text-bone-white font-semibold shadow-lg'
              : 'text-bone-white hover:bg-golden-brown/20 hover:text-golden-brown',
            isCollapsed ? 'justify-center' : ''
          ]"
        >
          <font-awesome-icon
            icon="calendar-plus"
            class="w-5 h-5 flex-shrink-0"
            :class="isCollapsed ? '' : 'mr-3'"
          />
          <span
            v-if="!isCollapsed"
            class="text-base whitespace-nowrap"
          >
            Book Service
          </span>
        </router-link>
      </div>
    </nav>

    <!-- Logout -->
    <div class="p-3 border-t border-golden-brown/30">
      <button
        @click="handleLogout"
        class="flex items-center w-full p-3 text-bone-white hover:bg-golden-brown/20 hover:text-golden-brown transition-all duration-200 rounded-xl min-h-[48px]"
        :class="isCollapsed ? 'justify-center' : ''"
      >
        <font-awesome-icon 
          icon="right-from-bracket" 
          class="w-5 h-5 flex-shrink-0" 
          :class="isCollapsed ? '' : 'mr-3'" 
        />
        <span v-if="!isCollapsed" class="whitespace-nowrap">
          Logout
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';

const props = defineProps({
  isCollapsed: Boolean
});

const emit = defineEmits(['toggleCollapse', 'closeSidebar']);
const router = useRouter();
const route = useRoute();
const { showSuccess } = useToast();

const navItems = [
  { name: 'My Profile', routeName: 'UserProfile', icon: 'user' },
  { name: 'My Subscription', routeName: 'UserSubscription', icon: 'crown' },
  { name: 'My Bookings', routeName: 'orderHistory', icon: 'calendar-check' },
  { name: 'My Referrals', routeName: 'UserReferral', icon: 'link' },
  { name: 'Help Center', routeName: 'HelpCenter', icon: 'circle-question' }
];

const isActive = (routeName) => route.name === routeName;

const handleLogout = () => {
  localStorage.removeItem('userToken');
  showSuccess('You have been logged out successfully.');
  emit('closeSidebar');
  router.push({ name: 'Login' });
};
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>