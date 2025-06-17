import { createRouter, createWebHistory } from 'vue-router';

//创建路由
let router = createRouter({
	history: createWebHistory(),
	//createWebHistory是决定用什么路由方式
	routes: [
		{
			path: '/login',
			component: () => import('@/views/login/index.vue'),
		},
		{
			path: '/',
			component: () => import('@/views/layout/index.vue'),
			name: 'layout',
			children: [
				{
					path: '/home',
					component: () => import('@/views/home/index.vue'),
					name: 'home',
				},
				{
					path: '/user',
					component: () => import('@/views/user/index.vue'),
					name: 'user',
				},
				{
					path: '/role',
					component: () => import('@/views/role/index.vue'),
					name: 'role',
				},
				{
					path: '/school',
					component: () => import('@/views/students/school.vue'),
					name: 'school',
				},
				{
					path: '/class',
					component: () => import('@/views/students/class.vue'),
					name: 'class',
				},
				{
					path: '/majors',
					component: () => import('@/views/students/majors.vue'),
					name: 'majors',
				},
				{
					path: '/student',
					component: () => import('@/views/students/student.vue'),
					name: 'student',
				},
				{
					path: '/update/student/:_id',
					component: () => import('@/views/students/components/updateStudent.vue'),
					name: 'updateStudent',
				},
			],
		},
		{
			path: '/404',
			component: () => import('@/views/404/index.vue'),
		},
		//访问不存在的页面展示404
		{
			path: '/:pathMatch(.*)*',
			redirect: '/404',
			name: 'any',
		},
	],
});
export default router;
