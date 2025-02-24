import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Antd from 'ant-design-vue';

store.dispatch('restoreAuth').then(() => {
  createApp(App)
    .use(store)
    .use(Antd)
    .use(router)
    .mount('#app');
});