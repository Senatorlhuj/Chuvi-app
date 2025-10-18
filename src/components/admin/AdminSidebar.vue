<template>
  <div>
    <!-- Desktop Sidebar -->
    <div
      :class="[
        'hidden md:flex flex-col bg-charcoal text-bone-white transition-all duration-300 ease-in-out fixed md:relative inset-y-0 left-0 z-40 h-full border-r border-golden-brown/30',
        isCollapsed ? 'w-20' : 'w-64',
      ]"
    >
      <!-- Header with Logo + Toggle Button -->
      <div class="p-4 border-b border-golden-brown/30 flex items-center justify-between flex-shrink-0">
        <transition name="fade">
          <img
            v-show="!isCollapsed"
            src="@/assets/images/logo/chuvi-logo.png"
            alt="Admin Logo"
            class="h-10 w-auto"
          />
        </transition>
        <button
          @click="toggleCollapse"
          class="text-bone-white/60 hover:text-pure-gold focus:outline-none transition p-2 rounded hover:bg-golden-brown/20 flex-shrink-0"
          :title="isCollapsed ? 'Expand' : 'Collapse'"
        >
          <i
            :class="isCollapsed ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left'"
          ></i>
        </button>
      </div>

      <!-- Navigation - Scrollable -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div :class="isCollapsed ? 'p-2 space-y-1' : 'p-4 space-y-2'">
          <!-- Dashboard Link -->
          <SidebarLink
            icon="fa-solid fa-house"
            name="Dashboard"
            :to="{ name: 'AdminDashboard' }"
            :collapsed="isCollapsed"
          />

          <!-- Management Section -->
          <div v-if="!isCollapsed" class="pt-4 pb-2 px-2">
            <h3 class="text-xs font-bold text-bone-white/50 uppercase tracking-wider">
              Management
            </h3>
          </div>

          <SidebarLink
            icon="fa-solid fa-user-plus"
            name="Manage Employees"
            :to="{ name: 'AdminEmployeeCreate' }"
            :collapsed="isCollapsed"
          />
          <SidebarLink
            icon="fa-solid fa-tag"
            name="Manage Coupons"
            :to="{ name: 'AdminCouponManager' }"
            :collapsed="isCollapsed"
          />
          <SidebarLink
            icon="fa-solid fa-truck-ramp-box"
            name="Manage Orders"
            :to="{ name: 'ManageOrders' }"
            :collapsed="isCollapsed"
          />
          <SidebarLink
            icon="fa-solid fa-star"
            name="Manage Reviews"
            :to="{ name: 'StaffReviewsManager' }"
            :collapsed="isCollapsed"
          />
          <SidebarLink
            icon="fa-solid fa-exclamation-triangle"
            name="Manage Issues"
            :to="{ name: 'StaffIssues' }"
            :collapsed="isCollapsed"
          />
          <SidebarLink
            icon="fa-solid fa-list-check"
            name="Manage Services"
            :to="{ name: 'ManageServices' }"
            :collapsed="isCollapsed"
          />
          <SidebarLink
            icon="fa-solid fa-crown"
            name="Manage Plans"
            :to="{ name: 'ManagePlans' }"
            :collapsed="isCollapsed"
          />

          <!-- System Section -->
          <div v-if="!isCollapsed" class="pt-4 pb-2 px-2">
            <h3 class="text-xs font-bold text-bone-white/50 uppercase tracking-wider">
              System
            </h3>
          </div>
          <SidebarLink
            icon="fa-solid fa-gear"
            name="Default Config"
            :to="{ name: 'AdminServiceConfig' }"
            :collapsed="isCollapsed"
          />
        </div>
      </nav>

    </div>

    <!-- Mobile Overlay -->
    <transition name="overlay">
      <div
        v-if="isOpen"
        @click="$emit('closeSidebar')"
        class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
      ></div>
    </transition>

    <!-- Mobile Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 w-64 bg-charcoal text-bone-white z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Mobile Header -->
      <div class="p-4 border-b border-golden-brown/30 flex items-center justify-between flex-shrink-0">
        <img
          src="@/assets/images/logo/chuvi-logo-icon.png"
          alt="Admin Logo"
          class="h-10 w-auto"
        />
        <button
          @click="$emit('closeSidebar')"
          class="text-bone-white/60 hover:text-pure-gold focus:outline-none transition p-2 rounded hover:bg-golden-brown/20"
        >
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Mobile Navigation - Scrollable -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div class="p-4 space-y-2">
          <SidebarLink
            icon="fa-solid fa-house"
            name="Dashboard"
            :to="{ name: 'AdminDashboard' }"
            @click="$emit('closeSidebar')"
          />

          <div class="pt-4 pb-2 px-2">
            <h3 class="text-xs font-bold text-bone-white/50 uppercase tracking-wider">
              Management
            </h3>
          </div>

          <SidebarLink
            icon="fa-solid fa-user-plus"
            name="Manage Employees"
            :to="{ name: 'AdminEmployeeCreate' }"
            @click="$emit('closeSidebar')"
          />
          <SidebarLink
            icon="fa-solid fa-tag"
            name="Manage Coupons"
            :to="{ name: 'AdminCouponManager' }"
            @click="$emit('closeSidebar')"
          />
          <SidebarLink
            icon="fa-solid fa-truck-ramp-box"
            name="Manage Orders"
            :to="{ name: 'ManageOrders' }"
            @click="$emit('closeSidebar')"
          />
          <SidebarLink
            icon="fa-solid fa-star"
            name="Manage Reviews"
            :to="{ name: 'StaffReviewsManager' }"
            @click="$emit('closeSidebar')"
          />
          <SidebarLink
            icon="fa-solid fa-exclamation-triangle"
            name="Manage Issues"
            :to="{ name: 'StaffIssues' }"
            @click="$emit('closeSidebar')"
          />
          <SidebarLink
            icon="fa-solid fa-list-check"
            name="Manage Services"
            :to="{ name: 'ManageServices' }"
            @click="$emit('closeSidebar')"
          />
          <SidebarLink
            icon="fa-solid fa-crown"
            name="Manage Plans"
            :to="{ name: 'ManagePlans' }"
            @click="$emit('closeSidebar')"
          />

          <div class="pt-4 pb-2 px-2">
            <h3 class="text-xs font-bold text-bone-white/50 uppercase tracking-wider">
              System
            </h3>
          </div>
          <SidebarLink
            icon="fa-solid fa-gear"
            name="Default Config"
            :to="{ name: 'AdminServiceConfig' }"
            @click="$emit('closeSidebar')"
          />
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import SidebarLink from "@/components/admin/SidebarLink.vue";
import { ref, onMounted, watch } from "vue";
import { defineProps, defineEmits } from "vue";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["closeSidebar"]);

const isCollapsed = ref(false);

onMounted(() => {
  const saved = localStorage.getItem("sidebar-collapsed");
  if (saved !== null) {
    isCollapsed.value = JSON.parse(saved);
  }
});

watch(isCollapsed, (newVal) => {
  localStorage.setItem("sidebar-collapsed", JSON.stringify(newVal));
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
:deep(.custom-scrollbar)::-webkit-scrollbar {
  width: 8px; /* Set the width of the scrollbar */
}
:deep(.custom-scrollbar)::-webkit-scrollbar-track {
  /* Slightly lighter charcoal/dark gray for the track */
  background: #3c3a39; 
  border-radius: 4px;
}
:deep(.custom-scrollbar)::-webkit-scrollbar-thumb {
  /* --color-golden-brown */
  background-color: #996515; 
  border-radius: 4px;
}
:deep(.custom-scrollbar)::-webkit-scrollbar-thumb:hover {
  /* A slightly brighter color on hover */
  background-color: #e5b80b; /* Using --color-pure-gold for hover effect */
}

/* Firefox (For compatibility) */
:deep(.custom-scrollbar) {
  scrollbar-width: thin; /* 'auto' or 'thin' */
  /* thumb color track color */
  scrollbar-color: #996515 #3c3a39;
}
</style>