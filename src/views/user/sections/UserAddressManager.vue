<template>
  <div class="p-6 md:p-10  text-charcoal min-h-screen">
    <div class="bg-bone-white text-golden-brown px-4 py-3 rounded-sm mb-6">
      <strong>Disclaimer:</strong> Deliveries and services are available <strong>within Anambra</strong> only.
    </div>

    <h2 class="text-3xl font-bold mb-6 text-navy-blue">My Addresses</h2>

    <button
      @click="showAddresses = !showAddresses"
      class="mb-4 px-4 py-2 bg-navy-blue text-bone-white rounded-sm hover:bg-golden-brown transition-colors cursor-pointer"
    >
      {{ showAddresses ? "Hide My Addresses" : "Show My Addresses" }}
    </button>

    <div v-if="showAddresses">
      <div v-if="loading" class="text-charcoal">Loading addresses…</div>
      
      <div v-else-if="error" class="text-golden-brown font-semibold">{{ error }}</div> 

      <div v-else>
        <div v-if="addresses.length === 0" class="text-charcoal opacity-70 mb-4">
          No addresses saved yet.
        </div>
        <div
          v-for="addr in addresses"
          :key="addr._id"
          class="border border-charcoal/20 rounded-lg p-4 mb-4 bg-bone-white shadow-sm"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold text-lg text-navy-blue">{{ addr.label }}</h3>
              <p class="text-charcoal">{{ addr.line1 }}</p>
              <p v-if="addr.line2" class="text-charcoal">{{ addr.line2 }}</p>
              <p class="text-charcoal">{{ addr.city }}, {{ addr.state }}</p>
              <p v-if="addr.landmark" class="text-charcoal">Landmark: {{ addr.landmark }}</p>
              <span class="text-xs text-charcoal opacity-60">Zone: {{ addr.zone }}</span>
            </div>
            <button
              @click="deleteAddr(addr._id)"
              class="text-golden-brown hover:text-navy-blue text-sm font-semibold ml-4 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <h3 class="text-2xl font-semibold mt-8 mb-4 text-navy-blue">Add New Address</h3>
    <form
      @submit.prevent="addAddress"
      class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-sm "
    >
      <div>
        <label class="block text-sm mb-1 text-charcoal">Label</label>
        <input v-model="newAddress.label" type="text" required class="input" placeholder="e.g. Home or Work" />
      </div>
      <div>
        <label class="block text-sm mb-1 text-charcoal">Line 1</label>
        <input v-model="newAddress.line1" type="text" required class="input" placeholder="123 Main Street" />
      </div>
      <div>
        <label class="block text-sm mb-1 text-charcoal">Line 2 (Optional)</label>
        <input v-model="newAddress.line2" type="text" class="input" placeholder="Apartment 4B" />
      </div>
      <div>
        <label class="block text-sm mb-1 text-charcoal">City</label>
        <input v-model="newAddress.city" type="text" required class="input" placeholder="Awka" />
      </div>
      <div>
        <label class="block text-sm mb-1 text-charcoal">State</label>
        <input v-model="newAddress.state" type="text" required class="input" placeholder="Anambra State" />
      </div>
      <div>
        <label class="block text-sm mb-1 text-charcoal">Landmark</label>
        <input v-model="newAddress.landmark" type="text" class="input" placeholder="Near XYZ" />
      </div>
      <div class="md:col-span-2">
        <button
          type="submit"
          class="px-4 py-2 bg-navy-blue text-bone-white rounded-sm hover:bg-golden-brown transition-colors disabled:opacity-50 cursor-pointer"
          :disabled="adding"
        >
          {{ adding ? 'Adding…' : 'Add Address' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchAddresses, saveAddress, deleteAddress } from '@/services/api.js';

// **NOTE:** Ensure this path is correct for your project structure
import { useToast } from '@/composables/useToast'; 
const toast = useToast(); 

const loading = ref(true);
const error = ref(null); 
const addresses = ref([]);
const showAddresses = ref(false);

const adding = ref(false);
const newAddress = ref({
  label: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  landmark: ''
});

const loadAddresses = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetchAddresses();
    addresses.value = res.addresses;
  } catch (err) {
    error.value = err.message || 'Failed to load addresses';
  } finally {
    loading.value = false;
  }
};

const addAddress = async () => {
  adding.value = true;
  try {
    await saveAddress(newAddress.value);
    toast.showSuccess('Address added successfully! 🎉'); 
    
    newAddress.value = { label: '', line1: '', line2: '', city: '', state: '', landmark: '' };
    
    await loadAddresses(); 
    showAddresses.value = true;
  } catch (err) {
    const message = err.message || 'Failed to add address';
    toast.showError(message); 
  } finally {
    adding.value = false;
  }
};

const deleteAddr = async (id) => {
  try {
    await deleteAddress(id);
    addresses.value = addresses.value.filter(a => a._id !== id);
    toast.showSuccess('Address deleted successfully.');
  } catch (err) {
    const message = err.message || 'Failed to delete address';
    toast.showError(message);
  }
};

onMounted(loadAddresses);
</script>

<style scoped>
/*
  Custom CSS to map your custom properties to Tailwind classes.
  This assumes you have NOT set up these colors in your tailwind.config.js yet, 
  which is compatible with your previous approach.
*/
.bg-bone-white { background-color: var(--color-bone-white); }
.bg-bone-white { background-color: var(--color-bone-white); }
.bg-navy-blue { background-color: var(--color-navy-blue); }
.bg-golden-brown { background-color: var(--color-golden-brown); }

.text-navy-blue { color: var(--color-navy-blue); }
.text-charcoal { color: var(--color-charcoal); }
.text-golden-brown { color: var(--color-golden-brown); }
.text-bone-white { color: var(--color-bone-white); }

/* Base input styles for forms */
.input {
  width: 100%;
  /* Using a lighter Charcoal border for a sleek look */
  border: 1px solid var(--color-charcoal, #302e2d) /* Use Charcoal/20 for a subtle border */; 
  border-radius: 0.375rem; 
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  background-color: white; /* Explicitly set white background for input */
}
.input:focus {
  /* Use Pure Gold for the focus ring for a premium look */
  box-shadow: 0 0 0 2px var(--color-golden-brown); 
  border-color: var(--color-golden-brown);
}
</style>