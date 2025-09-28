<template>
  <div
    class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
  >
    <div class="relative h-48 bg-gray-200">
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
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
      </div>
      <div
        v-if="imageError"
        class="absolute inset-0 flex items-center justify-center bg-gray-100"
      >
        <svg
          class="w-12 h-12 text-gray-400"
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
      </div>

      <div class="absolute top-3 left-3">
        <span
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
          :style="{ backgroundColor: getCategoryColor() }"
        >
          <img
            v-if="category?.icon_url"
            :src="category.icon_url"
            :alt="category.name"
            class="w-3 h-3 mr-1"
          />
          {{ category?.name || "Uncategorized" }}
        </span>
      </div>

      <div class="absolute top-3 right-3">
        <button
          @click="toggleCompletion"
          class="p-1 rounded-full transition-colors duration-200"
          :class="
            task.completed
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-400 hover:text-green-500'
          "
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="p-4">
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
          {{ task.title }}
        </h3>
        <span
          :class="getPriorityClass()"
          class="text-xs font-medium px-2 py-1 rounded-full"
        >
          {{ formatPriority(task.priority) }}
        </span>
      </div>

      <p
        v-if="task.description"
        class="text-gray-600 text-sm mb-3 line-clamp-2"
      >
        {{ task.description }}
      </p>

      <div v-if="task.due_date" class="flex items-center text-sm mb-3">
        <svg
          class="w-4 h-4 mr-1"
          :class="getDueDateColor()"
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
        <span :class="getDueDateColor()">{{ formatDate(task.due_date) }}</span>
      </div>

      <div
        class="flex items-center justify-between pt-3 border-t border-gray-100"
      >
        <button
          @click="$emit('view', task)"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
        >
          View Details
        </button>
        <div class="flex space-x-2">
          <button
            @click="$emit('edit', task)"
            class="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            <svg
              class="w-4 h-4"
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
            class="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <svg
              class="w-4 h-4"
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

const emit = defineEmits(["view", "edit", "delete", "toggle-completion"]);

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

const formatPriority = (priority) => {
  if (!priority) return "Normal";
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const getDueDateColor = () => {
  if (!props.task.due_date) return "text-gray-500";

  const dueDate = new Date(props.task.due_date);
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "text-red-500";
  if (diffDays <= 2) return "text-orange-500";
  return "text-gray-500";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays === -1) return "Due yesterday";
  if (diffDays < -1) return `Overdue by ${Math.abs(diffDays)} days`;
  if (diffDays <= 7) return `Due in ${diffDays} days`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
