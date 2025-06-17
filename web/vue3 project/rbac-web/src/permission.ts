//路由拦截 (路由守卫)
//当用户没有登录的时候，禁止访问访问其他页面
//依据：userstore中的user或localstorage中的loginResponseData

//beforeEach
//vue-router提供的api
//参数1（to）：即将要进入的路由对象
//参数2（from）：导航即将离开的对象
//参数3（next）：调用方法进入目标路由

import router from './router';
import pinia from './stroe';
import userUserStore from './stroe/modules/user';
//在组件外部调用小仓库需要将大仓库作为实参传递进小仓库的方法中
let userStore = userUserStore(pinia);

router.beforeEach((to, from, next) => {
	const user = userStore.user;
	//user._id保险
	if (user && user._id) {
		if (to.path == '/login') {
			next({ path: '/' });
		} else {
			next();
		}
	} else {
		if (to.path == '/login') {
			next();
		} else {
			next({ path: '/login' });
		}
	}
});
