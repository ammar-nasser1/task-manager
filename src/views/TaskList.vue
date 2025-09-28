<template>
  <div class="flex-1 w-full">
    <div class="py-6">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
                Task Manager
              </h1>
              <p class="mt-2 text-gray-600">
                Organize and manage your tasks efficiently
              </p>
            </div>
            <button
              @click="showAddModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Add Task
            </button>
          </div>
        </div>

        <!-- Filters and Controls -->
        <div class="mb-6 bg-white rounded-lg shadow p-4">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
          >
            <!-- Category Filter -->
            <div class="flex items-center space-x-4">
              <label
                for="category-filter"
                class="text-sm font-medium text-gray-700"
              >
                Filter by Category:
              </label>
              <select
                id="category-filter"
                v-model="selectedCategory"
                class="px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Completion Status Filter -->
            <div class="flex items-center space-x-4">
              <label
                for="status-filter"
                class="text-sm font-medium text-gray-700"
              >
                Status:
              </label>
              <select
                id="status-filter"
                v-model="selectedStatus"
                class="px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Tasks</option>
                <option value="false">Pending</option>
                <option value="true">Completed</option>
              </select>
            </div>

            <!-- Priority Filter -->
            <div class="flex items-center space-x-4">
              <label
                for="priority-filter"
                class="text-sm font-medium text-gray-700"
              >
                Priority:
              </label>
              <select
                id="priority-filter"
                v-model="selectedPriority"
                class="px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          ></div>
          <p class="mt-4 text-gray-600">Loading tasks...</p>
        </div>

        <!-- Error state -->
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-md p-4 mb-6"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Error loading tasks
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
              </div>
              <div class="mt-3">
                <button
                  @click="fetchTasks"
                  class="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Grid -->
        <div v-if="!loading && !error">
          <!-- Empty state -->
          <div v-if="tasks.length === 0" class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              No tasks found
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              {{
                hasFilters
                  ? "Try adjusting your filters or create a new task."
                  : "Get started by creating your first task."
              }}
            </p>
            <div class="mt-6">
              <button
                @click="showAddModal = true"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Task
              </button>
            </div>
          </div>

          <!-- Tasks Grid -->
          <div
            v-else
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <TaskCard
              v-for="task in tasks"
              :key="task.id"
              :task="task"
              :category="getCategoryById(task.category_id)"
              @view="viewTask"
              @edit="editTask"
              @delete="deleteTask"
              @toggle-completion="updateTask"
            />
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="currentPage > 1 || hasNextPage"
          class="mt-8 flex justify-center"
        >
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              @click="goToPreviousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <button
              @click="goToNextPage"
              :disabled="!hasNextPage"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <GenericModal
      v-model="showAddModal"
      title="Add New Task"
      size="large"
      :show-footer="false"
    >
      <TaskForm
        :categories="categories"
        :loading="formLoading"
        @submit="createTask"
        @cancel="showAddModal = false"
      />
    </GenericModal>

    <!-- Edit Task Modal -->
    <GenericModal
      v-model="showEditModal"
      title="Edit Task"
      size="large"
      :show-footer="false"
    >
      <TaskForm
        :task="selectedTask"
        :categories="categories"
        :loading="formLoading"
        @submit="updateTaskFromForm"
        @cancel="showEditModal = false"
      />
    </GenericModal>

    <!-- Task Detail Modal -->
    <GenericModal
      v-model="showDetailModal"
      :title="selectedTask?.title || 'Task Details'"
      size="xlarge"
      :show-footer="false"
    >
      <TaskDetail
        v-if="selectedTask"
        :task="selectedTask"
        :category="getCategoryById(selectedTask.category_id)"
        @back="showDetailModal = false"
        @edit="editTaskFromDetail"
        @delete="deleteTask"
        @toggle-completion="updateTask"
      />
    </GenericModal>

    <!-- Delete Confirmation Modal -->
    <GenericModal
      v-model="showDeleteModal"
      title="Delete Task"
      size="small"
      :show-footer="true"
      :show-confirm-button="true"
      :show-cancel-button="true"
      confirm-text="Delete"
      cancel-text="Cancel"
      :is-loading="deleteLoading"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    >
      <div class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"
        >
          <svg
            class="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </div>
        <p class="text-sm text-gray-500">
          Are you sure you want to delete "{{ selectedTask?.title }}"? This
          action cannot be undone.
        </p>
      </div>
    </GenericModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { api } from "/src/api/config.js";
import GenericModal from "/src/components/GenericModal.vue";
import TaskCard from "/src/components/TaskCard.vue";
import TaskForm from "/src/components/TaskForm.vue";
import TaskDetail from "/src/components/TaskDetail.vue";

// Reactive data
const loading = ref(false);
const error = ref(null);
const tasks = ref([]);
const categories = ref([]);

// Pagination
const currentPage = ref(1);
const tasksPerPage = ref(8);
const hasNextPage = ref(true);

// Filters
const selectedCategory = ref("");
const selectedStatus = ref("");
const selectedPriority = ref("");

// Modals
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const showDeleteModal = ref(false);
const selectedTask = ref(null);

// Loading states
const formLoading = ref(false);
const deleteLoading = ref(false);

// Computed properties
const hasFilters = computed(() => {
  return (
    selectedCategory.value ||
    selectedStatus.value !== "" ||
    selectedPriority.value
  );
});

// Helper functions
const getCategoryById = (categoryId) => {
  return categories.value.find((cat) => cat.id === categoryId) || null;
};

// Build query parameters for API
const buildQueryParams = () => {
  const params = new URLSearchParams();

  // Pagination
  params.append("limit", tasksPerPage.value.toString());
  params.append(
    "offset",
    ((currentPage.value - 1) * tasksPerPage.value).toString()
  );

  // Ordering
  params.append("order", "created_at.desc");

  // Filters
  if (selectedCategory.value) {
    params.append("category_id", `eq.${selectedCategory.value}`);
  }

  if (selectedStatus.value !== "") {
    params.append("completed", `eq.${selectedStatus.value}`);
  }

  if (selectedPriority.value) {
    params.append("priority", `eq.${selectedPriority.value}`);
  }

  return params.toString();
};

// API functions
const fetchTasks = async () => {
  loading.value = true;
  error.value = null;

  try {
    const queryParams = buildQueryParams();
    const response = await api.get(`tasks?${queryParams}`);

    tasks.value = response.data || [];

    // Check if there are more pages
    hasNextPage.value = tasks.value.length === tasksPerPage.value;
  } catch (err) {
    error.value = err.message || "Failed to fetch tasks";
    console.error("Error fetching tasks:", err);
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const response = await api.get("categories?order=name.asc");
    categories.value = response.data || [];
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
};

const createTask = async (taskData) => {
  formLoading.value = true;

  try {
    const response = await api.post("tasks", taskData);
    if (response.data && response.data.length > 0) {
      // Refresh the current page to show the new task
      await fetchTasks();
      showAddModal.value = false;
    }
  } catch (err) {
    console.error("Error creating task:", err);
    error.value = err.message || "Failed to create task";
  } finally {
    formLoading.value = false;
  }
};

const updateTask = async (taskData) => {
  try {
    const response = await api.patch(`tasks?id=eq.${taskData.id}`, {
      // title: taskData.title,
      // description: taskData.description,
      // priority: taskData.priority,
      // category_id: taskData.category_id,
      // due_date: taskData.due_date,
      completed: taskData.completed,
    });

    if (response.data && response.data.length > 0) {
      const updatedTask = response.data[0];
      const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }

      // Update selectedTask if it's the same task
      if (selectedTask.value && selectedTask.value.id === updatedTask.id) {
        selectedTask.value = updatedTask;
      }
    }
  } catch (err) {
    console.error("Error updating task:", err);
    error.value = err.message || "Failed to update task";
  }
};

const updateTaskFromForm = async (taskData) => {
  formLoading.value = true;

  try {
    const response = await api.patch(
      `tasks?id=eq.${selectedTask.value.id}`,
      taskData
    );

    if (response.data && response.data.length > 0) {
      const updatedTask = response.data[0];
      const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
      showEditModal.value = false;
      selectedTask.value = null;
    }
  } catch (err) {
    console.error("Error updating task:", err);
    error.value = err.message || "Failed to update task";
  } finally {
    formLoading.value = false;
  }
};

const confirmDelete = async () => {
  if (!selectedTask.value) return;

  deleteLoading.value = true;

  try {
    await api.delete(`tasks?id=eq.${selectedTask.value.id}`);

    // Remove from local state
    const index = tasks.value.findIndex((t) => t.id === selectedTask.value.id);
    if (index !== -1) {
      tasks.value.splice(index, 1);
    }

    // If current page becomes empty and it's not the first page, go to previous page
    if (tasks.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
      await fetchTasks();
    }

    showDeleteModal.value = false;
    showDetailModal.value = false;
    selectedTask.value = null;
  } catch (err) {
    console.error("Error deleting task:", err);
    error.value = err.message || "Failed to delete task";
  } finally {
    deleteLoading.value = false;
  }
};

// Event handlers
const viewTask = (task) => {
  selectedTask.value = task;
  showDetailModal.value = true;
};

const editTask = (task) => {
  selectedTask.value = task;
  showEditModal.value = true;
};

const editTaskFromDetail = (task) => {
  showDetailModal.value = false;
  setTimeout(() => {
    selectedTask.value = task;
    showEditModal.value = true;
  }, 100);
};

const deleteTask = (task) => {
  selectedTask.value = task;
  showDeleteModal.value = true;
};

// Pagination handlers
const goToNextPage = () => {
  if (hasNextPage.value) {
    currentPage.value++;
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Watch for filter changes to reset pagination and refetch
watch([selectedCategory, selectedStatus, selectedPriority], () => {
  currentPage.value = 1;
  fetchTasks();
});

// Watch for page changes to refetch
watch(currentPage, () => {
  fetchTasks();
});

// Load data when component mounts
onMounted(() => {
  fetchTasks();
  fetchCategories();
});
</script>

<style scoped>
/* Custom styles for better UX */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
