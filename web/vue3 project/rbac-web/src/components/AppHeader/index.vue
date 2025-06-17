<template>
	<div class="header">
		<router-link to="/" class="router-link">
			<img src="../../assets/vue.svg" alt="" />

			<span>学员管理系统</span>
		</router-link>
		<div class="handleRight">
			<div class="timeweather">
				<span>{{ nowTime }}</span>
				<span>|</span>
				<span>雷阵雨</span>
				<el-icon size="30px" color="yellow"><Lightning /></el-icon>
				<span>23/15°c</span>
			</div>
			<div>
				<el-dropdown @command="handleCommand">
					<span class="el-dropdown-link" style="color: #fff; font-size: 17px">
						{{ userStore.user?.name }}<el-icon size="20px"><ArrowDown /></el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="a">修改密码</el-dropdown-item>
							<el-dropdown-item command="b">退出系统</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
		<!-- 修改密码弹出 -->
		<el-dialog v-model="dialogFormVisible" title="修改密码" width="500">
			<el-form :model="form" label-width="auto" ref="userFormRef" :rules="rules">
				<el-form-item label="原密码" prop="oldPassword">
					<el-input v-model="form.oldPassword" autocomplete="off" />
				</el-form-item>
				<el-form-item label="新的密码" prop="newPassword">
					<el-input v-model="form.newPassword" autocomplete="off" />
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPassword">
					<el-input v-model="form.checkPassword" autocomplete="off" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取消</el-button>
					<el-button type="primary" @click="UpdatePwd(userFormRef)"> 确认 </el-button>
				</div>
			</template>
		</el-dialog>
		<!--  -->
	</div>
</template>

<script lang="ts" setup>
import { formatTime } from '@/utills/weather';
import { onMounted, ref, reactive } from 'vue';
import userUserStore from '@/stroe/modules/user';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { reqCheckPwd, reqUpdataPwd } from '@/api/user';
import { ElMessage } from 'element-plus';

let userStore = userUserStore();
let $router = useRouter();
const dialogFormVisible = ref(false); //修改密码表单是否显示
const userFormRef = ref<FormInstance>();
//修改密码 表单数据
const form = reactive({
	oldPassword: '', //原密码
	newPassword: '', //新密码
	checkPassword: '', //确认密码
});
//修改密码显示方法
const handlePwd = () => {
	dialogFormVisible.value = true;
};

//填写密码时的校验,校验密码是不是和原密码相同
let validateOldPassword = (rule: any, value: any, callback: any) => {
	//当输入密码失去焦点时进行校验，将storage中的id和我输入的密码传递进reqCheckPwd进行校验，判断我输入的原始密码对不对
	reqCheckPwd({ userId: userStore.user?._id as string, password: value })
		.then((res) => {
			if (res.status == 0) {
				callback();
			} else {
				callback(new Error(res.msg));
			}
		})
		.catch((error) => {
			console.log(error);
		});
};
//检验两次输入的新密码是否相同
let validatePassword = (rule: any, value: any, callback: any) => {
	if (value !== form.newPassword) {
		callback(new Error('两次输入密码不一致!'));
	} else {
		callback();
	}
};
//表单的校验规则
const rules = reactive<FormRules>({
	oldPassword: [
		{
			required: true,
			validator: validateOldPassword,
			trigger: 'blur',
		},
	],
	newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
	//***************bug********************
	checkPassword: [{ required: true, validator: validatePassword, trigger: 'change' }],
});
//确认修改密码
const UpdatePwd = (formEl: FormInstance | undefined) => {
	console.log(userFormRef.value);

	if (!formEl) return;

	formEl.validate((valid) => {
		if (valid) {
			// 调用修改密码接口，用 then/catch 处理异步
			reqUpdataPwd({
				userId: userStore.user?._id as string,
				password: form.newPassword,
			}).then((res) => {
				console.log(userStore.user?._id, form.newPassword);

				if (res.status == 0) {
					ElMessage.success('密码修改成功，即将跳转登录页');
					dialogFormVisible.value = false; // 关闭弹窗
					handelLogout(); // 执行退出
				} else {
					ElMessage.error(res.msg || '密码修改失败');
				}
			});
		} else {
			console.log('表单校验失败');
			ElMessage.warning('请完善表单信息');
		}
	});
};
//点击修改密码和退出登录的swtich
const handleCommand = (command: string) => {
	switch (command) {
		case 'a':
			handlePwd();

			break;
		case 'b':
			handelLogout();
			break;
		default:
			break;
	}
};

//退出登录的方法
const handelLogout = () => {
	userStore.removeUser();
	$router.push('/login');
};
//日期实时显示利用定时器
let nowTime = ref<string>('');
const getTime = () => {
	setInterval(() => {
		nowTime.value = formatTime(Date.now());
	}, 1000);
};

onMounted(() => {
	getTime();
});
/****************************************** */
</script>

<style scoped>
.router-link {
	color: white;
	text-decoration: none;
	display: flex;
	align-items: center;

	&:hover,
	&:focus {
		text-decoration: none;
		color: white;
	}
}

.header {
	height: 50px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20px; /* 添加间距 */
}

.handleRight {
	height: 100%;
	display: flex;
	align-items: center;
	gap: 20px; /* 内部元素间距 */
	min-width: 300px; /* 确保足够宽度 */
}

.timeweather {
	font-size: 16px;
	color: #fff;
	display: flex;
	align-items: center;
	gap: 12px;
}
</style>
