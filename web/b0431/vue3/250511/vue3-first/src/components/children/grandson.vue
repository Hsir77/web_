<template>
	<div class="">
		<h1 :style="{ color: color }">这是孙子</h1>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
export default defineComponent({
	name: 'App',
	setup() {
		const color = inject('color');
		return { color };
	},
});
</script>

<style scoped></style>
