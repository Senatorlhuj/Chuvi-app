<template>
  <div class="p-6 min-h-[80vh]">
    <h2
      class="text-3xl font-bold text-navy-blue mb-6 border-b pb-2"
      :style="{ fontFamily: 'var(--font-display)' }"
    >
      Manage Customer Issues
    </h2>

    <div class="pt-8">
      <h3 class="text-2xl font-bold text-navy-blue mb-4">
        All Reported Issues ({{ issues.length }})
      </h3>

      <p v-if="loading" class="text-charcoal/70">Loading issues...</p>
      <p
        v-else-if="!issues.length"
        class="text-charcoal/70 p-4 bg-bone-white rounded-md"
      >
        No reported issues found.
      </p>

      <div v-else class="bg-bone-white p-6 rounded-xl overflow-x-auto">
        <table class="min-w-full divide-y divide-charcoal/20">
          <thead class="bg-bone-white">
            <tr class="text-left text-sm font-bold text-navy-blue">
              <th class="px-3 py-3 w-[15%]">Name / Phone</th>
              <th class="px-3 py-3 w-[10%]">Order ID</th>
              <th class="px-3 py-3 w-[35%]">Latest Message</th>
              <th class="px-3 py-3 w-[15%]">Date</th>
              <th class="px-3 py-3 w-[15%]">Status</th>
              <th class="px-3 py-3 text-right w-[10%]">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-charcoal/10">
            <tr
              v-for="issue in issues"
              :key="issue._id"
              class="text-sm font-semibold hover:bg-cream transition-colors"
              :class="[
                getStatusClass(issue.status),
                loadingIssueId === issue._id ? 'opacity-60' : '',
              ]"
            >
              <!-- ✅ fullName + phone -->
              <td class="px-3 py-3">
                <div>
                  <span class="font-bold text-charcoal">{{
                    issue.fullName
                  }}</span
                  ><br />
                  <span class="text-xs text-charcoal/70">{{
                    issue.phone
                  }}</span>
                </div>
              </td>

              <!-- ✅ order.orderId (optional) -->
              <td class="px-3 py-3 text-charcoal">
                <code class="truncate font-mono text-xs">
                  {{ issue.order?.orderId || "N/A" }}
                </code>
              </td>

              <!-- ✅ show the most recent message (last in array) -->
              <td class="px-3 py-3 text-charcoal text-sm">
                {{ latestMessage(issue) }}
              </td>

              <td class="px-3 py-3 text-charcoal/80 text-xs">
                {{ formatDate(issue.createdAt) }}
              </td>

              <td class="px-3 py-3">
                <div :class="getStatusBadgeClass(issue.status)">
                  {{ formatStatus(issue.status) }}
                </div>
              </td>

              <td class="px-3 py-3 text-right">
                <button
                  @click="prepareUpdate(issue)"
                  :disabled="loadingUpdate || loadingIssueId === issue._id"
                  class="text-navy-blue hover:text-golden-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer p-1"
                  title="Update Issue"
                >
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ✅ Update Modal -->
    <div
      v-if="issueToUpdate"
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-bone-white p-6 rounded-lg max-w-lg w-full">
        <h3
          class="text-xl font-bold text-navy-blue mb-4 border-b pb-2"
          :style="{ fontFamily: 'var(--font-display)' }"
        >
          Update Issue #{{ issueToUpdate._id.slice(-6) }}
        </h3>

        <div class="bg-cream p-3 rounded-md mb-4">
          <p class="text-sm text-charcoal/90">
            <strong>Customer's Latest Message:</strong>
            {{ latestMessage(issueToUpdate) }}
          </p>
        </div>

        <form @submit.prevent="handleUpdateConfirm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-navy-blue"
              >Status</label
            >
            <CustomSelect
              v-model="updateData.status"
              :options="statusSelectOptions"
              placeholder="Select new status"
              label="Issue Status Selection"
              required
            />
          </div>

          <FormField
            label="Admin Note / Resolution (Optional)"
            type="textarea"
            v-model="updateData.adminMessage"
            placeholder="Add an admin note or resolution summary (optional)..."
          />

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="cancelUpdate"
              class="px-4 py-2 bg-charcoal/20 text-charcoal rounded-md hover:bg-charcoal/40 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loadingUpdate"
              class="px-4 py-2 bg-navy-blue text-bone-white rounded-md hover:bg-golden-brown disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {{ loadingUpdate ? "Saving..." : "Save Update" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import CustomSelect from "@/components/atoms/CustomSelect.vue";
import FormField from "@/components/atoms/FormField.vue";
import { getIssues, updateIssue } from "@/services/api.js";
import { useToast } from "@/composables/useToast";

const { showSuccess, showError } = useToast();

const issues = ref([]);
const loading = ref(true);
const loadingUpdate = ref(false);
const loadingIssueId = ref(null);

const issueToUpdate = ref(null);
const updateData = ref({
  status: "",
  adminMessage: "",
});

const statusOptions = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in Progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];
const statusSelectOptions = computed(() =>
  statusOptions.map((status) => ({
    label: status.label, // keep the nice display name
    value: status.value, // send correct lowercase value to backend
  }))
);


const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatStatus = (status) =>
  status
    .replace("_", " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

// ✅ Correctly extract the last message content
const latestMessage = (issue) => {
  if (!issue.messages || issue.messages.length === 0) return "—";
  return issue.messages[issue.messages.length - 1].content;
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "resolved":
      return "bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-xs font-bold w-fit";
    case "closed":
      return "bg-charcoal/60 text-bone-white px-3 py-1 rounded-full text-xs font-bold w-fit";
    case "in progress":
      return "bg-pure-gold/50 text-charcoal px-3 py-1 rounded-full text-xs font-bold w-fit";
    case "open":
    default:
      return "bg-destructive/20 text-destructive px-3 py-1 rounded-full text-xs font-bold w-fit";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "resolved":
      return "border-l-4 border-brand-green";
    case "closed":
      return "opacity-70 border-l-4 border-charcoal/50";
    case "in progress":
      return "border-l-4 border-golden-brown";
    case "open":
    default:
      return "border-l-4 border-destructive";
  }
};

// ✅ FIXED: getIssues() already returns the issues array
const fetchIssues = async () => {
  loading.value = true;
  try {
    const response = await getIssues();
    console.log("📦 Issues from API:", response);
    // getIssues() already extracts .issues from the response
    // response is already the array of issues
    issues.value = Array.isArray(response) ? response : response?.issues || [];
  } catch (err) {
    console.error("Failed to fetch issues:", err);
    showError("Failed to load customer issues.");
  } finally {
    loading.value = false;
  }
};

const prepareUpdate = (issue) => {
  issueToUpdate.value = issue;
  updateData.value.status = issue.status;
  updateData.value.adminMessage = "";
};

const cancelUpdate = () => {
  issueToUpdate.value = null;
  updateData.value.status = "";
  updateData.value.adminMessage = "";
};

const handleUpdateConfirm = async () => {
  const id = issueToUpdate.value.order?.orderId;
  if (!id) return;

  // ✅ FIXED: Validate that status actually changed
  if (
    updateData.value.status === issueToUpdate.value.status &&
    !updateData.value.adminMessage.trim()
  ) {
    showError("Please change the status or add an admin note.");
    return;
  }

  loadingUpdate.value = true;
  loadingIssueId.value = id;

  try {
    const payload = {
      status: updateData.value.status,
    };

    // ✅ FIXED: Only include adminMessage if it has content
    if (updateData.value.adminMessage.trim()) {
      payload.adminMessage = updateData.value.adminMessage.trim();
    }

    const response = await updateIssue(id, payload);
    // Backend returns { success: true, issue: {...} }
    const updatedIssue = response?.issue;
    if (updatedIssue) {
      const index = issues.value.findIndex((i) => i._id === id);
      if (index !== -1) issues.value[index] = updatedIssue;
      showSuccess(`Issue #${id.slice(-6)} updated successfully.`);
      cancelUpdate();
    } else {
      showError("Failed to update issue.");
    }
  } catch (err) {
    console.error("Issue update error:", err);
    showError(`Update Failed: ${err.message || "Unknown error"}`);
  } finally {
    loadingUpdate.value = false;
    loadingIssueId.value = null;
  }
};

onMounted(fetchIssues);
</script>
