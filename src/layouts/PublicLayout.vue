<template>
  <div>
    <Navbar />
    <main>
      <router-view />
      <EmailSignupModal
        v-if="shouldShowModal"
        @close="handleModalClose"
        @signup="handleSignup"
      />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import EmailSignupModal from "@/components/EmailSignupModal.vue";


const showModal = ref(false);
const isUserLoggedIn = computed(() => {
  return !!localStorage.getItem('userToken');
});


const shouldShowModal = computed(() => {
  const hasSeenOffer = sessionStorage.getItem('hasSeenOffer');
  return !isUserLoggedIn.value && !hasSeenOffer && showModal.value;
});

const handleModalClose = () => {
  sessionStorage.setItem('hasSeenOffer', 'true');
  showModal.value = false;
};

const handleSignup = (email) => {
  handleModalClose(); 
};

onMounted(() => {
  if (!isUserLoggedIn.value) {
    setTimeout(() => {
      showModal.value = true;
    }, 1500); 
  }
});
</script>