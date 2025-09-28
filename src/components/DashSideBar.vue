<template>
  <div class="sidebar-container h-[100vh]">
    <!-- Mobile overlay -->
    <div
      v-if="isMobile && isOpen"
      class="fixed inset-0 bg-black/30 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>

    <aside
      :class="[
        'fixed  inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out h-full',
        isMobile
          ? isOpen
            ? 'translate-x-0'
            : '-translate-x-full'
          : 'translate-x-0',
      ]"
    >
      <div
        class="flex items-center justify-between p-4 border-b border-gray-700"
      >
        <h2 class="text-xl font-bold">Task Manager</h2>
        <button
          @click="closeSidebar"
          class="lg:hidden p-2 rounded-md hover:bg-gray-700"
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
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- menu item -->
      <nav class="mt-4">
        <ul class="space-y-2 px-4">
          <li>
            <a
              href="#"
              class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg
                class="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
              Tasks
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isOpen = ref(false);
const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024;
  if (!isMobile.value) {
    isOpen.value = false;
  }
};

const closeSidebar = () => {
  isOpen.value = false;
};

const openSidebar = () => {
  isOpen.value = true;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});

defineExpose({
  openSidebar,
  closeSidebar,
});
</script>

<style scoped></style>
