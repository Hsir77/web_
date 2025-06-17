import request from '@/utills/request';

import type {
	studentInfoData,
	studentResponseData,
	studentAllResponseData,
	studentListResponseData,
	studentListFormData,
	studentYearResponseData,
} from './type';

// 项目学员相关的请求地址
//@ts-ignore
enum API {
	STUDENT_ALL_URL = '/manage/student/all',
	STUDENT_LIST_URL = '/manage/student/list',
	STUDENT_ADD_URL = '/manage/student/add',
	STUDENT_GET_ID_URL = '/manage/student/find',
	STUDENT_UPDATE_URL = '/manage/student/update',
	STUDENT_DELETE_URL = '/manage/student/delete',
	STUDENT_MONTH_DAY_URL = '/manage/student/date',
}

// 获取所有学员
export const reqStudentAll = () => request.get<any, studentAllResponseData>(API.STUDENT_ALL_URL);
// 获取学员列表（分页）
export const reqStudentList = (data: studentListFormData) =>
	request.post<any, studentListResponseData>(API.STUDENT_LIST_URL, data);
// 添加学员
export const reqStudentAdd = (data: studentInfoData) =>
	request.post<any, studentResponseData>(API.STUDENT_ADD_URL, data);
// 根据_id查询学员
export const reqStudentById = (_id: string) =>
	request.get<any, studentResponseData>(API.STUDENT_GET_ID_URL + `?_id=${_id}`);
// 更新学员信息
export const reqStudentUpdate = (data: studentInfoData) =>
	request.post<any, studentResponseData>(API.STUDENT_UPDATE_URL, data);
// 删除学员
export const reqStudentDelete = (studentId: string) =>
	request.post<any, studentResponseData>(API.STUDENT_DELETE_URL, { studentId });
// 根据年份查询每月学生数量
export const reqStudentDate = (year: number) =>
	request.post<any, studentYearResponseData>(API.STUDENT_MONTH_DAY_URL, { year });
