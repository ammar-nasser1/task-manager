<template>
  <div class="min-h-screen bg-gray-50 flex">
    <DashSideBar ref="sidebar" />

    <div class="w-full lg:ps-64">
      <DashHeader @toggle-sidebar="toggleSidebar" />

      <main class="flex-1 w-full">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DashSideBar from "../components/DashSideBar.vue";
import DashHeader from "../components/DashHeader.vue";

const sidebar = ref(null);

const toggleSidebar = () => {
  if (sidebar.value) {
    sidebar.value.openSidebar();
  }
};
</script>

<style scoped></style>
