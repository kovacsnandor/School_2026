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
        title: (route) => "Home",
      },
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/AboutView.vue"),
      meta: {
        title: (route) => "About",
      },
    },
    {
      path: "/adatok",
      name: "adatok",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/EmptyWrapperView.vue"),
      meta: {},
      children: [
        {
          path: "sport",
          name: "sport",
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("@/views/SportView.vue"),
          meta: {
            title: (route) => "Sport",
          },
        },
        {
          path: "schoolclass",
          name: "schoolclass",
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("@/views/SchoolClasssView.vue"),
          meta: {
            title: (route) => "Osztály",
          },
        },
        {
          path: "student",
          name: "student",
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("@/views/StudentView.vue"),
          meta: {
            title: (route) => "Tanuló",
          },
        },
        {
          path: "plaingsport",
          name: "plaingsport",
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("@/views/PlayngSportView.vue"),
          meta: {
            title: (route) => "Sportolás",
          },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/404.vue"),
      meta: {
        title: (route) => "404",
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
