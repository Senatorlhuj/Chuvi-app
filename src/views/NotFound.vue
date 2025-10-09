<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-navy-blue text-cream">
    <h1 class="text-5xl font-bold mb-4">404</h1>
    <p class="text-lg mb-6">Page not found</p>
    <router-link :to="{ name: 'Home' }" class="text-golden-brown hover:underline">Return Home</router-link>
  </div>
</template>
