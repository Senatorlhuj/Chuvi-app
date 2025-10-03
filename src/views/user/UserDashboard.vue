<template>
  <div class="flex flex-col min-h-screen bg-cream">
    
    <!-- <DashboardHeader /> -->

    <div class="flex flex-grow max-w-7xl mx-auto w-full pt-4">
      
      <aside class="w-64 bg-bone-white border-r border-gray-200 p-4 sticky top-16 h-full">
        <nav class="space-y-2">
          <router-link
            v-for="item in menuItems"
            :key="item.id"
            :to="{ name: item.routeName }"
            :class="[
              'flex items-center p-3 rounded-lg font-semibold transition-colors cursor-pointer',
              'router-link-active:bg-golden-brown router-link-active:text-bone-white router-link-active:shadow-md',
              'text-charcoal hover:bg-cream hover:text-navy-blue',
            ]"
          >
            <font-awesome-icon :icon="item.icon" class="mr-3 w-5" />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
      </aside>
      
      <main class="flex-grow p-8">
        <router-view />
      </main>
      
    </div>

    <!-- <DashboardFooter /> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
// import DashboardHeader from './DashboardHeader.vue'; 
// import DashboardFooter from './DashboardFooter.vue'; 
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { 
    faUser, faMapMarkerAlt, faCog, faCrown, faHeart
} from "@fortawesome/free-solid-svg-icons";

// --- NAVIGATION MENU ---
// NOTE: These routes must be defined as nested routes under the UserLayout route in your router config.
const menuItems = ref([
    { id: 'profile', label: 'My Profile', icon: faUser, routeName: 'UserProfile' },
    { id: 'address', label: 'Saved Addresses', icon: faMapMarkerAlt, routeName: 'UserAddressManager' },
    { id: 'prefs', label: 'Preferences', icon: faCog, routeName: 'UserPreferences' },
    { id: 'member', label: 'Membership', icon: faCrown, routeName: 'UserMembership' },
    { id: 'credits', label: 'Referral Credits', icon: faHeart, routeName: 'UserCredits' }, 
]);
</script>