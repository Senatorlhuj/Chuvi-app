<template>
  <main class="pt-20 px-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-charcoal mb-4">Notifications</h1>

    <div class="flex justify-between items-center mb-4">
      <p class="text-gray-600 text-sm">
        You have {{ unreadCount }} unread notification<span v-if="unreadCount !== 1">s</span>.
      </p>
      <button
        v-if="notifications.length && unreadCount > 0"
        @click="markAllRead"
        class="text-sm text-blue-600 hover:underline"
      >
        Mark all as read
      </button>
    </div>

    <div v-if="loading" class="text-center text-gray-500">Loading...</div>

    <ul v-else class="divide-y divide-gray-200 bg-white rounded-xl">
      <li
        v-for="n in notifications"
        :key="n._id"
        class="p-4 hover:bg-gray-50 cursor-pointer transition"
        :class="{ 'bg-gray-50': !n.read }"
        @click="markOneAsRead(n)"
      >
        <div class="flex justify-between">
          <h3 class="text-gray-800 font-semibold text-sm">{{ n.title }}</h3>
          <span v-if="!n.read" class="w-2 h-2 bg-blue-500 rounded-full"></span>
        </div>
        <p class="text-gray-600 text-sm">{{ n.message }}</p>
        <p class="text-xs text-gray-400 mt-1">
          {{ new Date(n.createdAt).toLocaleString() }}
        </p>
      </li>

      <li v-if="!notifications.length" class="text-center text-gray-400 py-6">
        No notifications yet.
      </li>
    </ul>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/services/api.js";
import { useNotifications } from "@/composables/useNotifications";

const { notifications, unreadCount, fetchNotifications } = useNotifications();
const loading = ref(false);

// 🧠 Fetch all notifications on mount
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

// ✅ Mark one as read
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

// ✅ Mark all as read
async function markAllRead() {
  try {
    await markAllNotificationsAsRead();
    notifications.value.forEach(n => (n.read = true));
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
  }
}
</script>
