<template>
  <div class="min-h-screen p-4 md:p-8" style="background-color: #F5F1ED;">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold" style="color: #1A3A52;">
              System Notifications
            </h2>
            <p class="text-sm mt-2" style="color: #6B7280;">
              Manage and track all your system notifications
            </p>
          </div>
          <button
            @click="handleMarkAllRead"
            :disabled="loading.markAll || !notifications.length"
            class="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer whitespace-nowrap"
            style="background-color: #8B7355; color: #FFFBF7;"
          >
            <font-awesome-icon icon="fa-solid fa-check-double" class="mr-2" />
            {{ loading.markAll ? 'Marking All...' : 'Mark All as Read' }}
          </button>
        </div>
        <div class="h-1 w-16" style="background-color: #1A3A52;"></div>
      </div>

      <!-- Filters Section -->
      <div class="mb-6 rounded-lg p-4 md:p-6 shadow-sm" style="background-color: #FFFBF7; border: 1px solid #E5DDD5;">
        <h3 class="text-sm font-semibold mb-4" style="color: #1A3A52;">Filter Notifications</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="text-xs font-medium block mb-2" style="color: #374151;">Read Status</label>
            <select
              v-model="filters.read"
              @change="fetchNotifications(1)"
              class="w-full p-2 border rounded-md text-sm transition-colors"
              style="border-color: #E5DDD5; color: #1A3A52; background-color: #FFFBF7;"
            >
              <option value="">All</option>
              <option value="false">Unread Only</option>
              <option value="true">Read Only</option>
            </select>
          </div>
          
          <div>
            <label class="text-xs font-medium block mb-2" style="color: #374151;">Type</label>
            <select
              v-model="filters.type"
              @change="fetchNotifications(1)"
              class="w-full p-2 border rounded-md text-sm transition-colors"
              style="border-color: #E5DDD5; color: #1A3A52; background-color: #FFFBF7;"
            >
              <option value="">All Types</option>
              <option value="order">Order</option>
              <option value="status">Status Update</option>
              <option value="referral">Referral</option>
              <option value="system">System</option>
              <option value="issue">Issue</option>
              <option value="reminder">Reminder</option>
            </select>
          </div>

          <div class="sm:col-span-2 lg:col-span-2 flex flex-col justify-end">
            <div class="p-2 rounded-md" style="background-color: #F9F7F4;">
              <p class="text-xs font-medium" style="color: #6B7280;">Showing</p>
              <p class="text-lg font-bold mt-1" style="color: #1A3A52;">
                {{ notifications.length }} of {{ totalNotifications }} 
                <span class="text-sm font-normal" style="color: #6B7280;">on page {{ currentPage }}/{{ totalPages }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading.fetch" class="flex flex-col items-center justify-center py-20">
        <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin text-5xl mb-4" style="color: #8B7355;" />
        <p class="text-lg" style="color: #6B7280;">Loading notifications...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!notifications.length"
        class="p-12 rounded-lg text-center"
        style="background-color: #FFFBF7; border: 2px dashed #E5DDD5;"
      >
        <font-awesome-icon icon="fa-solid fa-inbox" class="text-5xl mb-4" style="color: #D4A574;" />
        <p class="text-lg font-semibold" style="color: #374151;">
          No notifications found
        </p>
        <p class="text-sm mt-2" style="color: #6B7280;">
          No notifications match your current filter criteria
        </p>
      </div>

      <!-- Notifications List -->
      <div v-else class="space-y-3">
        <div
          v-for="notif in notifications"
          :key="notif._id"
          class="p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          :style="{ 
            backgroundColor: '#FFFBF7',
            borderLeft: notif.read ? '4px solid #E5DDD5' : '4px solid #D4A574',
            opacity: notif.read ? 0.85 : 1,
          }"
          @click="handleMarkRead(notif)"
        >
          <div class="flex gap-4">
            <!-- Icon -->
            <div 
              class="p-3 rounded-lg flex-shrink-0 h-fit" 
              :style="{ backgroundColor: notif.read ? '#F9F7F4' : '#FEF9F3' }"
            >
              <font-awesome-icon 
                :icon="getIconForType(notif.type)" 
                class="text-lg md:text-xl" 
                :style="{ color: notif.read ? '#9CA3AF' : '#D4A574' }"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <h4 
                  class="font-bold text-base md:text-lg leading-tight" 
                  :style="{ color: notif.read ? '#6B7280' : '#1A3A52' }"
                >
                  {{ notif.title }}
                </h4>
                <span 
                  class="text-xs font-medium flex-shrink-0" 
                  style="color: #9CA3AF;"
                >
                  {{ formatDate(notif.createdAt) }}
                </span>
              </div>

              <p 
                class="text-sm leading-relaxed mb-3" 
                style="color: #374151;"
              >
                {{ notif.message }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium" 
                  :style="{ 
                    backgroundColor: notif.read ? '#E5DDD5' : '#1A3A52',
                    color: notif.read ? '#6B7280' : '#FFFBF7'
                  }"
                >
                  {{ notif.type.toUpperCase() }}
                </span>
                <span 
                  v-if="notif.user" 
                  class="px-3 py-1 rounded-full text-xs font-medium" 
                  style="background-color: #F9F7F4; color: #1A3A52;"
                >
                  👤 {{ notif.user.fullName || notif.user.email }}
                </span>
                <span 
                  v-if="!notif.read" 
                  class="px-3 py-1 rounded-full text-xs font-medium" 
                  style="background-color: #D4A574; color: #FFFBF7;"
                >
                  ● Unread
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1 && !loading.fetch" class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
        <button
          @click="fetchNotifications(currentPage - 1)"
          :disabled="currentPage === 1 || loading.fetch"
          class="px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity cursor-pointer"
          style="background-color: #1A3A52; color: #FFFBF7;"
        >
          <font-awesome-icon icon="fa-solid fa-chevron-left" class="mr-2" />
          Previous
        </button>

        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold" style="color: #1A3A52;">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
        </div>

        <button
          @click="fetchNotifications(currentPage + 1)"
          :disabled="currentPage === totalPages || loading.fetch"
          class="px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity cursor-pointer"
          style="background-color: #1A3A52; color: #FFFBF7;"
        >
          Next
          <font-awesome-icon icon="fa-solid fa-chevron-right" class="ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from "@/composables/useToast";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { 
    adminGetAllNotifications, 
    markAdminNotificationAsRead, 
    markAllAdminNotificationsAsRead 
} from "@/services/api.js";

const { showSuccess, showError } = useToast();

// State Initialization
const notifications = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalNotifications = ref(0);
const loading = ref({
    fetch: true,
    mark: false,
    markAll: false,
});
const filters = ref({
    read: '',
    type: '',
});

// Utility Functions
const getIconForType = (type) => {
    switch (type) {
        case 'order': return 'fa-solid fa-receipt';
        case 'status': return 'fa-solid fa-rotate';
        case 'referral': return 'fa-solid fa-users';
        case 'issue': return 'fa-solid fa-triangle-exclamation';
        case 'reminder': return 'fa-solid fa-bell';
        case 'system':
        default: return 'fa-solid fa-circle-info';
    }
};

const formatDate = (dateString) => {
    try {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleTimeString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return 'Invalid Date';
    }
};

// Fetch Notifications
const fetchNotifications = async (page = 1) => {
    loading.value.fetch = true;
    try {
        const queryParams = {
            page: page,
            limit: 20,
        };
        if (filters.value.read !== '') queryParams.read = filters.value.read;
        if (filters.value.type) queryParams.type = filters.value.type;
        
        const queryString = new URLSearchParams(queryParams).toString();

        const response = await adminGetAllNotifications(queryString);
        
        notifications.value = response.notifications || [];
        currentPage.value = response.currentPage || 1;
        totalPages.value = response.totalPages || 1;
        totalNotifications.value = response.total || 0;

    } catch (err) {
        console.error("Failed to fetch notifications:", err);
        showError("Failed to load notifications.");
        notifications.value = [];
    } finally {
        loading.value.fetch = false;
    }
};

// Mark Single Notification as Read
const handleMarkRead = async (notif) => {
    if (notif.read) return;

    loading.value.mark = true;
    try {
        await markAdminNotificationAsRead(notif._id);
        
        const index = notifications.value.findIndex(n => n._id === notif._id);
        if (index !== -1) {
            notifications.value[index].read = true;
        }

        showSuccess('Notification marked as read.');
    } catch (err) {
        console.error("Failed to mark as read:", err);
        showError("Failed to mark notification as read.");
    } finally {
        loading.value.mark = false;
    }
};

// Mark All Notifications as Read
const handleMarkAllRead = async () => {
    loading.value.markAll = true;
    try {
        await markAllAdminNotificationsAsRead();
        
        notifications.value.forEach(n => {
            n.read = true;
        });

        showSuccess('All notifications marked as read.');
    } catch (err) {
        console.error("Failed to mark all as read:", err);
        showError("Failed to mark all notifications as read.");
    } finally {
        loading.value.markAll = false;
    }
};

// Fetch on Mount
onMounted(() => {
    fetchNotifications();
});
</script>