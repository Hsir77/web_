import request from '@/utills/request';

import type {
	classInfoData,
	classResponseData,
	classAllResponseData,
	classListResponseData,
	classListFormData,
} from './type';

// 项目班级相关的请求地址
//@ts-ignore
enum API {
	CLASS_ALL_URL = '/manage/class/all',
	CLASS_LIST_URL = '/manage/class/list',
	CLASS_ADD_URL = '/manage/class/add',
	CLASS_GET_ID_URL = '/manage/class/find',
	CLASS_UPDATE_URL = '/manage/class/update',
	CLASS_DELETE_URL = '/manage/class/delete',
}

// 获取所有班级
export const reqClassAll = () => request.get<any, classAllResponseData>(API.CLASS_ALL_URL);
// 获取班级列表（分页）
export const reqClassList = (data: classListFormData) =>
	request.post<any, classListResponseData>(API.CLASS_LIST_URL, data);
// 添加班级
export const reqClassAdd = (data: classInfoData) => request.post<any, classResponseData>(API.CLASS_ADD_URL, data);
// 根据_id查询班级
export const reqClassById = (_id: string) => request.get<any, classResponseData>(API.CLASS_GET_ID_URL + `?_id=${_id}`);
// 更新班级信息
export const reqClassUpdate = (data: classInfoData) => request.post<any, classResponseData>(API.CLASS_UPDATE_URL, data);
// 删除班级
export const reqClassDelete = (classId: string) =>
	request.post<any, classResponseData>(API.CLASS_DELETE_URL, { classId });
