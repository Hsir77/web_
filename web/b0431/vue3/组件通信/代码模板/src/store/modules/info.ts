import { defineStore } from 'pinia';
let userInfoStore = defineStore('info', {
	state() {
		return {
			count: 99,
			arr: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		};
	},
	// 存储方法
	actions: {
		unpdateNum(a: number) {
			this.count += a;
		},
	},
	// 计算属性
	getters: {
		ArrAdd(): number {
			return this.arr.reduce((sum, item) => sum + item, 0);
		},
	},
});
export default userInfoStore;
