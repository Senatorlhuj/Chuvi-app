// /stores/orderStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOrderStore = defineStore('order', () => {
  const orderNumber = ref(null);
  const orderData = ref({}); // optional – keep full form data

  function setOrder(number, data) {
    orderNumber.value = number;
    orderData.value = data;
  }

  return { orderNumber, orderData, setOrder };
});
