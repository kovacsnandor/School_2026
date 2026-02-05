import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: (route) => "Főoldal",
        breadcrumb: "Főoldal"
      },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/AboutView.vue"),
      meta: {
        title: (route) => "Rólunk",
        breadcrumb: "Rólunk"
      },
    },
    {
      path: "/adatok",
      name: "adatok",
      component: () => import("@/views/EmptyWrapperView.vue"),
      meta: {
        breadcrumb: "Adatok",
        disabled: true,
      },
      children: [
        {
          path: "sport",
          name: "sport",
          component: () => import("@/views/SportView.vue"),
          meta: {
            title: (route) => "Sport",
            breadcrumb: "Sport"
          },
        },
        {
          path: "schoolclass",
          name: "schoolclass",
          component: () => import("@/views/SchoolClasssView.vue"),
          meta: {
            title: (route) => "Osztály",
            breadcrumb: "Osztály"
          },
        },
        {
          path: "student",
          name: "student",
          component: () => import("@/views/StudentView.vue"),
          meta: {
            title: (route) => "Tanuló",
            breadcrumb: "Tanuló"
          },
        },
        {
          path: "plaingsport",
          name: "plaingsport",
          component: () => import("@/views/PlayngSportView.vue"),
          meta: {
            title: (route) => "Sportolás",
            breadcrumb: "Sportolás"
          },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        title: (route) => "Login",
        breadcrumb: "Login"
      },
    },

    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/404.vue"),
      meta: {
        title: (route) => "404",
        breadcrumb: ""
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = "Valami - " + to.meta.title(to);
  //mehetsz tovább az oldalra
  next();
});

export default router;
