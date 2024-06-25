import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";

const routes = [
  {
    path: "/signin",
    name: "SignIn",
    component: () => import("../pages/SignIn.vue"),
    meta: {}
  },
  {
    path: "/",
    name: "Game",
    component: () => import("../pages/Game.vue"),
    meta: {}
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from) => {
  const store = useAuthStore();
  if(!store.isAuthenticated && to.name !== "SignIn") {
    console.log("You're not logged in. Routing to signin.")
    return { name: "SignIn" }
  }
})

export default router;