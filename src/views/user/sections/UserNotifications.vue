<template>
  <main class="min-h-screen pt-16 px-4" :style="{ backgroundColor: 'var(--color-bone-white)' }">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 
          class="text-4xl font-bold mb-2" 
          :style="{ color: 'var(--color-navy-blue)', fontFamily: 'var(--font-display)' }"
        >
          Notifications
        </h1>
        <p :style="{ color: 'var(--color-charcoal)' }">Stay updated with your latest activity</p>
      </div>

      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-2">
          <span 
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            :style="{ backgroundColor: 'var(--color-cream)', color: 'var(--color-navy-blue)' }"
          >
            {{ unreadCount }}
            <span class="ml-1">{{ unreadCount === 1 ? 'unread' : 'unread' }}</span>
          </span>
        </div>
        
        <button
          v-if="notifications.length && unreadCount > 0"
          @click="markAllRead"
          class="text-sm font-medium transition-colors px-4 py-2 rounded-lg"
          :style="{ color: 'var(--color-charcoal)', backgroundColor: 'var(--color-cream)' }"
        >
          Mark all as read
        </button>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="flex flex-col items-center gap-3">
          <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin text-3xl" :style="{ color: 'var(--color-golden-brown)' }" />
          <p :style="{ color: 'var(--color-charcoal)' }" class="text-sm">Loading notifications...</p>
        </div>
      </div>

      <div v-else class="space-y-3">
        <div
          v-if="!notifications.length"
          class="flex flex-col items-center justify-center py-16 px-6 rounded-xl"
          :style="{ backgroundColor: 'var(--color-cream)' }"
        >
          <div 
            class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            :style="{ backgroundColor: 'var(--color-bone-white)' }"
          >
            <font-awesome-icon icon="fa-solid fa-bell" class="text-3xl" :style="{ color: 'var(--color-charcoal)' }" />
          </div>
          <p :style="{ color: 'var(--color-navy-blue)' }" class="font-medium text-center">All caught up! 🎉</p>
          <p :style="{ color: 'var(--color-charcoal)' }" class="text-sm text-center mt-1">You have no notifications yet.</p>
        </div>

        <transition-group name="notification" tag="div" class="space-y-3">
          <div
            v-for="n in notifications"
            :key="n._id"
            @click="markOneAsRead(n)"
            :class="[
              'group relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-200 border backdrop-blur-sm',
            ]"
            :style="{
              backgroundColor: n.read ? 'var(--color-cream)' : 'var(--color-bone-white)',
              borderColor: n.read ? 'var(--color-cream)' : 'var(--color-golden-brown)',
              boxShadow: n.read ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.05)',
            }"
          >
            <div class="relative flex items-start gap-4">
              <div class="flex-shrink-0 pt-1">
                <div
                  :class="[
                    'w-2.5 h-2.5 rounded-full transition-all',
                    n.read ? 'bg-transparent' : 'shadow-lg'
                  ]"
                  :style="{ 
                    backgroundColor: n.read ? 'var(--color-charcoal)' : 'var(--color-pure-gold)',
                  }"
                />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      :class="['font-semibold transition-colors']"
                      :style="{ color: n.read ? 'var(--color-charcoal)' : 'var(--color-navy-blue)' }"
                    >
                      {{ n.title }}
                    </h3>
                    <p
                      :class="['text-sm mt-1 transition-colors']"
                      :style="{ color: n.read ? 'var(--color-charcoal)' : 'var(--color-charcoal)' }"
                    >
                      {{ n.message }}
                    </p>
                  </div>

                  <button
                    @click.stop="markOneAsRead(n)"
                    v-if="!n.read"
                    class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    :style="{ color: 'var(--color-charcoal)' }"
                  >
                    <font-awesome-icon icon="fa-solid fa-xmark" class="w-5 h-5" />
                  </button>
                </div>

                <p class="text-xs mt-2" :style="{ color: 'var(--color-charcoal)' }">
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
// Ensure you have updated the api.js paths for these functions!
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/services/api.js"; 
// Assuming useNotifications includes the GET function and state
import { useNotifications } from "@/composables/useNotifications";
// Import icons for use in template (needs main.js setup)
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const { notifications, unreadCount, fetchNotifications } = useNotifications();
const loading = ref(false);

// Format time relative to now (Logic is good, kept as is)
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
/* Transition styles are good, kept as is */
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