<template>
	<div class="">
		<span>x的坐标是{{ x }}</span>
		<span>y的坐标是{{ y }}</span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import pages from '../Hooks/page';
export default defineComponent({
	name: 'App',
	setup() {
		const { x, y } = pages();
		return { x, y };
	},
});
</script>

<style scoped></style>
