// src/composables/useNotifications.js
import { ref, computed } from "vue";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/services/api.js";

const notifications = ref([]);

export function useNotifications() {
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

  async function fetchNotifications() {
    const res = await getNotifications();
    notifications.value = res.notifications || [];
  }

  async function markOneAsRead(id) {
    await markNotificationAsRead(id);
    const n = notifications.value.find(x => x._id === id);
    if (n) n.read = true;
  }

  async function markAllRead() {
    await markAllNotificationsAsRead();
    notifications.value.forEach(n => (n.read = true));
  }

  return { notifications, unreadCount, fetchNotifications, markOneAsRead, markAllRead };
}
