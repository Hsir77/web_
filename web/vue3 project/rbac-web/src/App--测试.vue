<template>
	<div class="">
		<button @click="getUserInfo">获取用户信息</button>
	</div>
</template>

<script lang="ts" setup>
//由于项目中所需的函数太多太复杂，所以我们把函数封装成一个个请求形式，
// 用于更好的看清每个部分是干什么的，又因为每个请求的功能有的相同有的不同，
// 所以我们把api统一管理在一个文件夹下，根据功能的不同分成不同的api，并且加上ts的约束
import request from '@/utills/request';
import { onMounted } from 'vue';
let token = '';
onMounted(() => {
	request({
		url: '/login',
		method: 'post',
		data: {
			username: 'test1',
			password: '1234',
		},
	}).then((res) => {
		console.log(res.data);

		if (res.data.status == 0) {
			token = res.data.message.token;
		}
	});
});
const getUserInfo = () => {
	request({
		url: '/user/info',
		method: 'get',
		headers: {
			token,
		},
	}).then((res) => {
		console.log(res);
	});
};
</script>

<style scoped></style>
