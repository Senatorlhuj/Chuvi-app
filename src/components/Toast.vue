<template>
  <div class="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
    <transition-group
      name="toast"
      tag="div"
      class="flex flex-col gap-3"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="w-96 pointer-events-auto"
      >
        <div
          :class="[
            'relative overflow-hidden rounded-xl shadow-2xl border backdrop-blur-md bg-opacity-95 p-4',
            'transition-all duration-300 ease-out',
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
          ]"
        >
          <!-- Gradient accent bar -->
          <div
            :class="[
              'absolute left-0 top-0 h-full w-1',
              toast.type === 'success'
                ? 'bg-gradient-to-b from-emerald-400 to-emerald-500'
                : 'bg-gradient-to-b from-red-400 to-red-500'
            ]"
          />

          <div class="flex items-start gap-4 pl-2">
            <!-- Icon -->
            <div
              :class="[
                'flex-shrink-0 mt-0.5 p-2 rounded-lg',
                toast.type === 'success'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-red-100 text-red-600'
              ]"
            >
              <font-awesome-icon
                :icon="[
                  'fas',
                  toast.type === 'success' ? 'check-circle' : 'exclamation-circle'
                ]"
                class="text-lg"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h3
                :class="[
                  'font-semibold text-sm',
                  toast.type === 'success'
                    ? 'text-emerald-900'
                    : 'text-red-900'
                ]"
              >
                {{ toast.type === 'success' ? 'Success' : 'Error' }}
              </h3>
              <p class="text-sm text-slate-600 mt-1">
                {{ toast.message }}
              </p>
            </div>

            <!-- Close button -->
            <button
              @click="removeToast(toast.id)"
              class="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1"
              :aria-label="`Close ${toast.type} notification`"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast, removeToast } from '@/composables/useToast';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const { toasts } = useToast();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-move {
  transition: transform 0.3s ease-out;
}
</style>