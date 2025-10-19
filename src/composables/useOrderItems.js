// src/composables/useOrderItems.js
import { ref, computed } from 'vue';
import { getAllServicesCatalog } from '@/services/api';

// --- STATE ---
const orderPayload = ref({
    items: [],
    pricingModel: 'RETAIL',
    pickup: null,
    delivery: null,
    payment: { method: 'CASH', gateway: null },
    couponCode: '',
    serviceTier: 'STANDARD', // default
});

const servicesCatalog = ref([]);
const isLoadingServices = ref(false);
const servicesError = ref(null);
const groupedServices = ref([]); // for UI display


const transformAndGroupServices = (flatList) => {
    const grouped = {};
    const tiers = ['STANDARD', 'PREMIUM', 'VIP'];

    for (const s of flatList) {
        if (!grouped[s.code]) {
            grouped[s.code] = {
                code: s.code,
                name: s.name,
                pricingModel: 'RETAIL',
                tiers: {},
                // Using addOns directly from the service data
                addOns: s.addOns || [],
            };
        }

        const basePrice = s.basePrice || 0;

        tiers.forEach(tier => {
            let price = basePrice;
            if (tier === 'PREMIUM') {
                price = Math.round(basePrice * 1.20);
            } else if (tier === 'VIP') {
                price = Math.round(basePrice * 1.50);
            }

            grouped[s.code].tiers[tier] = {
                ...s,
                pricePerItem: price,
                serviceTier: tier,
            };
        });
    }

    return Object.values(grouped).map((service) => {
        const standardTier = service.tiers['STANDARD'];
        const retailPrice = standardTier ? standardTier.pricePerItem : 0;

        return {
            ...service,
            retailPrice,
            unit: 'item',
        };
    });
};

// --- COMPOSABLE ---
export function useOrderItems() {
    // --- API Fetcher ---
    const fetchServices = async () => {
        isLoadingServices.value = true;
        servicesError.value = null;

        try {
            const rawServices = await getAllServicesCatalog();

            servicesCatalog.value = Array.isArray(rawServices) ? rawServices : [];

            groupedServices.value = transformAndGroupServices(servicesCatalog.value);

        } catch (err) {
            console.error('Failed to fetch services catalog:', err);
            servicesError.value = err.message;
        } finally {
            isLoadingServices.value = false;
        }
    };

    // 🧺 FIX 1: Add-ons Calculation in addItem (Ensure unique items)
    const addItem = (service, addOns = []) => {

        const existing = orderPayload.value.items.find(
            (i) =>
                i.serviceCode === service.code &&
                i.addOns.map(a => a.key).sort().join(',') === addOns.map(a => a.key).sort().join(',')
        );

        const currentTier = orderPayload.value.serviceTier;
        const selectedTierData = service.tiers[currentTier];
        // The price stored on the item is only the BASE service price (without add-ons)
        const finalItemPrice = selectedTierData ? selectedTierData.pricePerItem : service.retailPrice;

        if (existing) {
            // If item found, increment quantity
            existing.quantity += 1;
        } else {
            // Push a new entry with the selected add-ons
            orderPayload.value.items.push({
                serviceCode: service.code,
                serviceName: service.name,
                quantity: 1,
                unit: service.unit || 'item',
                price: finalItemPrice, // Base price only (Add-ons calculated in subtotal)
                serviceTier: currentTier,
                addOns: addOns, // STORE THE SELECTED ADD-ONS
                express: false,
            });
        }
    };

    // 🧺 FIX 2: Add-ons Calculation in estimatedSubtotal
    const estimatedSubtotal = computed(() =>
        orderPayload.value.items.reduce((sum, item) => {

            // 1. Calculate the total cost of all selected add-ons for a single unit of this item.
            const totalAddOnsPerUnit = item.addOns.reduce((addOnSum, addOn) => addOnSum + addOn.price, 0);

            // 2. Calculate the unit price (Base Price + Total Add-ons per Unit)
            const combinedUnitPrice = item.price + totalAddOnsPerUnit;

            // 3. Add to the running total (Unit Price * Quantity)
            return sum + (item.quantity * combinedUnitPrice);
        }, 0)
    );

    // 🧺 FIX 3: updateAllItemPricesForTier logic remains correct, as it only updates the BASE price
    const updateAllItemPricesForTier = (newTier) => {
        orderPayload.value.serviceTier = newTier;

        orderPayload.value.items = orderPayload.value.items.map(item => {
            const serviceGroup = groupedServices.value.find(
                (s) => s.code === item.serviceCode
            );

            if (serviceGroup?.tiers[newTier]) {
                // Update base item price only
                item.price = serviceGroup.tiers[newTier].pricePerItem;
                item.serviceTier = newTier;
            }
            return item;
        });
    };

    // --- Unchanged Helper Functions ---

    const removeItem = (serviceCode, addOns = []) => {
        const index = orderPayload.value.items.findIndex(
            (i) =>
                i.serviceCode === serviceCode &&
                i.addOns.map(a => a.key).sort().join(',') === addOns.map(a => a.key).sort().join(',')
        );
        if (index === -1) return;

        const item = orderPayload.value.items[index];
        if (item.quantity > 1) item.quantity -= 1;
        else orderPayload.value.items.splice(index, 1);
    };


    const totalItemCount = computed(() =>
        orderPayload.value.items.reduce((sum, i) => sum + i.quantity, 0)
    );

    const isItemSelected = (code) =>
        orderPayload.value.items.some((i) => i.serviceCode === code);

  const getItemQuantity = (code) => {
   
    return orderPayload.value.items
        .filter((i) => i.serviceCode === code)
        .reduce((sum, item) => sum + item.quantity, 0);
};


    return {
        orderPayload,
        groupedServices,
        isLoadingServices,
        servicesError,
        fetchServices,
        addItem,
        removeItem,
        totalItemCount,
        isItemSelected,
        getItemQuantity,
        updateAllItemPricesForTier,
        estimatedSubtotal,
    };
}