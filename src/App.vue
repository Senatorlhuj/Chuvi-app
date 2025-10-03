<template>
  <div>
    <router-view />
    <Toast />
  </div>
</template>

<style>
body {
  font-family: var(--font-display);
}
</style>

<script setup>
import Toast from "@/components/Toast.vue";
</script>
