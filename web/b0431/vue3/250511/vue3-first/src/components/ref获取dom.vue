<template>
	<div class="">
		<h1>通过ref获取dom元素</h1>
		<input type="text" ref="inputRef" />
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
	name: 'App',
	setup() {
		let inputRef = ref<any>(null);

		onMounted(() => {
			inputRef.value && inputRef.value.focus();
		});
		return { inputRef };
	},
});
</script>
