import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './api/mock';
import setupRouterGuard from './router/cookie.js'; // 引入路由守卫
Vue.use(ElementUI);
setupRouterGuard();

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	created() {
		store.commit('addMenu', router);
	},
	render: (h) => h(App),
}).$mount('#app');
