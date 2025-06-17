<template>
	<div class="login">
		<!-- model 是收集数据 -->
		<el-form :model="form" ref="ruleFormRef" label-width="auto" class="login_form" :rules="rules">
			<h2 class="login_title">RBAC学员登录</h2>
			<el-form-item label="账号" prop="username">
				<el-input v-model="form.username" />
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="form.password" />
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="submitForm(ruleFormRef)" class="login_button">确定</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import userUserStore from '@/stroe/modules/user';
import { useRouter } from 'vue-router';

const form = reactive({
	username: '',
	password: '',
});
let userStore = userUserStore();
const ruleFormRef = ref<FormInstance>();
let $router = useRouter();
const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			//调用小仓库中登录方法，将用户填写的账号密码传递进去
			userStore.userLogin(form).then(() => {
				ElMessage({
					type: 'success',
					message: '登陆成功',
					//跳转到首页
				});
				$router.push('/');
			});
		} else {
			console.log('error submit!');
		}
	});
};

const rules = reactive({
	username: [{ trigger: 'blur', required: true, message: '请输入账号' }],
	password: [{ /*validator: validatePass2,*/ trigger: 'blur', required: true, message: '请输入密码' }],
});
</script>

<style scoped>
.login {
	width: 100vw;
	height: 100vh;
	background: url(../../assets/海岸绿植.png) no-repeat;

	background-size: cover;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
}
.login_form {
	background: rgba(177, 221, 240, 0.284);
	padding: 40px;
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.26);
	width: 400px;
}
.login_title {
	margin-bottom: 20px;
	color: #f5f5f5;
}
.login_button {
	margin: 0 auto;
}
:deep(.el-form-item__label) {
	color: #ffffff !important;
	font-size: 16px;
}

:deep(.el-input__inner) {
	color: #000000;
}

:deep(.el-input__wrapper) {
	background-color: rgba(255, 255, 255, 0.1);
	box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
}
</style>
