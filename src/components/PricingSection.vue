<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl md:text-4xl font-bold text-charcoal mb-8"> Pricing</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <PricingCard
        v-for="card in pricingData"
        :key="card.title"
        :title="card.title"
        :image="card.image"
      >
        <template v-slot:items>
          <PricingItem
            v-for="item in card.items"
            :key="item.name"
            :name="item.name"
            :price="item.price"
          />
        </template>
      </PricingCard>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PricingCard from '@/components/atoms/PricingCard.vue';
import PricingItem from '@/components/atoms/PricingItem.vue';

// Define the pricing data structure
const pricingData = ref([
  {
    title: 'Tops',
    image: 'laundry-top.jpeg',
    items: [
      { name: 'All Shirts', price: '$5.95' },
      { name: 'Polo', price: '$5.95' },
      { name: 'Blouse', price: '$11.95' },
      { name: 'Sweater', price: '$13.95' },
      { name: 'Jacket/Blazer', price: '$14.95' },
      { name: 'Vest', price: '$11.95' }
    ]
  },
  {
    title: 'Bottoms',
    image: 'laundry-bottom.jpg',
    items: [
      { name: 'Pants', price: '$13.95' },
      { name: 'Skirt', price: '$11.95' },
      { name: 'Shorts', price: '$11.95' }
    ]
  },
  {
    title: 'Full body',
    image: 'laundry-fullbody.jpg',
    items: [
      { name: 'Casual Dress', price: '$20.95' },
      { name: 'Formal Dress', price: '$28.90' },
      { name: 'Coat', price: '$24.95' },
      { name: 'Suit (Jacket & Pants)', price: '$28.90' }
    ]
  },
  {
    title: 'House hold',
    image: 'laundry-house-hold.jpeg',
    items: [
      { name: 'Bath mat', price: '$6.00' },
      { name: 'Sheets/Blankets', price: '$15.00' },
      { name: 'Duvet cover', price: '$15.00' },
      { name: 'Comforter/Duvet', price: '$39.95' },
      { name: 'tablecloth', price: '$30.00' }
    ]
  },
  {
    title: 'Accessories',
    image: 'laundry-accessories.jpeg',
    items: [
      { name: 'Napkin', price: '$6.00' },
      { name: 'pillowcase', price: '$6.00' },
      { name: 'Coat', price: '$6.00' },
      { name: 'Tie/Scarf', price: '$6.00' }
    ]
  }
]);

// Use Vite's import.meta.glob to dynamically import all images from the specified folder
const images = import.meta.glob('@/assets/images/laundryImages/*.{jpg,jpeg,png,svg}');

// Loop through the pricing data and assign the correct image URL
pricingData.value.forEach(card => {
  const imagePath = `/src/assets/images/laundryImages/${card.image}`;
  if (images[imagePath]) {
    images[imagePath]().then((mod) => {
      card.image = mod.default;
    });
  }
});
</script>