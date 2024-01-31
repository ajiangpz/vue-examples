import './assets/base.css';
import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
const app = createApp(App);
import ffmpegPlugin from '@/plugins/ffmpegPlugin';

app
  .use(router)
  .use(createPinia())
  .use(ElementPlus)
  .use(ffmpegPlugin)
  .mount('#app');
