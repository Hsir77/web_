<template>
	<!-- 添加按钮 -->
	<div class="role_button_box">
		<el-button type="primary" @click="handleAdd">新增用户</el-button>
	</div>
	<!-- 表格 -->
	<el-table :data="users" style="width: 100%" label-width="auto">
		<el-table-column type="index" label="序号" width="100" />
		<el-table-column property="username" label="用户名" />
		<el-table-column property="name" label="姓名" />
		<el-table-column property="phone" label="电话" />
		<el-table-column property="create_time" label="创建时间" :formatter="resetDate" />
		<el-table-column property="role_id" label="所属角色" :formatter="resetRole" />

		<el-table-column label="操作">
			<template #default="scope">
				<el-button size="small" @click="handleEdit(scope.row._id)"> 编辑 </el-button>
				<el-button size="small" type="danger" @click="handleDelete(scope.row)"> 删除 </el-button>
			</template>
		</el-table-column>
	</el-table>
	<!-- 分页 -->
	<el-pagination
		v-model:current-page="currentPage"
		v-model:page-size="pageSize"
		:page-sizes="[5, 10, 15, 20]"
		:size="size"
		layout="total, sizes, prev, pager, next, jumper"
		:total="total"
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		size-text="条"
	/>
	<!-- 添加编辑用户弹窗 -->
	<el-dialog v-model="dialogFormVisible" title="用户添加/编辑" width="500">
		<el-form :model="userForm" label-width="auto" ref="userFormRef" :rules="rules">
			<el-form-item label="用户名" prop="username" v-if="userVisibale">
				<el-input v-model="userForm.username" autocomplete="off" placeholder="请输入4-12位数字字母或_" />
			</el-form-item>
			<!-- 编辑状态的用户名 -->
			<el-form-item label="用户名" v-if="!userVisibale">
				<el-input v-model="userForm.username" autocomplete="off" disabled />
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="userForm.password" autocomplete="off" placeholder="请输入4位以上密码" />
			</el-form-item>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="userForm.name" autocomplete="off" placeholder="请输入姓名" />
			</el-form-item>
			<el-form-item label="角色" prop="role_id">
				<el-select v-model="userForm.role_id" placeholder="请点击选择">
					<el-option
						v-for="option in roleOptions"
						:key="option._id"
						:label="option.name"
						:value="option._id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="手机号" prop="phone">
				<el-input v-model="userForm.phone" autocomplete="off" placeholder="请输入正确的手机号码" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<!-- 在其中进行if判断，判断userForm中有没有值，如果是编辑状态userForm绑定的是第一个username框，被if判断消失，值不存在 -->
				<el-button
					type="primary"
					@click="userForm._id == null ? confirmAdd(userFormRef) : confirmEdit(userFormRef)"
				>
					确认
				</el-button>
				<!-- 提交的数据为什么要通过ref传递进来，因为通过ref可以获取表单元素的实例，则ref具有表单校验的方法 -->
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import type { userInfoData } from '@/api/user/type';
import { formatTime } from '@/utills/weather';
import { onMounted, reactive, ref } from 'vue';
import useRoleStore from '@/stroe/modules/role';
import userUserStore from '@/stroe/modules/user';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import type { roleInfoData } from '@/api/role/type';
let userStore = userUserStore();
let roleStore = useRoleStore();

//当前显示的页码
const currentPage = ref(1);

//每页显示多少数据
const pageSize = ref(5);

const size = ref<ComponentSize>('default');

//显示当前一共有多少条数据
const total = ref(0);

//定义变量控制弹出框显示隐藏
const dialogFormVisible = ref(false);
//定义变量控制两个用户名input的显示隐藏
//为了规避编辑的校验
const userVisibale = ref(true);

//定义变量由于存储角色列表
let roleOptions = ref<roleInfoData[] | undefined>(undefined);
//定义table绑定的数据
const users = ref<userInfoData[] | undefined | null>([]);
//定义变量存储与表单双向绑定的数据
let userForm = ref<userInfoData>({
	username: '',
	password: '',
	name: '',
	phone: '',
	role_id: '',
	_id: null,
});
//定义变量绑定表单的ref
const userFormRef = ref<FormInstance>();

//点击一页显示多少条数据触发的事件
const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getUserList();
};
//点击页码或下一页显示的事件
const handleCurrentChange = (val: number) => {
	currentPage.value = val;
	getUserList();
};

//转换时间
//@ts-ignore
const resetDate = (row: any, column: any, cellValue: any, index: number) => {
	if (!cellValue) return '-'; // 或返回空字符串、自定义提示
	// 确保 formatTime 函数能处理时间戳或日期字符串
	return formatTime(cellValue);
};
interface User {
	date: string;
	name: string;
	address: string;
}
//添加用户（控制弹出框显示）
const handleAdd = () => {
	dialogFormVisible.value = true;
	userVisibale.value = true;
};
//编辑用户控制username字段的显示隐藏
const handleUsername = () => {
	userVisibale.value = false;
};
//确认添加用户
const confirmAdd = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			userStore.addUser(userForm.value).then(() => {
				getUserList();
				dialogFormVisible.value = false;
				userForm.value = {
					username: '',
					password: '',
					name: '',
					phone: '',
					role_id: '',
					_id: null,
				};
			});
		} else {
		}
	});
	dialogFormVisible.value = false;
};
//确认修改用户
const confirmEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			userStore.updateUser(userForm.value).then(() => {
				getUserList();
				dialogFormVisible.value = false;
				userForm.value = {
					username: '',
					password: '',
					name: '',
					phone: '',
					role_id: '',
					_id: null,
				};
			});
		} else {
		}
	});
	dialogFormVisible.value = false;
};
//编辑
const handleEdit = (id: string) => {
	handleUsername();
	dialogFormVisible.value = true;
	userStore.GetUserById(id).then((res) => {
		userForm.value = res as userInfoData;
	});
};
//删除
const handleDelete = (row: userInfoData) => {
	ElMessageBox.confirm('确认要删除此条数据', '删除用户', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		userStore.deleteUser(row).then(() => {
			getUserList();
			ElMessage({
				type: 'success',
				message: '删除成功',
			});
		});
	});
};

//表单中（username）的校验规则
let validateUserName = (rule: any, value: any, callback: any) => {
	value = value.trim();
	const length = value && value.length;
	const pwdReg = /^[a-zA-Z0-9_]+$/;
	const chackUserName = () => {
		return userStore.users?.filter((item) => {
			return item.username == value;
		});
	};
	if (value == '') {
		callback(new Error('请输入账号'));
	} else if (length < 4 || length > 12) {
		callback(new Error('长度在4到12的字符'));
	} else if (!pwdReg.test(value)) {
		callback(new Error('账号必须是英文、数字、下划线组成'));
	} else if (chackUserName()?.length) {
		callback(new Error('用户名重复'));
	} else {
		callback();
	}
};
//表单中（phone）的校验规则
let validatePhone = (rule: any, value: any, callback: any) => {
	value = value.trim();
	const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
	if (value == '') {
		callback(new Error('请输入手机号'));
	} else if (!phoneReg.test(value)) {
		callback(new Error('请输入正确的手机号'));
	} else {
		callback();
	}
};
//表单的校验规则
const rules = reactive<FormRules>({
	username: [{ required: true, validator: validateUserName, trigger: ['blur', 'change'] }],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 3, message: '密码长度需大于4位', trigger: 'blur' },
	],
	name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
	role_id: [{ required: true, message: '请选择角色', trigger: 'blur' }],
	phone: [{ required: true, validator: validatePhone, trigger: ['blur', 'change'] }],
});
//将所属角色从字符串替换成角色名
const getRoleList = () => {
	if (roleStore.roles?.length) {
		roleOptions.value = roleStore.roles;
	} else {
		roleStore.roleList().then((res) => {
			roleOptions.value = roleStore.roles;
		});
	}
};
//格式化角色数据方法
const resetRole = (row: any, colum: any, cellValue: string, index: number) => {
	let role = roleOptions.value?.find((item) => {
		return item._id == cellValue;
	});
	return role?.name;
};

//获取用户列表
const getUserList = () => {
	userStore
		.getUserList({
			page: currentPage.value,
			size: pageSize.value,
		}) // 注意：必须等待请求完成后再赋值，否则拿到的是空数据
		.then((response) => {
			users.value = userStore.users;
			total.value = response?.total as number;
			// total.value = total.value / pageSize.value;
		});
};
onMounted(() => {
	getUserList();
	getRoleList();
});
</script>
<style scoped>
.el-pagination {
	margin-top: 20px;
}
</style>
