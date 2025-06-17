import request from '@/utills/request';

import type {
	majorInfoData,
	majorResponseData,
	majorAllResponseData,
	majorListResponseData,
	majorListFormData,
} from './type';

// 项目专业相关的请求地址
//@ts-ignore
enum API {
	MAJOR_ALL_URL = '/manage/major/all',
	MAJOR_LIST_URL = '/manage/major/list',
	MAJOR_ADD_URL = '/manage/major/add',
	MAJOR_GET_ID_URL = '/manage/major/find',
	MAJOR_UPDATE_URL = '/manage/major/update',
	MAJOR_DELETE_URL = '/manage/major/delete',
}

// 获取所有专业
export const reqMajorAll = () => request.get<any, majorAllResponseData>(API.MAJOR_ALL_URL);

// 获取专业列表（分页）
export const reqMajorList = (data: majorListFormData) =>
	request.post<any, majorListResponseData>(API.MAJOR_LIST_URL, data);

// 添加专业
export const reqMajorAdd = (data: majorInfoData) => request.post<any, majorResponseData>(API.MAJOR_ADD_URL, data);

// 根据_id查询专业
export const reqMajorById = (_id: string) => request.get<any, majorResponseData>(`${API.MAJOR_GET_ID_URL}?_id=${_id}`);

// 更新专业信息
export const reqMajorUpdate = (data: majorInfoData) => request.post<any, majorResponseData>(API.MAJOR_UPDATE_URL, data);

// 删除专业
export const reqMajorDelete = (majorId: string) =>
	request.post<any, majorResponseData>(API.MAJOR_DELETE_URL, { majorId });
