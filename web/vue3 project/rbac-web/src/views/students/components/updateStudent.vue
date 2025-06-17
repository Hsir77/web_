<template>
	<div class="">
		<!-- 学员登录表单 -->
		<el-form :model="studentsData" ref="studentRef" label-width="auto" style="width: 500px" :rules="rules">
			<!-- 基础信息 -->
			<el-form-item label="姓名" prop="name">
				<el-input v-model="studentsData.name" />
			</el-form-item>
			<el-form-item label="性别" prop="gender">
				<el-select v-model="studentsData.gender" placeholder="请点击选择">
					<el-option
						v-for="(item, index) in genderOptions"
						:label="item.name"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="所在学校" prop="school">
				<el-select v-model="studentsData.school" placeholder="请点击选择">
					<el-option
						v-for="(item, index) in schoolOptions"
						:label="item.schoolname"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="专业" prop="major">
				<el-select v-model="studentsData.major" placeholder="请点击选择">
					<el-option
						v-for="(item, index) in majorOptions"
						:label="item.majorname"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="年级" prop="grade">
				<el-select v-model="studentsData.grade" placeholder="请点击选择">
					<el-option
						v-for="(item, index) in gradeOptions"
						:label="item.name"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="学历" prop="education">
				<el-select v-model="studentsData.education" placeholder="请点击选择">
					<el-option
						v-for="(item, index) in educationOptions"
						:label="item.name"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="学习方向" prop="direction">
				<el-select v-model="studentsData.direction" placeholder="请点击选择">
					<el-option
						v-for="(item, index) in directionOptions"
						:label="item.name"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="身份证号码" prop="id_number">
				<el-input v-model="studentsData.id_number" />
			</el-form-item>
			<el-form-item label="联系电话" prop="phone">
				<el-input v-model="studentsData.phone" />
			</el-form-item>
			<el-form-item label="家庭住址" prop="address">
				<el-input v-model="studentsData.address" />
			</el-form-item>
			<el-form-item label="QQ号码" prop="qq">
				<el-input v-model="studentsData.qq" />
			</el-form-item>

			<!-- 班级&入学信息 -->
			<el-form-item label="所在班级" prop="class">
				<el-select v-model="studentsData.class" placeholder="请点击选择" @change="handleClass">
					<el-option
						v-for="(item, index) in classOptions"
						:label="item.classname"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="入学时间" prop="admission_date">
				<el-date-picker
					v-model="studentsData.admission_date"
					type="date"
					placeholder="请选择入学时间"
					value-format="YYYY-MM-DD"
				/>
			</el-form-item>
			<el-form-item label="授课教师" prop="teacher_id">
				<el-select v-model="studentsData.teacher_id" placeholder="请点击选择" disabled>
					<el-option
						v-for="(item, index) in teacherOptions"
						:label="item.name"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="学管" prop="manager_id">
				<el-select v-model="studentsData.manager_id" placeholder="请点击选择" disabled>
					<el-option
						v-for="(item, index) in managerOptions"
						:label="item.name"
						:value="item._id"
						:key="index"
					/>
				</el-select>
			</el-form-item>

			<!-- 照片上传 -->
			<el-form-item label="照片" prop="username" style="width: 1000px">
				<el-upload
					:action="baseApi + '/manage/img/upload'"
					list-type="picture-card"
					:auto-upload="true"
					name="image"
					accept="image/*"
					:file-list="fileList"
					:on-change="handleChange"
				>
					<el-icon><Plus /></el-icon>

					<template #file="{ file }">
						<div>
							<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
							<span class="el-upload-list__item-actions">
								<!-- 图片放大 -->
								<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
									<el-icon><ZoomIn /></el-icon>
								</span>
								<!-- 图片删除 -->
								<span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
									<el-icon><Delete /></el-icon>
								</span>
							</span>
						</div>
					</template>
				</el-upload>
			</el-form-item>
			<el-form-item label="备注" prop="note">
				<el-input v-model="studentsData.note" type="textarea" />
			</el-form-item>

			<!-- 提交按钮 -->
			<el-form-item>
				<el-button
					type="primary"
					@click="studentsData._id == null ? confirmAdd(studentRef) : confirmEdit(studentRef)"
				>
					{{ buttonText() }}
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules, UploadUserFile, UploadFile, UploadProps } from 'element-plus';

// 类型引入
import type { studentInfoData } from '@/api/student/type';

// hooks 引入
import Users from '@/hooks/user';
import studentHooks from '@/hooks/student';
import basicHooks from '@/hooks/basic';

// store 引入
import useClassStore from '@/stroe/modules/class';
import useStudentStore from '@/stroe/modules/student';

// 图标引入
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue';

// 请求引入
import request from '@/utills/request';

// store 实例化
let classStore = useClassStore();
let studentStore = useStudentStore();

// 路由实例
const $route = useRoute();
const $router = useRouter();
const buttonText = () => {
	if ($route.params._id === '-1') {
		return '确定添加';
	} else {
		return '确定编辑';
	}
};

// 表单响应式数据
const studentsData = ref<studentInfoData>({
	_id: null,
	name: '',
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
const studentRef = ref<FormInstance>();

// hooks 解构
const { teacherOptions, managerOptions, getUserList, getRoleList, getClassUser } = Users();

const { genderOptions, directionOptions, educationOptions, gradeOptions } = studentHooks();

const { schoolOptions, majorOptions, classOptions, getClassAll, getMajorAll, getSchoolAll } = basicHooks();

// 图片相关响应式数据

const baseApi = import.meta.env.VITE_APP_BASE_API;
const fileList = ref<UploadUserFile[]>([]);
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const disabled = ref(false);

/* -------------------- 校验规则 --------------------- */
// 手机号码校验
//@ts-ignore
const validatePhone = (rule: any, value: any, callback: any) => {
	value = value.trim();
	const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

	if (value === '') {
		callback(new Error('请输入手机号码'));
	} else if (!phoneReg.test(value)) {
		callback(new Error('请输入正确的手机号码'));
	} else {
		callback();
	}
};

// 身份证号码校验
//@ts-ignore
const validateIdNumber = (rule: any, value: any, callback: any) => {
	value = value?.trim();
	if (!value) {
		callback(new Error('请输入身份证号码'));
		return;
	}

	const ID_REG_18 = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	const ID_REG_15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/;

	if (!ID_REG_18.test(value) && !ID_REG_15.test(value)) {
		callback(new Error('请输入正确的身份证号码格式'));
		return;
	}

	if (value.length === 18) {
		const codeArr = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
		const weightArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		let sum = 0;

		for (let i = 0; i < 17; i++) {
			sum += parseInt(value[i]) * weightArr[i];
		}

		const checkCode = codeArr[sum % 11];
		if (checkCode !== value[17].toUpperCase()) {
			callback(new Error('身份证号码校验码错误'));
			return;
		}
	}

	const provinceCode = parseInt(value.substring(0, 2), 10);
	if (provinceCode < 11 || provinceCode > 83) {
		callback(new Error('身份证号码地区码不合法'));
		return;
	}

	let year, month, day;
	if (value.length === 18) {
		year = parseInt(value.substring(6, 10), 10);
		month = parseInt(value.substring(10, 12), 10);
		day = parseInt(value.substring(12, 14), 10);
	} else {
		year = parseInt('19' + value.substring(6, 8), 10);
		month = parseInt(value.substring(8, 10), 10);
		day = parseInt(value.substring(10, 12), 10);
	}

	if (month < 1 || month > 12) {
		callback(new Error('身份证号码月份不合法'));
		return;
	}

	const isLeapYear = (y: any) => y % 400 === 0 || (y % 100 !== 0 && y % 4 === 0);
	const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if (month === 2) {
		day = isLeapYear(year) ? 29 : 28;
	}

	if (day < 1 || day > monthDays[month - 1]) {
		callback(new Error('身份证号码日期不合法'));
		return;
	}

	callback();
};

// 表单校验规则
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
	gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
	direction: [{ required: true, message: '请选择学习方向', trigger: 'blur' }],
	id_number: [{ validator: validateIdNumber, trigger: ['blur'], required: true }],
	phone: [{ validator: validatePhone, trigger: ['blur'], required: true }],
	class: [{ required: true, message: '请选择班级', trigger: 'blur' }],
	admission_date: [{ required: true, message: '请选择入学时间', trigger: 'blur' }],
	teacher_id: [{ required: true, message: '请选择授课教师', trigger: 'blur' }],
	manager_id: [{ required: true, message: '请选择学管', trigger: 'blur' }],
});

/* -------------------- 业务逻辑 --------------------- */
// 班级改变时联动教师、学管
const handleClass = (val: any) => {
	classStore.getClassById(val).then((res) => {
		studentsData.value.teacher_id = res?.teacher_id as string;
		studentsData.value.manager_id = res?.manager_id as string;
	});
};

// 表单提交
const confirmAdd = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			studentsData.value.pictures = getImgs();
			studentsData.value.admission_date = studentsData.value.admission_date?.slice(0, 10);

			studentStore.addStudent(studentsData.value as studentInfoData).then(() => {
				$router.replace('/student');
			});
		} else {
			// 可补充校验失败逻辑
		}
	});
};
//表单编辑
const confirmEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			studentsData.value.pictures = getImgs();
			studentsData.value.admission_date = studentsData.value.admission_date?.slice(0, 10);

			studentStore.updateStudent(studentsData.value as studentInfoData).then(() => {
				$router.replace('/student');
			});
		} else {
			// 可补充校验失败逻辑
		}
	});
};
//获取编辑学生的信息
const getStudent = () => {
	const { _id } = $route.params;
	if (_id !== '-1') {
		studentStore.getStudentById(_id as string).then((res) => {
			studentsData.value = res as studentInfoData;
			const { pictures } = res as studentInfoData;
			if (pictures && pictures.length > 0) {
				// @ts-ignore
				fileList.value = pictures.map((item) => {
					return {
						url: baseApi + '/upload/' + item,
						name: item,
					};
				});
			}
		});
	}
};

// 图片删除
const handleRemove = (file: UploadFile) => {
	request.post<any, any>('/manage/img/delete', { name: file.name }).then((res) => {
		if (res.status == 0) {
			fileList.value.splice(fileList.value.indexOf(file), 1);
		}
	});
};

// 图片预览
const handlePictureCardPreview = (file: UploadFile) => {
	dialogImageUrl.value = file.url!;
	dialogVisible.value = true;
};

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
	if (uploadFile.status === 'success') {
		const result = uploadFile.response;
		// @ts-ignore
		if (result.status === 0) {
			// @ts-ignore
			const { name, url } = result.data;
			uploadFile = uploadFiles[uploadFiles.length - 1];
			uploadFile.name = name;
			uploadFile.url = url;
		}
	}
	fileList.value = uploadFiles;
};
const getImgs = () => {
	return fileList.value.map((item) => item.name);
};
//备注框（富文本）
/* -------------------- 初始化逻辑 --------------------- */
onMounted(() => {
	// 用户相关初始化

	getUserList();
	getRoleList();
	getClassUser();

	// 基础数据初始化
	getClassAll();
	getMajorAll();
	getSchoolAll();
	//
	getStudent();
	buttonText();
});
</script>

<style scoped></style>
