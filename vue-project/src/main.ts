import './assets/base.css';
import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import installIcon from '@/plugins/icons'
const app = createApp(App);

app.use(router).use(createPinia()).use(ElementPlus).use(installIcon).mount('#app');
