<template>
  <div class="p-6 space-y-10 min-h-screen">
    
    <div class="rounded-xl p-6 ">
      <h2 class="text-3xl font-bold text-navy-blue mb-6 border-b pb-3 border-charcoal/20" :style="{ fontFamily: 'var(--font-display)' }">
        Place Your Order
      </h2>
      
      <form @submit.prevent="createOrderHandler" class="space-y-6">
        
        <section>
          <h3 class="font-semibold text-lg text-navy-blue mb-3 border-l-4 border-golden-brown pl-2">Your Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input v-model="form.userName" placeholder=" Name" class="custom-input col-span-1" required />
            <input v-model="form.userPhone" placeholder=" Phone" class="custom-input col-span-1" required />
            
            <div class="md:col-span-1">
              <select v-model="form.pricingModel" class="custom-input">
                <option value="" disabled>Select Pricing Model</option>
                <option value="RETAIL">RETAIL</option>
                <option value="SUBSCRIPTION">SUBSCRIPTION</option>
              </select>
            </div>
          </div>
          <textarea v-model="form.notes" placeholder="General Order Notes" class="custom-input mt-4"></textarea>
        </section>

        <hr class="border-charcoal/10" />

        <section>
          <h3 class="font-semibold text-lg text-navy-blue mb-3 border-l-4 border-golden-brown pl-2">Order Items</h3>
          <div class="space-y-4">
            <div
              v-for="(item, idx) in form.items"
              :key="idx"
              class="border border-charcoal/30 rounded-lg p-4 relative"
            >
              <button
                type="button"
                @click="removeItem(idx)"
                class="absolute -top-3 -right-3 h-7 w-7 bg-destructive-red text-charcoal flex items-center justify-center rounded-full transition-colors hover:bg-red-800 hover:text-white cursor-pointer"
                title="Remove item"
              >
                <font-awesome-icon icon="trash" class="text-xs" />
              </button>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <input v-model="item.serviceCode" placeholder="Service Code" class="custom-input col-span-2" />
                <input v-model="item.serviceName" placeholder="Service Name" class="custom-input col-span-2" required />
              </div>
              
              <div class="grid grid-cols-4 gap-3">
                <input v-model.number="item.quantity" type="number" placeholder="Quantity (Qty)" class="custom-input" min="1" required />
                <input v-model="item.unit" placeholder="Unit (e.g., Kg, pc)" class="custom-input" />
                <input v-model.number="item.price" type="number" placeholder="Price (₦)" class="custom-input" min="0" required />
                <select v-model="form.serviceTier" class="custom-input">
                  <option value="" disabled>Service Tier</option>
                  <option value="STANDARD">STANDARD</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="SIGNATURE">SIGNATURE</option>
                </select>
              </div>
              
              <textarea v-model="item.itemNotes" placeholder="Item specific notes (e.g., Starch, Press only)" class="custom-input mt-3"></textarea>
            </div>
          </div>

          <button
            type="button"
            @click="addItem"
            class="mt-4 px-4 py-2 rounded-md font-medium transition-colors w-full md:w-auto cursor-pointer"
            style="background-color: var(--color-golden-brown); color: var(--color-white);"
          >
            <font-awesome-icon icon="plus" class="mr-2" /> Add Item
          </button>
        </section>

        <hr class="border-charcoal/10" />

        <section class="grid md:grid-cols-2 gap-6">
          
          <div>
            <h3 class="font-semibold text-lg text-navy-blue mb-3 border-l-4 border-golden-brown pl-2">Pickup Details</h3>
            <input v-model="form.pickup.date" type="datetime-local" class="custom-input mb-3" required />
            <input v-model="form.pickup.window" placeholder="Time Window (e.g., 9am - 12pm)" class="custom-input mb-3" required />
            <input v-model="form.pickup.address.line1" placeholder="Address Line 1" class="custom-input mb-3" required />
            <input v-model="form.pickup.address.city" placeholder="City" class="custom-input" required />
          </div>

          <div>
            <h3 class="font-semibold text-lg text-navy-blue mb-3 border-l-4 border-golden-brown pl-2">Delivery Details</h3>
            <input v-model="form.delivery.date" type="datetime-local" class="custom-input mb-3" required />
            <input v-model="form.delivery.window" placeholder="Time Window (e.g., 5pm - 8pm)" class="custom-input mb-3" required />
            <input v-model="form.delivery.address.line1" placeholder="Address Line 1" class="custom-input mb-3" required />
            <input v-model="form.delivery.address.city" placeholder="City" class="custom-input" required />
          </div>
        </section>

        <hr class="border-charcoal/10" />

        <button
          type="submit"
          class="px-8 py-3 rounded-lg font-bold  text-xl transition-transform transform hover:scale-[1.01] w-full cursor-pointer"
          style="background-color: var(--color-golden-brown); color: var(--color-bone-white);"
        >
          Submit New Order
        </button>
      </form>
    </div>
    
    <div class="bg-white rounded-xl p-6 border border-charcoal/30">
      <h2 class="text-3xl font-bold text-navy-blue mb-6 border-b pb-3 border-charcoal/20" :style="{ fontFamily: 'var(--font-display)' }">
        My Order History
      </h2>
      
      <div class="flex flex-col md:flex-row gap-3 mb-6">
        <input
          v-model="userPhone"
          placeholder="Enter phone number to search"
          class="custom-input flex-1"
        />
        <button
          @click="fetchOrders"
          class="px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
          style="background-color: var(--color-golden-brown); color: var(--color-white);"
        >
          <font-awesome-icon icon="search" class="mr-2" /> Fetch Orders
        </button>
      </div>

      <div v-if="orders.length" class="space-y-4">
        <div
          v-for="order in orders"
          :key="order._id"
          class="border border-charcoal/40 rounded-lg p-4"
        >
          <div class="flex justify-between items-start mb-2 border-b pb-2">
            <div class="font-bold text-navy-blue text-lg">Order #{{ order._id.substring(0, 8) }}...</div>
            <span class="px-3 py-1 text-sm font-semibold rounded-full" :class="{'bg-green-100 text-green-700': order.status === 'COMPLETED', 'bg-yellow-100 text-yellow-700': order.status === 'PENDING', 'bg-blue-100 text-blue-700': order.status === 'IN_PROGRESS'}"
              >{{ order.status }}</span
            >
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-y-1 text-sm text-charcoal">
            <div><span class="font-medium">Total:</span> <span class="text-navy-blue font-bold">₦{{ order.totals.grandTotal }}</span></div>
            <div><span class="font-medium">Model:</span> {{ order.pricingModel }}</div>
            <div><span class="font-medium">Tier:</span> {{ order.serviceTier }}</div>
            <div class="md:col-span-1"><span class="font-medium">Items:</span> {{ order.items.length }}</div>
            
            <div class="col-span-2"><span class="font-medium">Pickup:</span> {{ formatDate(order.pickup.date) }} ({{ order.pickup.window }})</div>
            <div class="col-span-2"><span class="font-medium">Delivery:</span> {{ formatDate(order.delivery.date) }} ({{ order.delivery.window }})</div>
          </div>

          <ul class="mt-3 border-t pt-2 border-charcoal/10">
            <li
              v-for="(it, i) in order.items"
              :key="i"
              class="text-sm py-1 text-charcoal"
            >
              <span class="font-medium">{{ it.quantity }} {{ it.unit }}</span> of **{{ it.serviceName }}** @ ₦{{ it.price }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="text-charcoal text-center py-4">You haven't placed any orders!</div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
// Assuming you have font-awesome-icon globally or locally imported for the trash/plus icons
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; 
// import { faTrash, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

import { createOrder, getUserOrders } from '@/services/api.js';
import { useToast } from '@/composables/useToast';

const { showSuccess, showError } = useToast();

const form = ref({
  userPhone: '',
  userName: '',
  notes: '',
  items: [
    {
      serviceCode: '',
      serviceName: '',
      quantity: 1,
      unit: '',
      itemNotes: '',
      addOns: [],
      price: 0,
      express: false,
      sameDay: false,
    },
  ],
  pickup: {
    date: '',
    window: '',
    address: { line1: '', city: '' },
  },
  delivery: {
    date: '',
    window: '',
    address: { line1: '', city: '' },
  },
  pricingModel: '',
  serviceTier: '', // Moved serviceTier to a single field for simplicity, as it was only being applied once in the original template. If it needs to be per-item, it must remain there.
});

const userPhone = ref('');
const orders = ref([]);

function addItem() {
  form.value.items.push({
    serviceCode: '',
    serviceName: '',
    quantity: 1,
    unit: '',
    itemNotes: '',
    addOns: [],
    price: 0,
    express: false,
    sameDay: false,
  });
}

function removeItem(index) {
  form.value.items.splice(index, 1);
}

async function createOrderHandler() {
  try {
    // Basic form validation for required fields
    if (!form.value.userName || !form.value.userPhone || !form.value.pricingModel || !form.value.pickup.date || !form.value.delivery.date || form.value.items.length === 0) {
      showError('Please fill in all required fields and add at least one item.');
      return;
    }
    
    // Check required item fields
    const invalidItem = form.value.items.find(item => !item.serviceName || item.quantity <= 0 || item.price < 0);
    if (invalidItem) {
        showError('Please ensure all items have a name, quantity > 0, and price >= 0.');
        return;
    }

    await createOrder(form.value);
    showSuccess('Order created successfully!');
    // Optional: Reset form after submission
    // form.value = getInitialFormState(); 
  } catch (err) {
    console.error(err);
    showError(err.message || 'Failed to create order');
  }
}

async function fetchOrders() {
  try {
    if (!userPhone.value) {
      showError('Please enter phone number to fetch orders.');
      orders.value = [];
      return;
    }
    const data = await getUserOrders(userPhone.value);
    orders.value = data;
    showSuccess('Orders fetched successfully!');
  } catch (err) {
    console.error(err);
    orders.value = [];
    showError(err.message || 'Failed to fetch orders');
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString();
}
</script>


<style scoped>
/* Custom Input Style */
.custom-input {
  width: 100%;
  border: 1px solid var(--color-charcoal);
  border-radius: 0.5rem; /* Slightly larger border-radius for modern look */
  padding: 0.75rem 1rem;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  background-color: var(--color-white);
  color: var(--color-charcoal);
}
.custom-input:focus {
  box-shadow: 0 0 0 3px var(--color-golden-brown); /* Increased shadow size for focus */
  border-color: var(--color-golden-brown);
  background-color: white; /* Make it pure white on focus for contrast */
}

/* Ensure the text color is applied */
.text-navy-blue {
  color: var(--color-navy-blue);
}
</style>