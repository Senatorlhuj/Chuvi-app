import { ref } from 'vue';

// The centralized state for all toasts
const toasts = ref([]);
let nextToastId = 0;

/**
 * Main function to create a toast
 * @param {string} message - The message to show in the toast
 * @param {'success' | 'error' | 'info' | 'warning'} type - The type of toast (default = success)
 * @param {number} duration - How long the toast should be visible (in ms)
 */
export function showToast(message, type = 'success', duration = 3000) {
  const id = nextToastId++;

  const newToast = {
    id,
    message,
    type,
    isVisible: false, // Start hidden for transition effect
  };

  toasts.value.push(newToast);

  // Enable the slide-in transition
  setTimeout(() => {
    const toastIndex = toasts.value.findIndex(t => t.id === id);
    if (toastIndex !== -1) {
      toasts.value[toastIndex].isVisible = true;
    }
  }, 10);

  // Automatically remove the toast after duration
  setTimeout(() => {
    removeToast(id);
  }, duration);
}

/**
 * Fades out and removes a toast.
 * @param {number} id - The ID of the toast to remove.
 */
export function removeToast(id) {
  const toastIndex = toasts.value.findIndex(t => t.id === id);
  if (toastIndex !== -1) {
    toasts.value[toastIndex].isVisible = false;
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }, 300); // must match your Toast.vue transition duration
  }
}

/**
 * Convenience wrappers for common toast types
 */
export function showSuccess(message, duration = 3000) {
  showToast(message, 'success', duration);
}

export function showError(message, duration = 3000) {
  showToast(message, 'error', duration);
}

export function showInfo(message, duration = 3000) {
  showToast(message, 'info', duration);
}

export function showWarning(message, duration = 3000) {
  showToast(message, 'warning', duration);
}

/**
 * Exposes the toast state and management functions.
 */
export function useToast() {
  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}
