import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import ProjectPage from "../pages/ProjectPage.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  {
    path: "/project/:id",
    name: "ProjectPage",
    component: ProjectPage,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
