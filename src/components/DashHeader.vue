<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
    <div class="flex items-center justify-between px-4 py-3 lg:px-6">
      <div class="flex items-center space-x-4">
        <!-- toggleSidebar button in mobile -->
        <button
          @click="toggleSidebar"
          class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-900 lg:text-2xl">
            Task Manager
          </h1>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const showUserMenu = ref(false);
const showMobileSearch = ref(false);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value;
};

const toggleSidebar = () => {
  emit("toggle-sidebar");
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const emit = defineEmits(["toggle-sidebar"]);
</script>
