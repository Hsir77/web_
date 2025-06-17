(function () {
	const routes = [
		{
			path: '/',
			component: appHome,
		},
		{
			path: '/news',
			component: news,
			// children
			children: [
				{
					path: '/news/sport',
					component: sport,
					children: [
						{
							// 占位符 用来获取路径地址后面携带的参数 相当于给路径里面添加一个变量
							// 这个变量用来获取 路径传递的参数
							// 写法:id id是自定义的
							path: '/news/sport/sportItem/:id',
							component: sportItem,
						},
					],
				},
				{
					path: '/news/tech',
					component: tech,
					children: [
						{
							// 占位符 用来获取路径地址后面携带的参数 相当于给路径里面添加一个变量
							// 这个变量用来获取 路径传递的参数
							// 写法:id id是自定义的
							path: '/news/tech/techItem/:id',
							component: techItem,
						},
					],
				},
			],
		},
		{
			path: '/about',
			component: about,
		},
	];
	window.router = new VueRouter({
		routes,
		linkActiveClass: 'active',
	});
})();
