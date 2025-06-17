// 创建用户相关的小仓库
import { defineStore } from 'pinia';
// 引入接口
import { reqMajorAll, reqMajorList, reqMajorAdd, reqMajorById, reqMajorUpdate, reqMajorDelete } from '@/api/major';
// 引入数据类型
import type {
	majorInfoData,
	majorListFormData,
	majorResponseData,
	majorAllResponseData,
	majorListResponseData,
} from '@/api/major/type';
// 引入state返回对象类型
import type { MajorState } from '../types/type';

// 创建专业小仓库
let useMajorStroe = defineStore('Major', {
	// 这里使用选择式Api写法
	// 存储数据位置
	// 指定state函数返回值类型为MajorState
	state: (): MajorState => {
		return {
			majors: [],
		};
	},

	// 异步逻辑
	actions: {
		//获取专业所有列表
		async getMajorAll() {
			let result: majorAllResponseData = await reqMajorAll();
			if (result.status === 0) {
				this.majors = result.data as majorInfoData[];
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//获取专业列表（分页）
		async getMajorList(data: majorListFormData) {
			let result: majorListResponseData = await reqMajorList(data);
			if (result.status === 0) {
				this.majors = result.data?.data as majorInfoData[];
				return result.data;
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//添加
		async addMajor(data: majorInfoData) {
			let result: majorResponseData = await reqMajorAdd(data);
			if (result.status === 0) {
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//通过id查找
		async getMajorById(_id: string) {
			let result: majorResponseData = await reqMajorById(_id);
			if (result.status === 0) {
				return result.data;
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//编辑
		async updateMajor(data: majorInfoData) {
			let result: majorResponseData = await reqMajorUpdate(data);
			if (result.status === 0) {
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//删除
		async deleteMajor(majorId: string) {
			let result: majorResponseData = await reqMajorDelete(majorId);
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
export default useMajorStroe;
