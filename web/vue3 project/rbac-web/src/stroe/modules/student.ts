// 创建用户相关的小仓库
import { defineStore } from 'pinia';
// 引入接口
import {
	reqStudentAll,
	reqStudentList,
	reqStudentAdd,
	reqStudentById,
	reqStudentUpdate,
	reqStudentDelete,
} from '@/api/student';
// 引入数据类型
import type {
	studentInfoData,
	studentListFormData,
	studentResponseData,
	studentAllResponseData,
	studentListResponseData,
} from '@/api/student/type';
// 引入state返回对象类型
import type { StudentState } from '../types/type';

// 创建学员小仓库
let useStudentStore = defineStore('Student', {
	// 这里使用选择式Api写法
	// 存储数据位置
	// 指定state函数返回值类型为StudentState
	state: (): StudentState => {
		return {
			students: [],
		};
	},

	// 异步逻辑
	actions: {
		async getStudentAll() {
			let result: studentAllResponseData = await reqStudentAll();
			if (result.status === 0) {
				this.students = result.data as studentInfoData[];
				// 当前async函数返回一个成功的promise
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},

		async getStudentList(data: studentListFormData) {
			let result: studentListResponseData = await reqStudentList(data);
			if (result.status === 0) {
				this.students = result.data?.data as studentInfoData[];
				// 当前async函数返回一个成功的promise
				return result.data;
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},

		async addStudent(data: studentInfoData) {
			let result: studentResponseData = await reqStudentAdd(data);
			if (result.status === 0) {
				// 当前async函数返回一个成功的promise
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},

		async getStudentById(_id: string) {
			let result: studentResponseData = await reqStudentById(_id);
			if (result.status === 0) {
				// 当前async函数返回一个成功的promise
				return result.data;
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},

		async updateStudent(data: studentInfoData) {
			let result: studentResponseData = await reqStudentUpdate(data);
			if (result.status === 0) {
				// 当前async函数返回一个成功的promise
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},

		async deleteStudent(studentId: string) {
			let result: studentResponseData = await reqStudentDelete(studentId);
			if (result.status === 0) {
				// 当前async函数返回一个成功的promise
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
	},

	// 计算属性
	getters: {},
});

// 对外暴露获取小仓库方法
export default useStudentStore;
