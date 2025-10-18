<template>
  <button
    :class="computedClasses"
    class="font-semibold transition-all duration-300 text-center inline-block cursor-pointer"
    @click="handleClick"
  >
    <slot>{{ bookPickupLink.text }}</slot>
  </button>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  link: {
    type: String,
    default: "/register", // fallback
  },
  backgroundColor: {
    type: String,
    default: "golden-brown",
  },
  textColor: {
    type: String,
    default: "bone-white",
  },
  borderRadius: {
    type: String,
    default: "rounded-full",
  },
  hoverColor: {
    type: String,
    default: "pure-gold",
  },
  padding: {
    type: String,
    default: "py-2 px-5",
  },
});

const router = useRouter();

// ✅ Check if user is authenticated
const isUserLoggedIn = computed(() => {
  const userToken = localStorage.getItem("userToken");
  const adminToken = localStorage.getItem("adminToken");
  const employeeToken = localStorage.getItem("employeeToken");
  return !!(userToken || adminToken || employeeToken);
});

// ✅ Determine where to send the user
const bookPickupLink = computed(() => {
  return isUserLoggedIn.value
    ? { text: "Book Pickup", path: { name: "BookPickup" } }
    : { text: "Book Pickup", path: { name: "Register" } };
});

// ✅ Handle button click
const handleClick = () => {
  if (isUserLoggedIn.value) {
    router.push(bookPickupLink.value.path);
  } else {
    // store current route so user can come back after registration/login
    localStorage.setItem("redirectAfterLogin", router.currentRoute.value.fullPath);
    router.push(bookPickupLink.value.path);
  }
};

// ✅ Styling
const computedClasses = computed(() => [
  `bg-${props.backgroundColor}`,
  `text-${props.textColor}`,
  props.borderRadius,
  props.padding,
  `hover:bg-${props.hoverColor}`,
]);
</script>
