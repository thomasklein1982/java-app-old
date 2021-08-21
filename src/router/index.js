import { createWebHistory, createRouter } from "vue-router";
import StartScreen from "../components/StartScreen.vue";
import EditorScreen from "../components/EditorScreen.vue";

const routes = [
  {
    path: "/",
    name: "Start",
    component: StartScreen,
  },
  {
    path: "/editor/",
    name: "Editor",
    component: EditorScreen,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;