<template>
	<div class="">
		<ul ref="list">
			<li v-for="(item, index) in arr" :key="index">{{ item }}</li>
		</ul>
		<button @click="update">修改</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, reactive, ref } from 'vue';
export default defineComponent({
	name: 'App',
	setup() {
		// nextTick()
		const arr = reactive(['列表1', '列表2', '列表3']);
		const list = ref();
		// vue有一个异步更新策略，数更新 但是vue不会立刻更新Dom元素
		// 可以使用nextTick() 就是用于Dom更新之后进行执行的
		//简单理解是next将里面的语句变为异步执行，从而等到dom节点更新完才会执行里面的语句
		const update = () => {
			arr.push('列表4');
			arr.push('列表5');
			arr.push('列表6');
			nextTick(() => {
				console.log(list.value.children.length);
			});
		};
		return { arr, list, update };
	},
});
</script>
