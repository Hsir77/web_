// 服务器返回学员信息中data选项的数据类型获取学员列表接口需要携带参数ts类型
export interface studentInfoData {
	_id?: string | null;
	name: string;
	gender: string;
	school?: string;
	major?: string;
	grade?: string;
	education?: string;
	direction: string;
	id_number?: string;
	phone: string;
	parent?: string;
	parent_phone?: string;
	address?: string;
	qq?: string;
	class: string;
	admission_date?: string;
	teacher_id: string;
	manager_id: string;
	pictures?: string[];
	note?: string;
	__v?: number;
	stage?: string;
}

// 获取学员列表接口需要携带参数ts类型
export interface studentListFormData {
	page: number;
	size: number;
	searchMap: searchMapData;
}

// 学员条件查询中searchMap数据类型
interface searchMapData {
	teacher_id?: string;
	manager_id?: string;
}

// 学员信息接口返回数据类型
export interface studentResponseData {
	status: number;
	data?: studentInfoData;
	msg?: string;
}

// 获取所有用户接口返回数据类型
export interface studentAllResponseData {
	status: number;
	data?: studentInfoData[];
	msg?: string;
}

// 获取用户列表接口返回数据类型
export interface studentListResponseData {
	status: number;
	data?: studentListData;
	msg?: string;
}

// 学员列表data数据类型
interface studentListData {
	data: studentInfoData[];
	total: number;
}
export interface monthData {
	_id: string;
	count: number;
}
export interface studentYearResponseData {
	status: number;
	data: monthData[];
}
