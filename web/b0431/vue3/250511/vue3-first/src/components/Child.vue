<template>
	<div class="">
		<h1>{{ msg }}</h1>
		<h1>这是子组件</h1>
		<button @click="aaa">打印</button>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
	name: 'App',
	props: ['msg'],
	//由于setup中不存在vue实例所以不能使用this当做vue只能通过setup中的参数来处理
	//setup自带两个参数，分别是props和{emit}用来接受父组件的数据和方法
	setup(props, { emit }) {
		const aaa = () => {
			console.log(emit);
			emit('xxx', '子组件回传的数据');
		};
		return { aaa };
	},
});
</script>
<style scoped></style>
