<template>
  <main class="min-h-screen  pt-16 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-900 mb-2">Notifications</h1>
        <p class="text-slate-600">Stay updated with your latest activity</p>
      </div>

      <!-- Action bar -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            {{ unreadCount }}
            <span class="ml-1">{{ unreadCount === 1 ? 'unread' : 'unread' }}</span>
          </span>
        </div>
        <button
          v-if="notifications.length && unreadCount > 0"
          @click="markAllRead"
          class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-200"
        >
          Mark all as read
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-3 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p class="text-slate-500 text-sm">Loading notifications...</p>
        </div>
      </div>

      <!-- Notifications list -->
      <div v-else class="space-y-3">
        <!-- Empty state -->
        <div
          v-if="!notifications.length"
          class="flex flex-col items-center justify-center py-16 px-6"
        >
          <div class="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p class="text-slate-600 font-medium text-center">All caught up!</p>
          <p class="text-slate-500 text-sm text-center mt-1">You have no notifications yet.</p>
        </div>

        <!-- Notification items -->
        <transition-group name="notification" tag="div" class="space-y-3">
          <div
            v-for="n in notifications"
            :key="n._id"
            @click="markOneAsRead(n)"
            :class="[
              'group relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-200',
              'border backdrop-blur-sm',
              n.read
                ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg hover:border-blue-300'
            ]"
          >
            <!-- Background glow for unread -->
            <div
              v-if="!n.read"
              class="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div class="relative flex items-start gap-4">
              <!-- Unread indicator dot -->
              <div class="flex-shrink-0 pt-1">
                <div
                  :class="[
                    'w-2.5 h-2.5 rounded-full transition-all',
                    n.read ? 'bg-slate-300' : 'bg-blue-500 shadow-lg shadow-blue-500/50'
                  ]"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      :class="[
                        'font-semibold transition-colors',
                        n.read ? 'text-slate-700' : 'text-slate-900'
                      ]"
                    >
                      {{ n.title }}
                    </h3>
                    <p
                      :class="[
                        'text-sm mt-1 transition-colors',
                        n.read ? 'text-slate-500' : 'text-slate-600'
                      ]"
                    >
                      {{ n.message }}
                    </p>
                  </div>

                  <!-- Close option on hover -->
                  <button
                    @click.stop="markOneAsRead(n)"
                    v-if="!n.read"
                    class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 p-1"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Timestamp -->
                <p class="text-xs text-slate-400 mt-2">
                  {{ formatTime(n.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/services/api.js";
import { useNotifications } from "@/composables/useNotifications";

const { notifications, unreadCount, fetchNotifications } = useNotifications();
const loading = ref(false);

// Format time relative to now
const formatTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(date).toLocaleDateString();
};

// Fetch notifications on mount
onMounted(async () => {
  loading.value = true;
  try {
    await fetchNotifications();
  } catch (err) {
    console.error("Error fetching notifications:", err);
  } finally {
    loading.value = false;
  }
});

// Mark one as read
async function markOneAsRead(n) {
  if (!n.read) {
    try {
      await markNotificationAsRead(n._id);
      n.read = true;
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }
}

// Mark all as read
async function markAllRead() {
  try {
    await markAllNotificationsAsRead();
    notifications.value.forEach(n => (n.read = true));
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
  }
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.notification-move {
  transition: transform 0.3s ease-out;
}
</style>