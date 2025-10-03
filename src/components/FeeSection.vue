<template>
  <div class="container mx-auto px-4 py-12">
    <h2 class="text-3xl md:text-4xl font-bold text-charcoal mb-8">About our fees</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <FeeCard price="$5.00" offer="Free for Chuvi premium subscribers.">
        <template v-slot:title> Service Fee </template>
        <template v-slot:description>
          It helps cover our operational costs and ensure we can provide the
          best experience possible.
        </template>
      </FeeCard>

      <FeeCard price="$9.95" offer="Free for Chuvi premium subscribers.">
        <template v-slot:title> Pickup & Delivery Fee </template>
        <template v-slot:description>
          This fee covers the cost of picking up and delivering your clothes.
          Waive this fee on all your orders by
          <span class="text-golden-brown font-semibold"
            >subscribing to Chuvi Go</span
          >
          for just $9.95/mo or $99.00/yr.
        </template>
      </FeeCard>

      <FeeCard price="Custom" offer="Contact us for a quote.">
        <template v-slot:title> Special Items </template>
        <template v-slot:description>
          Pricing for oversized items like comforters or delicate materials is
          based on a custom quote to ensure proper care.
        </template>
      </FeeCard>
    </div>

    <p class="mt-12 text-gray-600 max-w-3xl">
      All orders have a minimum order value of $30, excluding fees. The minimum
      is automatically waived if your order also includes either Wash & Fold or
      Dry Cleaning items.
    </p>
  </div>
</template>

<script setup>
import FeeCard from "@/components/atoms/FeeCard.vue";
</script>
