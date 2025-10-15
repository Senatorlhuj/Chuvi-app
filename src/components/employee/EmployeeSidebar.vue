<template>
  <div class="hidden md:flex flex-col w-64 bg-navy-blue text-bone-white">
    <!-- Logo instead of text -->
    <div class="p-6 border-b border-charcoal flex items-center justify-center">
      <img
        src="@/assets/images/logo/chuvi-logo.png"
        alt="Admin Logo"
        class="h-10 w-auto"
      />
    </div>

    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <h3 class="pt-4 pb-1 text-sm font-semibold text-gray-400 uppercase">
        Management
      </h3>

      <SidebarLink
        icon="fa-solid fa-truck-ramp-box"
        name="Manage Orders"
        :to="{ name: 'ManageOrders' }"
      />
      <SidebarLink
        icon="fa-solid fa-star"
        name="All Reviews"
        :to="{ name: 'StaffReviewsManager' }"
      />
      <SidebarLink
        icon="fa-solid fa-exclamation-triangle"
        name="All Issues"
        :to="{ name: 'StaffIssues' }"
      />
    </nav>
  </div>

  <!-- Mobile sidebar -->
  <div
    v-if="isOpen"
    @click="$emit('closeSidebar')"
    class="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
  ></div>
  <div
    :class="[
      'fixed inset-y-0 left-0 w-64 bg-navy-blue text-bone-white z-40 transform transition-transform duration-300 ease-in-out md:hidden',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="p-6 border-b border-charcoal flex items-center justify-center">
      <img
        src="@/assets/images/logo/chuvi-logo-icon.png"
        alt="Admin Logo"
        class="h-12 w-auto"
      />
    </div>

    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <h3 class="pt-4 pb-1 text-sm font-semibold text-gray-400 uppercase">
        Management
      </h3>

      
      <SidebarLink
        icon="fa-solid fa-truck-ramp-box"
        name="Manage Orders"
        :to="{ name: 'ManageOrders' }"
        @click="$emit('closeSidebar')"
      />
      <SidebarLink
        icon="fa-solid fa-star"
        name="AdminReviewsManager"
        :to="{ name: 'StaffReviewsManager' }"
        @click="$emit('closeSidebar')"
      />
        <SidebarLink
        icon="fa-solid fa-exclamation-triangle"
        name="All Issues"
        :to="{ name: 'StaffIssues' }"
        @click="$emit('closeSidebar')"
      />
   
    </nav>
  </div>
</template>

<script setup>
import SidebarLink from "@/components/admin/SidebarLink.vue";
import { defineProps, defineEmits } from "vue";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["closeSidebar"]);
</script>
