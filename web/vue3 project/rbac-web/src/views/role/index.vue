<template>
	<div class="">
		<div class="role_button">
			<el-button type="primary" @click="handleAdd">创建角色</el-button>
			<el-button type="primary" :disabled="currentRow == null ? true : false" @click="handleUpdate"
				>设置角色权限</el-button
			>
		</div>

		<el-table
			ref="singleTableRef"
			:data="roleList"
			highlight-current-row
			style="width: 100%"
			@current-change="handleCurrentChange"
		>
			<!-- highlight-current-row 是可单选的选项 -->
			<el-table-column type="index" label="序号" width="100" />
			<el-table-column property="name" label="角色名称" />
			<el-table-column property="create_time" label="创建时间" :formatter="resetDate" />
			<el-table-column property="auth_time" label="授权时间" :formatter="resetDate" />
			<el-table-column property="auth_name" label="授权人" />
		</el-table>

		<!-- 添加角色弹出框 -->
		<el-dialog v-model="roleFormVisible" title="添加角色" width="500px">
			<el-form
				:model="role"
				ref="roleFormRef"
				label-width="100px"
				label-position="right"
				style="width: 400px"
				:rules="rules"
			>
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="role.name" placeholder="请输入角色名称" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="addData(roleFormRef)"> 确定 </el-button>
					<el-button @click="roleFormVisible = false">取消</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 设置角色权限弹出框 -->
		<el-dialog v-model="roleAuthVisible" title="设置角色权限" width="500px" v-if="roleAuthVisible">
			<el-form
				:model="updateRole"
				ref="roleFormRef"
				label-width="100px"
				label-position="right"
				style="width: 400px"
			>
				<el-form-item label="角色名称">
					<el-input v-model="updateRole.name" placeholder="请输入角色名称" />
				</el-form-item>
				<!-- 树形控件 -->
				<!-- 由于树形组件可能复用所以单独拆分成一个组件使用 -->
				<Auth ref="authRef" :role="currentRow"></Auth>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="updateData()"> 确定 </el-button>
					<el-button @click="roleFormVisible = false">取消</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import { type TableInstance, type FormInstance, type FormRules, ElMessage } from 'element-plus';
import type { roleInfoData } from '@/api/role/type';
import useRoleStore from '@/stroe/modules/role';
import { formatTime } from '@/utills/weather';
import Auth from './components/auth.vue';
import userUserStore from '@/stroe/modules/user';

let roleStore = useRoleStore();
let userStore = userUserStore();
const roleFormRef = ref<FormInstance>();
const singleTableRef = ref<TableInstance>();
const authRef = ref();

//控制（创建角色）弹出框是否显示
const roleFormVisible = ref(false);
//控制（设置角色权限）弹出框是否显示
const roleAuthVisible = ref(false);

//定义数据用于（创建角色）弹出框表单绑定
let role = reactive({
	name: '',
});
//定义数据用于（设置角色权限）弹出框表单绑定
let updateRole = reactive({
	name: '',
});

//转换时间
//@ts-ignore
const resetDate = (row: any, column: any, cellValue: any, index: number) => {
	if (!cellValue) return '-'; // 或返回空字符串、自定义提示

	// 确保 formatTime 函数能处理时间戳或日期字符串
	return formatTime(cellValue);
};

//用于判断'设置角色权限'的值(当前行数据)
let currentRow = ref();
//获取当前点击行的数据
const handleCurrentChange = (val: roleInfoData | undefined) => {
	currentRow.value = val;
	updateRole.name = val?.name as string;
	//val是当前行的数据
};

//渲染给角色列表的数据
const roleList = ref<roleInfoData[] | undefined>([]);
//获取角色列表
const getRoleList = () => {
	roleStore.roleList().then(() => {
		//将接口返回的角色列表赋值给roleList
		roleList.value = roleStore.roles;
	});
};

//弹出框表单校验的规则
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
});

//点击（创建角色）按钮事件
const handleAdd = () => {
	roleFormVisible.value = true;
};
//点击（设置角色权限）按钮事件
const handleUpdate = () => {
	roleAuthVisible.value = true;
};

// 提交角色数据
const addData = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			roleStore.useAddRole(role).then(() => {
				roleFormVisible.value = false;
				getRoleList();
				ElMessage.success('角色添加成功');
			});
		} else {
			// 校验失败可补充逻辑
		}
	});
};
const updateData = () => {
	currentRow.value.menus = authRef.value.getMenu();
	currentRow.value.name = updateRole.name;
	//引入用户小仓库，获取授权人信息
	currentRow.value.auth_name = userStore.user?.username;
	currentRow.value.auth_time = Date.now();
	roleStore.useUpdateRole(currentRow.value).then(() => {
		roleAuthVisible.value = false;
		getRoleList();
	});
};

//生命周期
onMounted(() => {
	getRoleList();
});
</script>

<style scoped></style>
