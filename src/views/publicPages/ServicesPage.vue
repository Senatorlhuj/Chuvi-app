<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <div class="container mx-auto px-4 pt-20 py-14">
      <div class="mb-8 flex justify-center">
        <ServiceTabs
          :tabs="serviceTabs"
          :activeTab="activeServiceTab"
          @select-tab="handleTabSelect"
        />
      </div>

      <div class="mt-8">
        <div v-if="activeServiceTab === 'wash-fold'">
          <WashFoldSection />
        </div>
        <div v-else-if="activeServiceTab === 'dry-cleaning'">
          <DryCleaningSection />
        </div>
        <div v-else-if="activeServiceTab === 'hang-dry'">
          <HangDrySection />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ServiceTabs from "@/components/ServiceTabs.vue";
import WashFoldSection from "@/components/WashFoldSection.vue";
import DryCleaningSection from "@/components/DryCleaningSection.vue";
import HangDrySection from "@/components/HangDrySection.vue";

const serviceTabs = ref([
  { id: "wash-fold", name: "Wash & Fold" },
  { id: "dry-cleaning", name: "Dry Cleaning" },
  { id: "hang-dry", name: "Hang Dry", badge: "New" },
]);

const activeServiceTab = ref("wash-fold"); // Default active tab

const handleTabSelect = (tabId) => {
  activeServiceTab.value = tabId;
};
</script>

<style scoped>
/* Basic styles for the page layout, if any */
</style>
