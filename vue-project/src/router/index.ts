import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '@/views/404.vue';
import VideoEdit from '@/components/VideoEdit.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'VideoEdit',
      component: VideoEdit,
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFound,
    },
  ],
});

export default router;
