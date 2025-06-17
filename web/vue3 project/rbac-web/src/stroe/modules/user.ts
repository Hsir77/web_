//用户小仓库
import { reqLogin, reqUserAdd, reqUserAll, reqUserById, reqUserDelete, reqUserList, reqUserUpdate } from '@/api/user';
import type {
	loginFormData,
	loginResponseData,
	userAllResponseData,
	userInfoData,
	userListFormData,
	userListResponseData,
} from '@/api/user/type';
import { defineStore } from 'pinia';
import type { UserState } from '../types/type';
let userUserStore = defineStore('user', {
	state: (): UserState => {
		return {
			user: JSON.parse(localStorage.getItem('loginResponseData') as string),
			users: [],
		};
	},
	actions: {
		async userLogin(data: loginFormData) {
			let result: loginResponseData = await reqLogin(data);

			//刷新页面后pinia的数据会进行初始化，导致数据丢失所以需要把数据存在浏览器中
			if (result.status === 0) {
				//@ts-ignore
				// this.token = result.message.token;
				this.user = result.data;
				localStorage.setItem('loginResponseData', JSON.stringify(result.data));
			} else {
				//@ts-ignore
				return Promise.reject(new Error(result.message));
			}
		},
		removeUser() {
			//退出登录时删除信息
			this.user = null;
			localStorage.removeItem('loginResponseData');
		},

		//------------------------------用户列表-------------------------------
		async getUserAll() {
			let result: userAllResponseData = await reqUserAll();
			if (result.status == 0) {
				this.users = result.data;
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//获取用户列表（分页）
		async getUserList(data: userListFormData) {
			let result: userListResponseData = await reqUserList(data);
			if (result.status == 0) {
				this.users = result.data?.data;
				return result.data;
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//添加用户
		async addUser(data: userInfoData) {
			let result: loginResponseData = await reqUserAdd(data);
			if (result.status == 0) {
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//更新用户
		async updateUser(data: userInfoData) {
			let result: loginResponseData = await reqUserUpdate(data);
			if (result.status == 0) {
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//删除用户
		async deleteUser(userId: userInfoData) {
			let result: loginResponseData = await reqUserDelete(userId);
			if (result.status == 0) {
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//查询用户
		async GetUserById(_id: string) {
			let result: loginResponseData = await reqUserById(_id);
			if (result.status == 0) {
				return result.data;
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
	},
	//获取所有用户列表
});
export default userUserStore;
