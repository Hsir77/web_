import { ref } from 'vue';
import userUserStore from '@/stroe/modules/user';
import useRoleStore from '@/stroe/modules/role';
import type { userInfoData } from '@/api/user/type';
import type { roleInfoData } from '@/api/role/type';

export default function () {
	let userStore = userUserStore();
	let roleStore = useRoleStore();

	// 存储教师角色ID
	let teacher_role_id = ref<string | undefined>('');
	// 存储学管角色ID
	let manager_role_id = ref<string | undefined>('');

	// 存储教师的数组
	let teacherOptions = ref<userInfoData[] | undefined>([]);

	// 存储学管数组
	let managerOptions = ref<userInfoData[] | undefined>([]);

	// 存储用户列表数组
	let userOptions = ref<userInfoData[] | undefined>([]);

	// 获取用户列表 从小仓库中进行读取
	const getUserList = () => {
		// 如果小仓库中users有值  可以直接将小仓库中users中值的存储到userOp
		// 如果小仓库中users没有值，发送axios接口
		if (userStore.users?.length) {
			userOptions.value = userStore.users;
		} else {
			userStore.getUserAll().then(() => {
				userOptions.value = userStore.users as userInfoData[];
			});
		}
	};
	const getRoleList = () => {
		if (roleStore.roles?.length) {
			roleStore.roles.forEach((item) => {
				if (item.name === '教师') {
					teacher_role_id.value = item._id;
				} else if (item.name === '学管') {
					manager_role_id.value = item._id;
				}
			});
		} else {
			roleStore.roleList().then(() => {
				roleStore.roles?.forEach((item) => {
					if (item.name === '教师') {
						teacher_role_id.value = item._id;
					} else if (item.name === '学管') {
						manager_role_id.value = item._id;
					}
				});
			});
		}
	};
	const getClassUser = () => {
		// 用户小仓库中 users有值
		if (userStore.users?.length) {
			// jiang
			userStore.users.forEach((item) => {
				if (teacher_role_id.value == item.role_id) {
					teacherOptions.value?.push(item);
				} else if (manager_role_id.value == item.role_id) {
					managerOptions.value?.push(item);
				}
			});
		} else {
			userStore.getUserAll().then(() => {
				userStore.users?.forEach((item) => {
					// 判断 教师id 和users中的数组中角色id进行匹配
					if (teacher_role_id.value == item.role_id) {
						// 如果相等 将数组中的对象 添加到教师数组中
						teacherOptions.value?.push(item);
					} else if (manager_role_id.value == item.role_id) {
						managerOptions.value?.push(item);
					}
				});
			});
		}
	};
	//格式化数据
	const resetClass = (row: any, column: any, cellValue: any, index: number) => {
		let role = userOptions?.value?.find((item) => {
			return item._id == cellValue;
		});
		return role?.name;
	};

	return { teacherOptions, managerOptions, getUserList, getRoleList, getClassUser, resetClass };
}
