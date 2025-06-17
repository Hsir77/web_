//根据id查询学校
export interface schoolInfoData {
	_id?: string | null;
	schoolname: string;
	__v?: number;
}
//学校信息接口返回数据类型
export interface schoolResponseData {
	status: number;
	data: schoolInfoData;
	msg?: string;
}
//获取学校列表（分页）
export interface schoolListFormData {
	page: number;
	size: number;
}
//获取学校列表接受返回数据类型
export interface schoolListResponseData {
	status: number;
	msg?: string;
	data?: schoolListData;
}
//学校列表data数据类型
interface schoolListData {
	data: schoolInfoData[];
	total: number;
}
//获取所有学校返回数据类型
export interface schoolAllResponseData {
	status: number;
	data?: schoolInfoData[];
	msg?: string;
}
