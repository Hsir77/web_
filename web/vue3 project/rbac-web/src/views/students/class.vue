<template>
	<div>
		<!-- 条件筛选 -->
		<el-form :model="searchMap" label-width="auto" style="max-width: 800px" :inline="true" ref="ruleFormRef">
			<el-form-item style="width: 200px" prop="teacher_id">
				<el-select v-model="searchMap.teacher_id" placeholder="根据教师查询">
					<el-option
						v-for="(item, index) in teacherOptions"
						:label="item.name"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item style="width: 200px" prop="manager_id">
				<el-select v-model="searchMap.manager_id" placeholder="根据学管查询">
					<el-option
						v-for="(item, index) in managerOptions"
						:label="item.name"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="searchData">查询</el-button>
				<el-button @click="resetForm(ruleFormRef)">重置</el-button>
				<el-button type="success" @click="handleAdd">新增班级</el-button>
			</el-form-item>
		</el-form>

		<!-- 班级表格展示 -->
		<el-table :data="classes" style="width: 100%">
			<el-table-column type="index" label="序号" width="100"></el-table-column>
			<el-table-column prop="classname" label="班级名称"></el-table-column>
			<el-table-column prop="teacher_id" label="授课教师" :formatter="resetClass"></el-table-column>
			<el-table-column prop="manager_id" label="学管" :formatter="resetClass"></el-table-column>
			<el-table-column label="操作" width="200">
				<template #default="scope">
					<el-button size="small" @click="handleEdit(scope.row._id)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页组件 -->
		<el-pagination
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			:page-sizes="[5, 10, 15, 20]"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>

		<!-- 新增/编辑弹窗 -->
		<el-dialog v-model="dialogFormVisible" title="班级添加/编辑" width="500">
			<el-form :model="classForm" label-width="auto" ref="classFormRef" :rules="rules">
				<el-form-item label="班级名称" prop="classname">
					<el-input v-model="classForm!.classname" autocomplete="off" placeholder="请输入班级名称" />
				</el-form-item>
				<el-form-item label="授课教师" prop="teacher_id">
					<el-select v-model="classForm.teacher_id" placeholder="请点击选择">
						<el-option
							v-for="(item, index) in teacherOptions"
							:label="item.name"
							:value="item._id"
							:key="index"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="学管" prop="manager_id">
					<el-select v-model="classForm.manager_id" placeholder="请点击选择">
						<el-option
							v-for="(item, index) in managerOptions"
							:label="item.name"
							:value="item._id"
							:key="index"
						/>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取消</el-button>
					<el-button
						type="primary"
						@click="classForm._id == null ? confirmAdd(classFormRef) : confirmEdit(classFormRef)"
					>
						确认
					</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
// ===== 导入模块 =====
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref, reactive } from 'vue';

// 类型与仓库引入
import type { classInfoData, classResponseData } from '@/api/class/type';
import useClassStore from '@/stroe/modules/class';
const classStore = useClassStore();

// 引入hook
import Users from '@/hooks/user';
const { teacherOptions, managerOptions, getUserList, getRoleList, getClassUser, resetClass } = Users();

// ===== 响应式数据定义 =====
// 搜索条件
let searchMap = reactive({
	teacher_id: '',
	manager_id: '',
});

// 班级列表数据
const classes = ref<classInfoData[] | undefined>([]);

// 表单数据
const classForm = ref<classInfoData>({
	_id: null,
	classname: '',
	teacher_id: '',
	manager_id: '',
});

// 表单引用
const ruleFormRef = ref<FormInstance>();
const classFormRef = ref<FormInstance>();

// 弹窗显示控制
const dialogFormVisible = ref(false);

// 分页相关数据
const currentPage = ref(1); // 当前页
const pageSize = ref(5); // 每页条数
const total = ref(0); // 总条数
const totalPage = ref(1); // 总页数

// 表单校验规则
const rules = reactive<FormRules>({
	classname: [{ required: true, trigger: ['blur', 'change'], message: '请填写班级名称' }],
	teacher_id: [{ required: true, trigger: ['blur', 'change'], message: '请选择' }],
	manager_id: [{ required: true, trigger: ['blur', 'change'], message: '请选择' }],
});

// ===== 分页控制 =====
// 页面大小变化时触发
const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getClassList();
};

// 当前页码变化时触发
const handleCurrentChange = (val: number) => {
	currentPage.value = val;
	getClassList();
};

// ===== 弹窗操作 =====
// 打开添加/编辑弹窗
const handleAdd = () => {
	dialogFormVisible.value = true;
};

// 编辑班级信息
const handleEdit = (id: string) => {
	handleAdd();
	classStore.getClassById(id).then((res) => {
		classForm.value = res as classInfoData;
	});
};

// ===== 删除逻辑 =====
// 删除班级信息
const handleDelete = (id: string) => {
	ElMessageBox.confirm('确定要删除此条数据吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			classStore.deleteClass(id).then(() => {
				getClassList();
				ElMessage.success('删除成功');
			});
		})
		.catch(() => {});
};

// ===== 表单提交 =====
// 确认添加班级
const confirmAdd = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			classStore.addClass(classForm.value).then(() => {
				dialogFormVisible.value = false;
				getClassList();
				classForm.value = {
					classname: '', // 用户名
					teacher_id: '',
					manager_id: '',
				};
			});
		}
	});
	dialogFormVisible.value = false;
};

// 确认编辑班级
const confirmEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			classStore.updateClass(classForm.value).then(() => {
				dialogFormVisible.value = false;
				getClassList();
				classForm.value = {
					classname: '', // 用户名
					teacher_id: '',
					manager_id: '',
				};
			});
		}
	});
	dialogFormVisible.value = false;
};

// 搜索班级列表
const searchData = () => {
	currentPage.value = 1;
	getClassList();
};

// 重置搜索条件
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	getClassList();
};

// ===== 数据获取 =====
// 获取班级列表数据
const getClassList = () => {
	classStore.getClassList({ page: currentPage.value, size: pageSize.value, searchMap }).then((response) => {
		classes.value = classStore.classes;
		total.value = response?.total as number;
		totalPage.value = total.value / pageSize.value;

	});
};

// ===== 初始化 =====
// 组件挂载时执行
onMounted(() => {
	getClassList();
	getUserList();
	getRoleList();
	getClassUser();
});
</script>

<style scoped>
.el-pagination {
	margin-top: 20px;
}
</style>
