<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="text-gray-700">
      <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
        Title <span class="text-red-500">*</span>
      </label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.title }"
        placeholder="Enter task title"
      />
      <p v-if="errors.title" class="mt-1 text-sm text-red-600">
        {{ errors.title }}
      </p>
    </div>

    <div>
      <label
        for="category"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Category <span class="text-red-500">*</span>
      </label>
      <select
        id="category"
        v-model="form.category_id"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        :class="{ 'border-red-500': errors.category_id }"
      >
        <option value="">Select a category</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
      <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">
        {{ errors.category_id }}
      </p>
    </div>

    <div>
      <label
        for="description"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Description
      </label>
      <textarea
        id="description"
        v-model="form.description"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        :class="{ 'border-red-500': errors.description }"
        placeholder="Enter task description (optional)"
      ></textarea>
      <p v-if="errors.description" class="mt-1 text-sm text-red-600">
        {{ errors.description }}
      </p>
    </div>

    <div>
      <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
        Task Image
      </label>
      <div
        class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
      >
        <div class="space-y-1 text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="flex text-sm text-gray-600">
            <label
              for="image"
              class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Upload a file</span>
              <input
                id="image"
                ref="imageInput"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="sr-only"
              />
            </label>
            <p class="pl-1">or drag and drop</p>
          </div>
          <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      <div v-if="form.image_url && form.image_url.trim()" class="mt-4">
        <img
          :src="form.image_url"
          alt="Task image preview"
          class="h-32 w-32 object-cover rounded-md border border-gray-300"
        />
        <button
          type="button"
          @click="removeImage"
          class="mt-2 text-sm text-red-600 hover:text-red-500"
        >
          Remove image
        </button>
      </div>

      <p v-if="errors.image_url" class="mt-1 text-sm text-red-600">
        {{ errors.image_url }}
      </p>
    </div>

    <div>
      <label
        for="priority"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Priority
      </label>
      <select
        id="priority"
        v-model="form.priority"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        :class="{ 'border-red-500': errors.priority }"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <p v-if="errors.priority" class="mt-1 text-sm text-red-600">
        {{ errors.priority }}
      </p>
    </div>

    <div>
      <label
        for="due_date"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Due Date
      </label>
      <input
        id="due_date"
        v-model="form.due_date"
        type="date"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        :class="{ 'border-red-500': errors.due_date }"
        :min="today"
      />
      <p v-if="errors.due_date" class="mt-1 text-sm text-red-600">
        {{ errors.due_date }}
      </p>
    </div>

    <div v-if="isEditMode">
      <div class="flex items-center">
        <input
          id="completed"
          v-model="form.completed"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label for="completed" class="ml-2 block text-sm text-gray-900">
          Mark as completed
        </label>
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :disabled="loading"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading || !isFormValid"
      >
        <span v-if="loading" class="flex items-center">
          <svg
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Saving...
        </span>
        <span v-else>{{ isEditMode ? "Update Task" : "Create Task" }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

const props = defineProps({
  task: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const isEditMode = computed(() => !!props.task);

const form = ref({
  title: "",
  description: "",
  priority: "medium",
  category_id: "",
  due_date: "",
  completed: false,
  image_url: "",
});

const errors = ref({});

const today = computed(() => {
  return new Date().toISOString().split("T")[0];
});

const isFormValid = computed(() => {
  return (
    form.value.title.trim() &&
    form.value.category_id &&
    Object.keys(errors.value).length === 0
  );
});

onMounted(() => {
  if (props.task) {
    form.value = {
      title: props.task.title || "",
      description: props.task.description || "",
      priority: props.task.priority || "medium",
      category_id: props.task.category_id || "",
      due_date: props.task.due_date || "",
      completed: props.task.completed || false,
      image_url: props.task.image_url || "",
    };
  }
});

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      form.value = {
        title: newTask.title || "",
        description: newTask.description || "",
        priority: newTask.priority || "medium",
        category_id: newTask.category_id || "",
        due_date: newTask.due_date || "",
        completed: newTask.completed || false,
        image_url: newTask.image_url || "",
      };
    }
  },
  { immediate: true }
);

const validateForm = () => {
  errors.value = {};

  if (!form.value.title.trim()) {
    errors.value.title = "Title is required";
  } else if (form.value.title.length > 255) {
    errors.value.title = "Title must be less than 255 characters";
  }

  if (!form.value.category_id) {
    errors.value.category_id = "Category is required";
  }

  if (form.value.description && form.value.description.length > 1000) {
    errors.value.description = "Description must be less than 1000 characters";
  }

  if (form.value.due_date) {
    const dueDate = new Date(form.value.due_date);
    const todayDate = new Date(today.value);
    if (dueDate < todayDate) {
      errors.value.due_date = "Due date cannot be in the past";
    }
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (validateForm()) {
    const taskData = { ...form.value };

    if (!taskData.description.trim()) {
      delete taskData.description;
    }
    if (!taskData.due_date) {
      delete taskData.due_date;
    }

    emit("submit", taskData);
  }
};

watch(
  () => form.value.title,
  () => {
    if (errors.value.title) {
      validateForm();
    }
  }
);

watch(
  () => form.value.category_id,
  () => {
    if (errors.value.category_id) {
      validateForm();
    }
  }
);

watch(
  () => form.value.description,
  () => {
    if (errors.value.description) {
      validateForm();
    }
  }
);

watch(
  () => form.value.due_date,
  () => {
    if (errors.value.due_date) {
      validateForm();
    }
  }
);

const imageInput = ref(null);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith("image/")) {
      errors.value.image_url = "Please select a valid image file";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      errors.value.image_url = "Image size must be less than 10MB";
      return;
    }

    delete errors.value.image_url;

    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.image_url = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  form.value.image_url = "";
  if (imageInput.value) {
    imageInput.value.value = "";
  }
};
</script>

<style scoped>
input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.border-red-500:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
