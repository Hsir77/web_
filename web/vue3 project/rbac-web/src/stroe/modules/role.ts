//定义角色小仓库
import { defineStore } from 'pinia';
import type { roleInfoData, getRoleListResponseData } from '@/api/role/type';
import { getRoleList, addRole, updateRole } from '@/api/role';
import type { RoleState } from '../types/type';

let useRoleStore = defineStore('role', {
	state: (): RoleState => {
		return {
			roles: [],
		};
	},
	actions: {
		async roleList() {
			let result: getRoleListResponseData = await getRoleList();
			if (result.status == 0) {
				this.roles = result.data;
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//创建角色
		async useAddRole(data: any) {
			let result: getRoleListResponseData = await addRole(data);
			if (result.status == 0) {
				this.roles = result.data;
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
		//设置角色权限

		async useUpdateRole(data: roleInfoData) {
			let result: getRoleListResponseData = await updateRole(data);
			if (result.status == 0) {
				this.roles = result.data;
				return 'OK';
			} else {
				return Promise.reject(new Error(result.msg));
			}
		},
	},
});
export default useRoleStore;
