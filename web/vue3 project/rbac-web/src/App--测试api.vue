<template>
	<div class="">
		<button @click="getUserInfo">获取用户信息</button>
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { reqLogin, reqUserInfo } from './api/user';
let token: any = '';
onMounted(() => {
	reqLogin({ username: 'test1', password: '1234' }).then((res) => {
		console.log(res);

		if (res.status == 0) {
			token = res.data?.token;
		}
	});
});
const getUserInfo = () => {
	reqUserInfo({ headers: { token } }).then((res) => {
		console.log(res);
	});
};
</script>

<style scoped></style>
