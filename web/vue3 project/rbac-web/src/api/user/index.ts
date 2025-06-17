//关于登录接口的api
//1、引入axios
//2、定义请求地址
//3、和请求方法
//4、传入登录的表单数据
//5、返回登录状态（成功、失败）

//1
import request from '@/utills/request';
// 对所有类型导入使用 `type` 关键字
import {
	type loginResponseData,
	type loginFormData,
	type pwdData,
	type checkPwdResponseData,
	type userAllResponseData,
	type userListFormData,
	type userInfoData,
	type userListResponseData,
} from './type';
//2
//@ts-ignore
enum API {
	//当前地址都为后端访问接口的地址不是前端url的地址
	//登录地址
	LOGIN_URL = '/login',
	//获取用户信息地址S
	// USERINFO_URL = '/user/info',
	//退出登录
	// LOGOUT_URL = '/logout',
	//修改密码
	CHECK_PWD_URL = '/manage/user/pwd',
	//校验密码
	UPDATE_PWD_URL = '/manage/user/pwd',
	/****************************************************** */
	//新增用户列表
	//获取所有用户列表
	USER_ALL_URL = '/manage/user/all',
	//获取用户列表（分页）
	USER_LIST_URL = '/manage/user/list',

	//查询用户
	USER_GET_ID_URL = '/manage/user/find',

	//添加用户
	USER_ADD_URL = '/manage/user/add',

	//删除用户
	USER_DELETE_URL = '/manage/user/delete',

	//更新用户
	USER_UPDATE_URL = '/manage/user/update',
}
export const reqLogin = (data: loginFormData) => {
	//外部通过reqLogin方法传递登录表单数据（loginFormData）进行登录通过处理后返回（loginResponseData）登录返回数据
	return request.post<any, loginResponseData>(API.LOGIN_URL, data);
	//其中loginResponseData约束的是响应结果而不是第二个参数
};
// export const reqUserInfo = (token: any) => {
// 	return request.get<any, any>(API.USERINFO_URL, token);
// };
//校验密码
export const reqCheckPwd = (data: pwdData) => {
	return request.post<any, checkPwdResponseData>(API.CHECK_PWD_URL, data);
};
//修改密码
export const reqUpdataPwd = (data: pwdData) => {
	return request.put<any, checkPwdResponseData>(API.UPDATE_PWD_URL, data);
};
/******************************************** */
//获取所有用户
export const reqUserAll = () => {
	return request.get<any, userAllResponseData>(API.USER_ALL_URL);
};
//获取用户列表（分页）
export const reqUserList = (data: userListFormData) => {
	return request.post<any, userListResponseData>(API.USER_LIST_URL, data);
};
//查询用户
export const reqUserById = (_id: string) => {
	return request.get<any, loginResponseData>(API.USER_GET_ID_URL + `?_id=${_id}`);
};
//添加用户
export const reqUserAdd = (data: userInfoData) => {
	return request.post<any, loginResponseData>(API.USER_ADD_URL, data);
};
//删除用户
export const reqUserDelete = (userId: userInfoData) => {
	return request.post<any, loginResponseData>(API.USER_DELETE_URL, { userId: userId });
};
//更新用户
export const reqUserUpdate = (data: userInfoData) => {
	return request.post<any, loginResponseData>(API.USER_UPDATE_URL, data);
};
