<template>
	<div>
		<!-- 条件筛选 -->
		<el-form :model="searchMap" label-width="auto" style="max-width: auto" :inline="true" ref="ruleFormRef">
			<el-form-item style="width: 150px" prop="name">
				<el-input v-model="searchMap.name" placeholder="根据姓名方向查询"></el-input>
			</el-form-item>
			<el-form-item style="width: 150px" prop="direction">
				<el-select v-model="searchMap.direction" placeholder="根据学习方向查询">
					<el-option
						v-for="(item, index) in directionOptions"
						:label="item.name"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item style="width: 150px" prop="class">
				<el-select v-model="searchMap.class" placeholder="根据班级查询">
					<el-option
						v-for="(item, index) in classOptions"
						:label="item.classname"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item style="width: 150px" prop="teacher_id">
				<el-select v-model="searchMap.teacher_id" placeholder="根据教师查询">
					<el-option
						v-for="(item, index) in teacherOptions"
						:label="item.name"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item style="width: 150px" prop="manager_id">
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
				<el-button type="success" @click="handelAdd">新增学员</el-button>
			</el-form-item>
		</el-form>

		<!-- 表格展示 -->
		<el-table :data="students" style="width: 100%" border>
			<el-table-column type="expand">
				<template #default="props">
					<div class="student_list">
						<p>学员姓名: {{ props.row.name }}</p>

						<p>性别: {{ dataFilter(props.row.gender, genderOptions) }}</p>

						<p>所在学校: {{ schoolFilter(props.row.school, schoolOptions) }}</p>

						<p>专业: {{ majorFilter(props.row.major, majorOptions) }}</p>

						<p>班级: {{ classFilter(props.row.class, classOptions) }}</p>

						<p>年级: {{ dataFilter(props.row.grade, gradeOptions) }}</p>

						<p>学历: {{ dataFilter(props.row.education, educationOptions) }}</p>

						<p>学习方向: {{ dataFilter(props.row.direction, directionOptions) }}</p>

						<p>身份证号码: {{ props.row.id_number }}</p>

						<p>联系电话: {{ props.row.phone }}</p>

						<p>入学时间: {{ props.row.admission_date }}</p>

						<!-- <p>授课教师: {{ props.row.teacher_id }}</p>

						<p>学管: {{ props.row.manager_id }}</p> -->

						<p class="pictrue">
							<span> 照片：</span>

							<el-image
								v-for="(item, index) in props.row.pictures"
								:key="index"
								style="width: 200px; height: 200px"
								:src="baseApi + '/upload/' + item"
								:max-scale="7"
								:min-scale="0.2"
								:preview-src-list="getSrcList(props.row.pictures)"
								:initial-index="0"
								fit="cover"
							/>
						</p>
						<p>
							备注信息：
							<span v-html="props.row.note"></span>
						</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="序号" type="index" width="80px" />
			<el-table-column label="学生姓名" prop="name" />
			<el-table-column label="性别" prop="gender" :formatter="resetGender" />
			<el-table-column label="学习方向" prop="direction" :formatter="resetDiredction" />
			<el-table-column label="电话号码" prop="phone" />
			<el-table-column label="所在班级" prop="class" :formatter="resetClassName" />
			<el-table-column label="授课教师" prop="teacher_id" :formatter="resetClass" />
			<el-table-column label="学管" prop="manager_id" :formatter="resetClass" />
			<el-table-column label="入学时间" prop="admission_date" />
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
	</div>
</template>

<script setup lang="ts">
// ===== 导入模块 =====
import type { FormInstance } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref, reactive } from 'vue';

// 类型与仓库引入
import type { studentInfoData } from '@/api/student/type';
import useStudentStore from '@/stroe/modules/student';
const studentStore = useStudentStore();

import { useRouter } from 'vue-router';
let $router = useRouter();

// 引入hook
import Users from '@/hooks/user';
const { teacherOptions, managerOptions, getUserList, getRoleList, getClassUser, resetClass } = Users();
//引入hook
import student from '@/hooks/student';
const {
	genderOptions,
	directionOptions,
	educationOptions,
	gradeOptions,
	dataFilter,
	classFilter,
	schoolFilter,
	majorFilter,
	resetGender,
	resetDiredction,
} = student();
//引入hook
import basic from '@/hooks/basic';
const { schoolOptions, majorOptions, classOptions, getClassAll, getMajorAll, getSchoolAll, resetClassName } = basic();

const baseApi = import.meta.env.VITE_APP_BASE_API;

// ===== 响应式数据定义 =====
// 搜索条件
let searchMap = reactive({
	teacher_id: '',
	manager_id: '',
	name: '',
	direction: '',
	class: '',
});

// 学员列表数据
const students = ref<studentInfoData[] | undefined>([]);

// 表单数据
const studentForm = ref<studentInfoData>({
	_id: null,
	name: '', // 替换 studentname 为 name
	gender: '',
	school: '',
	major: '',
	grade: '',
	education: '',
	direction: '',
	id_number: '',
	phone: '',
	parent: '',
	parent_phone: '',
	address: '',
	qq: '',
	class: '',
	admission_date: '',
	teacher_id: '',
	manager_id: '',
	pictures: [],
	note: '',
	stage: '',
});
// 表单引用
const ruleFormRef = ref<FormInstance>();

// 分页相关数据
const currentPage = ref(1); // 当前页
const pageSize = ref(5); // 每页条数
const total = ref(0); // 总条数
const totalPage = ref(1); // 总页数

// ===== 分页控制 =====
// 页面大小变化时触发
const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getStudentList();
};

// 当前页码变化时触发
const handleCurrentChange = (val: number) => {
	currentPage.value = val;
	getStudentList();
};

// ===== 弹窗操作 =====
// 打开添加/编辑弹窗
const handelAdd = () => {
	$router.push('update/student/-1');
};
// 编辑学员信息
const handleEdit = (_id: string) => {
	$router.push(`/update/student/${_id}`);
};

//处理图片
const getSrcList = (imgList: string[]): string[] => {
	return imgList.map((item) => baseApi + '/upload/' + item);
};
// ===== 删除逻辑 =====
// 删除学员信息
const handleDelete = (id: string) => {
	ElMessageBox.confirm('确定要删除此条数据吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			studentStore.deleteStudent(id).then(() => {
				getStudentList();
				ElMessage.success('删除成功');
			});
		})
		.catch(() => {});
};

// 搜索学员列表
const searchData = () => {
	currentPage.value = 1;
	getStudentList();
};

// 重置搜索条件
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	getStudentList();
};

// ===== 数据获取 =====
// 获取学员列表数据
const getStudentList = () => {
	studentStore.getStudentList({ page: currentPage.value, size: pageSize.value, searchMap }).then((response) => {
		students.value = studentStore.students;
		total.value = response?.total as number;
		totalPage.value = total.value / pageSize.value;
	});
};

// ===== 初始化 =====
// 组件挂载时执行
onMounted(() => {
	getStudentList();
	getUserList();
	getRoleList();
	getClassUser();
	//basic
	getClassAll();
	getMajorAll();
	getSchoolAll();
});
</script>

<style scoped>
.el-pagination {
	margin-top: 20px;
}
.student_list {
	padding: 20px;
	padding-left: 40px;
	display: flex;
	flex-wrap: wrap;
}
.student_list p {
	width: 100%;
	line-height: 30px;
	margin-bottom: 10px;
}
.pictrue {
	display: flex;
	align-items: center;
}
</style>
