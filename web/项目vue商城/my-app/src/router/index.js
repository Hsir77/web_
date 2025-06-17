import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from '../views/Main.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'main',
		component: Main,
		children: [
			// {
			// 	path: 'user',
			// 	name: 'user',
			// 	component: () => import('../views/User.vue'),
			// },
			// {
			// 	path: 'home',
			// 	name: 'home',
			// 	component: () => import('../views/Home.vue'),
			// },
			// {
			// 	path: 'mall',
			// 	name: 'mall',
			// 	component: () => import('../views/Mall.vue'),
			// },
			// {
			// 	path: 'page1',
			// 	name: 'page1',
			// 	component: () => import('../views/PageOne.vue'),
			// },
			// {
			// 	path: 'page2',
			// 	name: 'page2',
			// 	component: () => import('../views/PageTwo.vue'),
			// },
		],
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/Login.vue'),
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
