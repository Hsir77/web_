// 创建用户相关的小仓库
import { defineStore } from 'pinia';
// 引入接口
import {
	reqSchoolAll,
	reqSchoolList,
	reqSchoolAdd,
	reqSchoolById,
	reqSchoolUpdate,
	reqSchoolDelete,
} from '@/api/school';
// 引入数据类型
import type {
	schoolInfoData,
	schoolListFormData,
	schoolResponseData,
	schoolAllResponseData,
	schoolListResponseData,
} from '@/api/school/type';
// 引入state返回对象类型
import type { SchoolState } from '../types/type';

// 创建学校小仓库
let useSchoolStroe = defineStore('School', {
	// 这里使用选择式Api写法
	// 存储数据位置
	// 指定state函数返回值类型为SchoolState
	state: (): SchoolState => {
		return {
			schools: [],
		};
	},

	// 异步逻辑
	actions: {
		//获取学校所有列表
		async getSchoolAll() {
			let result: schoolAllResponseData = await reqSchoolAll();
			if (result.status === 0) {
				this.schools = result.data as schoolInfoData[];
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//获取学校列表（分页）
		async getSchoolList(data: schoolListFormData) {
			let result: schoolListResponseData = await reqSchoolList(data);
			if (result.status === 0) {
				this.schools = result.data?.data as schoolInfoData[];
				return result.data;
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//添加
		async addSchool(data: schoolInfoData) {
			let result: schoolResponseData = await reqSchoolAdd(data);
			if (result.status === 0) {
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//通过id查找
		async getSchoolById(_id: string) {
			let result: schoolResponseData = await reqSchoolById(_id);
			if (result.status === 0) {
				return result.data;
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//编辑
		async updateSchool(data: schoolInfoData) {
			let result: schoolResponseData = await reqSchoolUpdate(data);
			if (result.status === 0) {
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//删除
		async deleteSchool(schoolId: string) {
			let result: schoolResponseData = await reqSchoolDelete(schoolId);
			if (result.status === 0) {
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
export default useSchoolStroe;
