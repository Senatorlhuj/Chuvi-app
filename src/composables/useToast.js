import { ref, readonly } from 'vue';

// Global state for toasts
const toasts = ref([]);
let nextId = 0; // Simple counter for unique IDs
const TOAST_TIMEOUT = 4000; // 4 seconds

// Function to add a toast
function addToast(type, message, timeout = TOAST_TIMEOUT) {
    const id = nextId++;
    const newToast = {
        id,
        type, // 'success' or 'error'
        message,
        isVisible: false, // Start invisible for animation
    };

    // Add toast to array
    toasts.value.push(newToast);

    // 1. Show the toast (allow time for DOM render before setting isVisible=true)
    setTimeout(() => {
        const index = toasts.value.findIndex(t => t.id === id);
        if (index !== -1) {
            toasts.value[index].isVisible = true;
        }
    }, 10);

    // 2. Hide and remove toast after timeout
    const timer = setTimeout(() => {
        // Start fade out animation
        removeToast(id, true);
    }, timeout);

    newToast.timer = timer; // Store timer for manual removal
}

// Function to remove a toast with fade out animation
function removeToast(id, isTimed = false) {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index === -1) return;

    // Clear the auto-hide timer if it exists (for manual close)
    if (toasts.value[index].timer) {
        clearTimeout(toasts.value[index].timer);
    }

    // Start fade out animation
    toasts.value[index].isVisible = false;

    // Remove from DOM after transition time (300ms from CSS)
    setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
    }, 300);
}

// Expose public functions and state
export function useToast() {
    return {
        toasts: readonly(toasts),
        showSuccess: (message, timeout) => addToast('success', message, timeout),
        showError: (message, timeout) => addToast('error', message, timeout),
    };
}

// Also export removeToast for manual closing inside the Toast.vue component
export { removeToast };