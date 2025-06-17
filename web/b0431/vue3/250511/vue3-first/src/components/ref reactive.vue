<template>
	<div class="">
		<button @click="add">+1</button>
		<p>{{ msg }}</p>
		<button @click="updata">修改</button>
		<p>{{ obj }}</p>
		<Child :msg="msg" @xxx="xxx"></Child>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import Child from './Child.vue';

export default defineComponent({
	name: 'App',
	setup() {
		let msg = ref<any>(1);
		function add() {
			msg.value++;
		}
		//reactive 用来处理复杂数据类型
		let obj = reactive({
			name: 'david',
			age: 18,
			wife: {
				name: 'lisa',
				age: 18,
			},
		});
		function updata() {
			obj.age += 2;
			obj.wife.age++;
		}
		const xxx = (x: string) => {
			console.log(x);
		};
		return { msg, add, obj, updata, xxx };
	},
	components: {
		Child,
	},
});
</script>

<style scoped></style>
