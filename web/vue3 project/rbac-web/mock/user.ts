function createUserList() {
	return {
		status: 0,
		data: [
			{
				token: 'Admin Token',
				id: '612805d558f2a8590020008',
				username: 'test1',
				name: '测试用户1',
				password: '1234',
				role_id: '1212345678',
				phone: '13411234567',
				create_time: 16789269969,
				_v: 0,
				role: {
					id: '66e0a59a6e3402f8edfee',
					name: '管理员',
					menus: ['/home', '/user', '/role', '/school', '/major', '/student', '/class'],
					create_time: 167869690752,
					_v: 0,
					auth_time: 167852409064,
					auth_name: 'test1',
				},
			},
			{
				token: 'System Token',
				id: 'c005e0c893647a6e55b4a03',
				username: 'admin',
				password: 'admin',
				create_time: 1678347462199,
				_v: 0,
				role: {
					menus: [],
				},
			},
		],
	};
}
export default [
	//也就是说，第一个对象是用来判断用户能不能登录，如果能给予token（通行证）
	//而第二个对象是用来当登陆之后，根据第一个对象给予的token来判断你的权限，渲染不同的页面
	//当我点击登录时同时触发两个url进行两个response判断是否能登陆和token判断用户的权限
	//用户登录接口
	{
		url: '/mock/login', //请求地址
		method: 'post', //请求方式
		response: ({ body }) => {
			const { username, password } = body;
			//通过解构的形式获取前端传递的账号名和密码
			const checkUser = createUserList().data.find((item) => {
				return item.username === username && item.password === password;
			});
			//利用find方法遍历data看是否有符合的账号密码，如果没有返回undefinded
			if (!checkUser) {
				//失败
				return {
					status: 1,
					message: '账号或密码错误',
				};
			} else {
				//成功
				const { token } = checkUser;
				return {
					status: 0,
					message: { token },
				};
			}
		},
	},
	//第二部分 获取用户信息
	{
		url: '/mock/user/info',
		method: 'get',
		response: (request) => {
			// 从请求头中获取用户token
			const token = request.headers.token;

			// 在模拟用户列表中查找匹配token的用户
			const user = createUserList().data.find((item) => item.token === token);

			// 验证token有效性并返回对应结果
			if (!user) {
				return {
					status: 1,
					message: '无效的token，获取用户信息失败',
				};
			}

			// 提取用户信息和角色权限数据
			const { username, name, role, phone, create_time } = user;

			// 返回完整用户信息（包含角色和权限）
			//type中userInfoResponseData
			return {
				status: 0,
				data: {
					username,
					name,
					phone,
					create_time,
					role: {
						id: role.id,
						name: role.name,
						menus: role.menus,
					},
				},
			};
		},
	},
];
