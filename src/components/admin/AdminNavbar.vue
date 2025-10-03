<template>
  <header
    class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 "
  >
    <div class="flex items-center">
      <button
        @click="$emit('toggleSidebar')"
        class="text-charcoal focus:outline-none md:hidden mr-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 class="text-xl font-bold text-navy-blue">Chuvi Admin Panel</h1>
    </div>

    <div class="flex items-center space-x-4">
      <div class="relative">
        <button
          @click="isProfileOpen = !isProfileOpen"
          class="flex items-center space-x-2 text-charcoal focus:outline-none"
        >
          <span class="text-sm font-medium hidden sm:inline cursor-pointer">Admin User</span>
          <div
            class="w-8 h-8 rounded-full bg-golden-brown flex items-center justify-center text-bone-white font-semibold cursor-pointer"
          >
            A
          </div>
        </button>

        <div
          v-if="isProfileOpen"
          class="absolute right-0 mt-2 w-48 bg-bone-white rounded-md bg-white py-1 z-20"
        >
          <a
            href="#"
            @click.prevent="logout"
            class="block px-4 py-2 text-sm text-charcoal cursor-pointer"
            >Logout</a
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isProfileOpen = ref(false);

const logout = () => {
  localStorage.removeItem("adminToken");
  router.push({ name: "AdminLogin" });
};

defineEmits(["toggleSidebar"]);
</script>
