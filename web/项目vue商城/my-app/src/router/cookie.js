import router from '../router';
import Cookie from 'js-cookie';

export default function setupRouterGuard() {
	//to表示当前的页面
	router.beforeEach((to, from, next) => {
		// 判断token存不存在
		const token = Cookie.get('token');
		// token不存在，说明当前用户是未登录，应该跳转至登录页
		if (!token && to.name !== 'login') {
			next({ name: 'login' });
		} else if (token && to.name === 'login') {
			// token存在，说明用户登录，此时跳转至首页
			next({ name: 'home' });
		} else {
			next();
		}
	});
}
