import { createRouter, createWebHistory } from "vue-router";
import TaskDashLayout from "../layout/TaskDashLayout.vue";
import TaskList from "../views/TaskList.vue";
const routes = [
  {
    path: "/",
    component: TaskDashLayout,
    children: [
      {
        path: "",
        name: "TaskList",
        component: TaskList,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
