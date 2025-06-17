// 创建用户相关的小仓库
import { defineStore } from 'pinia';
// 引入接口
import { reqClassAll, reqClassList, reqClassAdd, reqClassById, reqClassUpdate, reqClassDelete } from '@/api/class';
// 引入数据类型
import type {
	classInfoData,
	classListFormData,
	classResponseData,
	classAllResponseData,
	classListResponseData,
} from '@/api/class/type';
// 引入state返回对象类型
import type { ClassState } from '../types/type';

// 创建班级小仓库
let useClassStore = defineStore('Class', {
	// 这里使用选择式Api写法
	// 存储数据位置
	// 指定state函数返回值类型为ClassState
	state: (): ClassState => {
		return {
			classes: [],
		};
	},

	// 异步逻辑
	actions: {
		async getClassAll() {
			let result: classAllResponseData = await reqClassAll();
			if (result.status === 0) {
				this.classes = result.data as classInfoData[];
				// 当前async函数返回一个成功的promise
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},

		async getClassList(data: classListFormData) {
			let result: classListResponseData = await reqClassList(data);
			if (result.status === 0) {
				this.classes = result.data?.data as classInfoData[];
				// 当前async函数返回一个成功的promise
				return result.data;
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},

		async addClass(data: classInfoData) {
			let result: classResponseData = await reqClassAdd(data);
			if (result.status === 0) {
				// 当前async函数返回一个成功的promise
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},

		async getClassById(_id: string) {
			let result: classResponseData = await reqClassById(_id);
			if (result.status === 0) {
				// 当前async函数返回一个成功的promise
				return result.data;
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},

		async updateClass(data: classInfoData) {
			let result: classResponseData = await reqClassUpdate(data);
			if (result.status === 0) {
				// 当前async函数返回一个成功的promise
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},

		async deleteClass(classId: string) {
			let result: classResponseData = await reqClassDelete(classId);
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
export default useClassStore;
