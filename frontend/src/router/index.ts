import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import TasksPage from '../pages/TasksPage.vue';
import AnalyticsPage from '../pages/AnalyticsPage.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: TasksPage },
  { path: '/analytics', component: AnalyticsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
