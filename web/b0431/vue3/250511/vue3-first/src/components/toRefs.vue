<template>
	<div class="">
		<div>{{ name }}</div>
		<div>{{ age }}</div>
		<div>{{ home }}</div>
		<div>{{ banji }}</div>
		<div>{{ study }}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
export default defineComponent({
	name: 'App',
	setup() {
		let obj = {
			name: '张三',
			age: 18,
			home: '哈尔滨',
			banji: '0431',
			study: 'good',
		};
		return { ...toRefs(obj) };
	},
});
</script>

<style scoped></style>
