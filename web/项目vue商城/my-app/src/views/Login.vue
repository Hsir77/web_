<template>
	<div class="">
		<el-card class="login_container">
			<h3>系统登录</h3>
			<el-form ref="form" :inline="true" :model="formData" :rules="rules" label-width="70px">
				<el-form-item label="用户名" prop="username">
					<el-input placeholder="请输入用户名" v-model="formData.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input placeholder="请输入密码" v-model="formData.password" type="password"></el-input>
				</el-form-item>
				<el-form-item style="display: flex; justify-content: center">
					<el-button type="primary" @click="submit">登录</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
// import Mock from 'mockjs';
import Cookie from 'js-cookie';
import { getMenu } from '../api';
export default {
	name: '',
	data() {
		return {
			//form表单的数据
			formData: {
				username: '',
				password: '',
			},
			//校验数据的规则（必填等）
			rules: {
				username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
				password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
			},
		};
	},
	components: {},
	methods: {
		submit() {
			// const token = Mock.Random.guid();

			//校验表单通不通过

			this.$refs.form.validate((valid) => {
				if (valid) {
					getMenu(this.formData).then(({ data }) => {
						if (data.code == 200) {
							Cookie.set('token', data.data.token);
							//将不同的用户对应的menu存储到vuex中

							this.$store.commit('setMenu', data.data.menuList);
							this.$store.commit('addMenu', this.$router);
							this.$router.push('/home');
						} else {
							this.$message.error(data.data.message);
						}
					});
				}
			});
		},
	},
};
</script>

<style scoped lang="less">
.login_container {
	width: 350px;
	margin: 180px auto;
	border-radius: 5%;
	display: flex;
	padding: 35px 35px 15px 35px;
	background-color: #fff;
	h3 {
		text-align: center;
		margin-bottom: 40px;
		color: #505458;
	}

	.el-input {
		width: 230px;
	}
}
</style>
