import Cookie from 'js-cookie';
const state = {
	isCollapse: false,
	//面包屑中的数据
	tagLists: [
		{
			path: '/home',
			name: 'home',
			label: '首页',
			icon: 'house',
			url: 'Home',
		},
	],
	menu: [],
};
const mutations = {
	handleMenu(state) {
		state.isCollapse = !state.isCollapse;
	},
	updateTag(state, val) {
		if (val.path !== '/home') {
			const index = state.tagLists.findIndex((item) => item.name === val.name);
			if (index == -1) {
				state.tagLists.push(val);
			}
		}
	},
	deleteTag(state, item) {
		const deletaTagIndex = state.tagLists.findIndex((val) => val.name == item.name);
		state.tagLists.splice(deletaTagIndex, 1);
	},
	//设置menu里的数据用于commonaside获取
	setMenu(state, val) {
		state.menu = val;
		//将数据也存储在cookie中，若浏览器刷新页面vuex中的数据会丢失，cookie的不会
		Cookie.set('menu', JSON.stringify(val));
	},
	//动态设置路由
	addMenu(state, router) {
		// 判断缓存中是否有数据
		if (!Cookie.get('menu')) return;
		const menu = JSON.parse(Cookie.get('menu'));
		state.menu = menu;
		// 组装动态路由的数据
		const menuArray = [];
		menu.forEach((item) => {
			if (item.children) {
				item.children = item.children.map((item) => {
					item.component = () => import(`../views/${item.url}`);
					return item;
				});
				menuArray.push(...item.children);
			} else {
				item.component = () => import(`../views/${item.url}`);
				menuArray.push(item);
			}
		});
		console.log(menuArray, 'menuArray');
		// 路由的动态添加
		menuArray.forEach((item) => {
			router.addRoute('main', item);
		});
	},
};
const actions = {};
const getters = {};
export default {
	state,
	mutations,
	actions,
	getters,
};
