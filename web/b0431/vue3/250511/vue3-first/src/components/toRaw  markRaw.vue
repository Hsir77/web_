<template>
	<div class="">
		<p>{{ user }}</p>
		<p>{{ user1 }}</p>
		<p>{{ user3 }}</p>
		<button @click="toRowUser">toRowUser</button>
		<button @click="markRawUser">markRawUser</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRaw, markRaw } from 'vue';
export default defineComponent({
	name: 'App',
	setup() {
		// oRaw
		// 返回由 `reactive` 或 `readonly` 方法转换成响应式代理的普通对象。
		// 这是一个还原方法，可用于临时读取，访问不会被代理 / 跟踪，写入时也不会触发界面更新

		const user = reactive({
			name: '张三',
			age: 20,
		});
		const user1 = toRaw(user);

		const toRowUser = () => {
			user1.name += 1;
			console.log(user.name);
		};
		// markRaw
		// 标记一个对象，使其永远不会转换为代理。返回对象本身
		// 应用场景:
		// 有些值不应被设置为响应式的，例如复杂的第三方类实例或 Vue 组件对象。
		// 当渲染具有不可变数据源的大列表时，跳过代理转换可以提高性能。
		const user2 = markRaw(user);
		const user3 = reactive(user2);
		const markRawUser = () => {
			user3.name += 1;
			console.log(user3.name);
		};

		return { user, user1, toRowUser, markRawUser, user3 };
	},
});
</script>

<style scoped></style>
