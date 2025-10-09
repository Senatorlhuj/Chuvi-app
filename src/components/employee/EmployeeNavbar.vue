<template>
  <header
    class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200"
  >
    <div class="flex items-center">
      <!-- Mobile Menu Button -->
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

      <!-- Title -->
      <h1 class="text-xl font-bold text-navy-blue">Chuvi Employee Panel</h1>
    </div>

    <div class="flex items-center space-x-4">
      <!-- Profile Dropdown -->
      <div class="relative">
        <button
          @click="isProfileOpen = !isProfileOpen"
          class="flex items-center space-x-2 text-charcoal focus:outline-none"
        >
          <span class="text-sm font-medium hidden sm:inline cursor-pointer">
            {{ employeeName || 'Employee User' }}
          </span>
          <div
            class="w-8 h-8 rounded-full bg-golden-brown flex items-center justify-center text-bone-white font-semibold cursor-pointer"
          >
            {{ employeeInitial }}
          </div>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isProfileOpen"
          class="absolute right-0 mt-2 w-48 bg-bone-white rounded-md py-1 z-20 shadow-md"
        >
          <div class="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
            {{ employeeRole }}
          </div>

          <a
            href="#"
            @click.prevent="logout"
            class="block px-4 py-2 text-sm text-charcoal hover:bg-gray-100 cursor-pointer"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isProfileOpen = ref(false);
const employee = ref(null);

// Load employee info from localStorage
onMounted(() => {
  const storedEmployee = localStorage.getItem("employeeData");
  if (storedEmployee) {
    employee.value = JSON.parse(storedEmployee);
  }
});

// Derived values
const employeeName = computed(() => employee.value?.fullName || "Employee");
const employeeRole = computed(() => employee.value?.workRole || "Staff");
const employeeInitial = computed(
  () => employee.value?.fullName?.charAt(0)?.toUpperCase() || "E"
);

// Logout
const logout = () => {
  localStorage.removeItem("employeeToken");
  localStorage.removeItem("employeeData");
  router.push({ name: "EmployeeLogin" });
};

defineEmits(["toggleSidebar"]);
</script>
