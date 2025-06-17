// 1、引入axios
import axios from 'axios';

// 2、提示消息框
import { ElMessage, ElLoading, ElNotification } from 'element-plus';
import userUserStore from '@/stroe/modules/user';

let request = axios.create({
	// 请求的路径地址
	// 请求地址路径比如登录：/mock/login  发送请求的时候 可以直接写login
	// baseURL: '/mock',
	baseURL: import.meta.env.VITE_APP_BASE_API,
	// import.meta.env.VITE_APP_BASE_API
	timeout: 5000, // 设置响应时间  超出5秒后就失败
});

// 拦截器
const getMenus = () => {
	let userStore = userUserStore();

	const roleId = userStore.user?.role_id;
	// 当前登录的用户权限列表
	const userMenus = userStore.user?.role?.menus;
	// 如果当前登录的用户是超级管理员则不需要校验
	if (userStore.user?.name === 'admin') {
		return;
	}
	// 发送请求获取当前角色id对应的权限列表
	request({
		url: '/menus',
		method: 'post',
		data: {
			roleId,
		},
	}).then((response) => {
		const resp = response;
		if (resp.status === 0) {
			// 最新的权限列表
			const menus = resp.data.menus;
			// 先判断当前登录用户的权限列表和最新的权限列表长度是否相同，如果相等还需要判断里面的每个元素是否相同
			if (userMenus?.length === menus.length) {
				// 循环遍历当前登录用户的权限列表，同时判断每个元素是否在最新权限列表中存在，如果不存在证明被修改过
				userMenus?.forEach((item) => {
					if (menus.indexOf(item) === -1) {
						userStore.removeUser();
						ElMessage({
							message: '当前登录的用户权限被修改，请重新登录',
							type: 'warning',
						});
						// 跳转到登录页面
						window.location.href = '/login';
					}
				});
			} else {
				// 如果不同则代表权限被修改过需要重新登录
				userStore.removeUser();
				ElMessage({
					message: '当前登录的用户权限被修改，请重新登录',
					type: 'warning',
				});
				// 跳转到登录页面
				window.location.href = '/login';
			}
		}
		return;
	});
};
const loading: any = {
	loadingInstance: null, // 实例对象

	open() {
		if (this.loadingInstance == null) {
			this.loadingInstance = ElLoading.service({
				text: '拼命加载中...',
				background: 'rgba(0,0,0,0.5)',
				target: '.main',
			});
		}
	},

	close() {
		if (this.loadingInstance !== null) {
			this.loadingInstance.close();
			this.loadingInstance = null;
		}
	},
};
// 添加请求拦截器
request.interceptors.request.use(
	function (config) {
		// 在发送请求之前做点什么
		if (config.url !== '/menus' && config.url !== '/login') {
			loading.open();
			getMenus();
		}
		return config;
	},
	function (error) {
		// 处理请求错误
		return Promise.reject(error);
	},
);

// 添加响应拦截器
request.interceptors.response.use(
	function (response) {
		// 任何在2xx范围内的状态代码都会触发此功能
		// 处理响应数据
		const resp = response.data;
		if (resp.status !== 0) {
			ElNotification({
				title: '警告！',
				// @ts-ignore
				message: resp.msg,
				type: 'error',
			});
		}
		loading.close();
		return response.data;
	},
	function (error) {
		// 任何超出2xx范围的状态代码都会触发此功能
		// 处理响应错误
		loading.close();

		let msg = '';
		let status = error.response.status; //请求失败状态码
		switch (status) {
			case 401:
				msg = 'token过期';
				break;
			case 403:
				msg = '无权访问';
				break;
			case 404:
				msg = '请求地址错误';
				break;
			case 500:
				msg = '服务器错误';
				break;
			default:
				msg = '无网络';
		}
		ElMessage.error(msg);
		return Promise.reject(error);
	},
);

// 因为这是封装的方法 如果外部需要使用 必须进行对外暴露
export default request;
