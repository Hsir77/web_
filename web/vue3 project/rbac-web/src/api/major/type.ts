//根据id查询专业
export interface majorInfoData {
	_id?: string | null;
	majorname: string;
	__v?: number;
}
//专业信息接口返回数据类型
export interface majorResponseData {
	status: number;
	data: majorInfoData;
	msg?: string;
}
//获取专业列表（分页）
export interface majorListFormData {
	page: number;
	size: number;
}
//获取专业列表接受返回数据类型
export interface majorListResponseData {
	status: number;
	msg?: string;
	data?: majorListData;
}
//专业列表data数据类型
interface majorListData {
	data: majorInfoData[];
	total: number;
}
//获取所有专业返回数据类型
export interface majorAllResponseData {
	status: number;
	data?: majorInfoData[];
	msg?: string;
}
