//不用mock模拟后不存在token（通行证），也不需要以token判断权限，则接口约束需要重写，

// 登录接口需要携带参数ts类型

export interface loginFormData {
	username: string;
	password: string;
}

// 登录接口返回数据类型
export interface loginResponseData {
	status: number;
	data?: userInfoData;
	msg?: string;
}

// 角色数据类型
export interface userRoleData {
	_id?: string;
	name?: string;
	menus?: string[];
	create_time?: number;
	__v?: number;
	auth_time?: number;
	auth_name?: string;
	//用户页新增约束
}

// 服务器返回用户信息中data选项的数据类型
export interface userInfoData {
	token?: string;
	_id?: string | null | undefined;
	username?: string;
	name?: string;
	password?: string;
	phone?: string;
	role_id?: string;
	create_time?: number;
	__v?: number;
	role?: userRoleData;
}
//校验（修改）密码数据类型
export interface pwdData {
	userId: string;
	password: string;
}
//校验(修改)密码返回数据类型
export interface checkPwdResponseData {
	status: number;
	data?: userInfoData;
	msg?: string;
}
/********************************** */
//定义用户接口约束
export interface userAllResponseData {
	status: number;
	data: userInfoData[];
	msg?: string;
}
//用户列表分页
export interface userListFormData {
	page: number;
	size: number;
}
export interface userListResponseData {
	status: number;
	data?: userListData;
	msg?: string;
}
interface userListData {
	data: userInfoData[];
	total: number;
	role: [];
}
