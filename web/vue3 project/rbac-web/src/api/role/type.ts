//接口约束 角色列表 进行约束
export interface roleInfoData {
	_id?: string;
	name: string;
	menus?: string[];
	create_time: number;
	__v: number;
	auth_name?: string;
	auth_time?: number;
}
//获取角色列表返回的数据
export interface getRoleListResponseData {
	status: number;
	data?: roleInfoData[];
	msg?: string;
}
