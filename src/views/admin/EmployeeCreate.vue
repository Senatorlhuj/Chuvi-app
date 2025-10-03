<template>
  <div class="p-6  min-h-[80vh]">
    <h2 class="text-3xl font-bold text-navy-blue mb-6 border-b pb-2">
      Manage Employees
    </h2>

    <div class="max-w-xl mx-auto bg-bone-white p-8 rounded-xl mb-10">
      <form @submit.prevent="handleCreateEmployee" class="space-y-6">
        <h3 class="text-xl font-semibold text-navy-blue mb-4">
          Create New Employee
        </h3>

        <FormField
          label="Employee Full Name"
          type="text"
          v-model="employeeData.fullName"
          placeholder="e.g., Adebowale Victor"
          required
        />

        <FormField
          label="Phone Number"
          type="tel"
          v-model="employeeData.phone"
          placeholder="e.g., 07082713287"
          required
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-navy-blue text-bone-white py-3 rounded-md font-semibold text-lg hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ loading ? "Processing..." : "Create Employee Account" }}
        </button>
      </form>
    </div>

    <div class="border-t pt-8">
      <h3 class="text-2xl font-bold text-navy-blue mb-4">
        Existing Employees ({{ employees.length }})
      </h3>

      <p v-if="loadingEmployees" class="text-charcoal/70">
        Loading employees...
      </p>
      <p
        v-else-if="!employees.length"
        class="text-charcoal/70 p-4 bg-bone-white rounded-md"
      >
        No employees found.
      </p>

      <div v-else class="bg-bone-white p-6 rounded-xl bg-white">
        <div
          class="grid grid-cols-4 gap-4 p-2 text-sm font-bold border-b-2 border-charcoal/50 mb-2 text-navy-blue"
        >
          <span>Employee Name</span>
          <span>Phone Number</span>
          <span>Employee ID</span>
          <span class="text-right">Actions</span>
        </div>

        <div
          v-for="employee in employees"
          :key="employee._id"
          class="grid grid-cols-4 gap-4 items-center p-2 text-sm font-semibold text-charcoal even:bg-cream rounded-md"
        >
          <span class="truncate">{{ employee.fullName }}</span>
          <span class="truncate">{{ employee.phone }}</span>
          <code class="truncate font-mono text-xs text-charcoal">{{
            employee._id
          }}</code>
          <div class="flex justify-end">
            <button
              @click="prepareDelete(employee._id, employee.fullName)"
              :disabled="loading"
              class="text-charcoal hover:text-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              title="Delete Employee"
            >
              <font-awesome-icon icon="fa-solid fa-trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div
      v-if="employeeToDeleteId"
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-bone-white p-6 rounded-lg max-w-sm w-full">
        <h3 class="text-xl font-bold text-red-700 mb-3">
          Confirm Deletion
        </h3>
        <p class="text-charcoal mb-4">
          Are you sure you want to remove **{{ employeeToDeleteName }}**? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelDelete"
            class="px-4 py-2 bg-gray-300 text-charcoal rounded-md hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteConfirm"
            :disabled="loading"
            class="px-4 py-2 bg-red-700 text-bone-white rounded-md hover:bg-red-500 disabled:opacity-50 cursor-pointer"
          >
            {{ loading ? "Deleting..." : "Yes, Delete" }}
          </button>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FormField from "@/components/atoms/FormField.vue";
// NOTE: Now importing the new deleteEmployee function
import { createEmployee, getEmployees, deleteEmployee } from "@/services/api.js"; 
import { useToast } from "@/composables/useToast";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"; // <-- Ensure this is imported for the icon

const { showSuccess, showError } = useToast();

// --- STATE ---
const employeeData = ref({
  phone: "",
  fullName: "",
});

const employees = ref([]);
const loadingEmployees = ref(true);
const loading = ref(false);

// State for Delete Confirmation Modal
const employeeToDeleteId = ref(null);
const employeeToDeleteName = ref('');

// --- DELETE HANDLERS ---

const prepareDelete = (id, fullName) => {
    employeeToDeleteId.value = id;
    employeeToDeleteName.value = fullName;
};

const cancelDelete = () => {
    employeeToDeleteId.value = null;
    employeeToDeleteName.value = '';
};

const handleDeleteConfirm = async () => {
    const id = employeeToDeleteId.value;
    const name = employeeToDeleteName.value;
    
    if (!id) return;
    
    loading.value = true;
    cancelDelete(); // Close modal immediately

    try {
        await deleteEmployee(id);
        
        // Remove from local list to update UI instantly
        employees.value = employees.value.filter(emp => emp._id !== id);
        
        showSuccess(`Employee **${name}** removed successfully.`);
    } catch (err) {
        console.error("Employee deletion error:", err);
        let apiError = 'An unknown server error occurred.';
        try {
            const parsed = JSON.parse(err.message);
            apiError = parsed.message || parsed.error || err.message;
        } catch (e) {
            apiError = err.message || apiError;
        }
        showError(`Deletion Failed: ${apiError}`);
    } finally {
        loading.value = false;
    }
};


// --- API FUNCTIONS ---

// 1. Fetch Existing Employees on Component Load
const fetchEmployees = async () => {
    loadingEmployees.value = true;
    try {
        const response = await getEmployees();
        // Simplified response handling: ensure it's an array
        const list = Array.isArray(response) ? response : (response && Array.isArray(response.employees) ? response.employees : []);
        employees.value = list;

    } catch (err) {
        console.error("Failed to fetch employees:", err);
        showError("Failed to load employee data.");
    } finally {
        loadingEmployees.value = false;
    }
};

// 2. Handle Creation of a New Employee
const handleCreateEmployee = async () => {
    loading.value = true;
    try {
        const response = await createEmployee(employeeData.value);
        if (response && response._id && response.fullName) {
            employees.value.unshift(response);
            showSuccess(`Employee **${response.fullName}** added successfully!`);
            
            // Clear the form
            employeeData.value.phone = "";
            employeeData.value.fullName = "";
        } else {
            showError("Employee created, but the server response was incomplete.");
        }
    } catch (err) {
        console.error("Employee creation error:", err);
        let apiError = err.message || "An unknown error occurred.";
        try {
            const parsed = JSON.parse(err.message);
            apiError = parsed.message || parsed.error || err.message;
        } catch (e) {
            // Fallback to raw message
        }
        showError(`Creation Failed: ${apiError}`);
    } finally {
        loading.value = false;
    }
};

// --- LIFECYCLE HOOK ---
onMounted(fetchEmployees);
</script>