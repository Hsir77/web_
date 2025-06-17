<template>
	<div class=""></div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, readonly, isRef, isReactive, isReadonly, isProxy } from 'vue';
export default defineComponent({
	name: 'App',
	setup() {
		// ● isRef: 检查一个值是否为一个 ref 对象
		// ● isReactive: 检查一个对象是否是由 `reactive` 创建的响应式代理
		// ● isReadonly: 检查一个对象是否是由 `readonly` 创建的只读代理
		// ● isProxy: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理
		console.log(isRef(ref({})));
		console.log(isRef(reactive({})));

		console.log('------------');

		console.log(isReactive(ref({})));
		console.log(isReactive(reactive({})));

		console.log('------------');

		console.log(isReadonly(readonly({})));
		console.log(isReadonly(reactive({})));

		console.log('------------');

		console.log(isProxy(ref({})));
		console.log(isProxy(reactive({})));
		console.log(isProxy(readonly({})));
		return {};
	},
});
</script>

<style scoped></style>
