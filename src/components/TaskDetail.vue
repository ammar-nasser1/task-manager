<template>
  <div class="bg-white rounded-lg overflow-hidden">
    <div class="relative h-64 bg-gray-200">
      <img
        v-if="hasValidImageUrl && !imageError"
        :src="task.image_url"
        :alt="task.title"
        class="w-full h-full object-cover"
        @error="handleImageError"
        @load="imageLoaded = true"
      />
      <div
        v-if="imageLoading && !imageError"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
        ></div>
      </div>
      <div
        v-if="imageError"
        class="absolute inset-0 flex items-center justify-center bg-gray-100"
      >
        <div class="text-center">
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <p class="text-gray-500 text-sm">Image not available</p>
        </div>
      </div>

      <div class="absolute top-4 left-4">
        <button
          @click="$emit('back')"
          class="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all duration-200"
        >
          <svg
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
      </div>

      <div class="absolute top-4 right-4">
        <button
          @click="toggleCompletion"
          class="p-3 rounded-full shadow-md transition-all duration-200"
          :class="
            task.completed
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          "
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="p-6">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1 mr-4">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            {{ task.title }}
          </h1>
          <div class="flex items-center space-x-4">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
              :style="{ backgroundColor: getCategoryColor() }"
            >
              <img
                v-if="category?.icon_url"
                :src="category.icon_url"
                :alt="category.name"
                class="w-4 h-4 mr-2"
              />
              {{ category?.name || "Uncategorized" }}
            </span>

            <span
              :class="getPriorityClass()"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ formatPriority(task.priority) }}
            </span>

            <span
              :class="getCompletionStatusClass()"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ task.completed ? "Completed" : "Pending" }}
            </span>
          </div>
        </div>

        <div class="flex space-x-2">
          <button
            @click="$emit('edit', task)"
            class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </button>
          <button
            @click="$emit('delete', task)"
            class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <svg
              class="w-5 h-5"
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
          </button>
        </div>
      </div>

      <div v-if="task.description" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
        <p class="text-gray-700 leading-relaxed">{{ task.description }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div v-if="task.due_date" class="flex items-center">
          <div
            class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3"
          >
            <svg
              class="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Due Date</p>
            <p :class="getDueDateColor()" class="font-semibold">
              {{ formatDate(task.due_date) }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3"
          >
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Created</p>
            <p class="font-semibold text-gray-900">
              {{ formatDate(task.created_at) }}
            </p>
          </div>
        </div>

        <div
          v-if="task.updated_at && task.updated_at !== task.created_at"
          class="flex items-center"
        >
          <div
            class="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3"
          >
            <svg
              class="w-5 h-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Last Updated</p>
            <p class="font-semibold text-gray-900">
              {{ formatDate(task.updated_at) }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3"
          >
            <svg
              class="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              ></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Task ID</p>
            <p class="font-semibold text-gray-900">#{{ task.id }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  category: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["back", "edit", "delete", "toggle-completion"]);

const imageError = ref(false);
const imageLoaded = ref(false);

const hasValidImageUrl = computed(() => {
  return props.task.image_url && props.task.image_url.trim() !== "";
});

const imageLoading = computed(() => {
  return hasValidImageUrl.value && !imageLoaded.value && !imageError.value;
});

const handleImageError = () => {
  imageError.value = true;
};

const toggleCompletion = () => {
  emit("toggle-completion", {
    ...props.task,
    completed: !props.task.completed,
  });
};

const getCategoryColor = () => {
  return props.category?.color || "#6b7280";
};

const getPriorityClass = () => {
  const priority = props.task.priority?.toLowerCase();
  const classes = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };
  return classes[priority] || "bg-gray-100 text-gray-800";
};

const getCompletionStatusClass = () => {
  return props.task.completed
    ? "bg-green-100 text-green-800"
    : "bg-gray-100 text-gray-800";
};

const formatPriority = (priority) => {
  if (!priority) return "Normal";
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const getDueDateColor = () => {
  if (!props.task.due_date) return "text-gray-900";

  const dueDate = new Date(props.task.due_date);
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "text-red-600";
  if (diffDays <= 2) return "text-orange-600";
  return "text-gray-900";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  if (dateString === props.task.due_date) {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays === -1) return "Due yesterday";
    if (diffDays < -1) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays <= 7) return `Due in ${diffDays} days`;
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
