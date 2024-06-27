import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: localStorage.getItem("token") ? "/dashboard" : "/login",
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/LoginView.vue"),
    },
    {
      path: "/workspaces",
      name: "workspaces",
      component: () => import("@/views/workspace/WorkspaceMainView.vue"),
    },
    {
      path: "/workspace/:id",
      name: "workspace",
      component: () => import("@/views/workspace/WorkspaceTableView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("@/views/DashboardView.vue"),
    },
    {
      path: "/proposals/:id",
      name: "proposals",
      component: () => import("@/views/proposals/SolutionProposalView.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("@/views/users/UserView.vue"),
    },
  ],
});

export default router;
