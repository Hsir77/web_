<template>
	<div class="">
		<input type="text" v-model="text" />
		<p>{{ text }}</p>
	</div>
</template>
<script lang="ts">
/*
    customRef语法：
        customRef(回调函数(参数1, 参数2))
        参数1: 告诉vue去追踪哪个数据
        参数2: 告诉vue去更新界面

    总结: 创建一个自定的ref对象
        可以对这个ref对象进行一个防抖的处理
    使用方式: 定义一个响应式对象 将这个响应式对象变成防抖处理 使用这个方法 可以批量创建ref对象
*/
// const text = SetText('hello vue');
function SetText<T>(value: T, delay = 200) {
	let timer: any;

	return customRef((track, trigger) => {
		console.log(track);
		console.log(trigger);
		return {
			get() {
				track();
				return value;
			},
			set(newValue) {
				clearInterval(timer);
				timer = setTimeout(() => {
					value = newValue;
					trigger();
				}, delay);
			},
		};
	});
}

import { customRef, defineComponent } from 'vue';
export default defineComponent({
	name: 'App',
	setup() {
		const text = SetText('hello vue');
		console.log(text);
		return { text };
	},
});
</script>
<style scoped></style>
