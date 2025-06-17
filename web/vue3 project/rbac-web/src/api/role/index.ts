//接口信息
//引入封装好的接口
import request from '@/utills/request';
import type { roleInfoData, getRoleListResponseData } from './type';

//定义接口地址
//@ts-ignore
enum API {
	//获取角色
	GET_ROLE_LIST_URL = '/manage/role/list',
	//添加角色
	ADD_ROLE_URL = '/manage/role/add',
	//设置角色权限
	UPDATA_ROLE_URL = '/manage/role/update',
}
//获取角色列表
export const getRoleList = () => {
	return request.get<any, getRoleListResponseData>(API.GET_ROLE_LIST_URL);
};
//添加角色列表
export const addRole = (data: any) => {
	return request.post<any, getRoleListResponseData>(API.ADD_ROLE_URL, data);
};
//设置角色权限
export const updateRole = (data: roleInfoData) => {
	return request.post<any, getRoleListResponseData>(API.UPDATA_ROLE_URL, data);
};
