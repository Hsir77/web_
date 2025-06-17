<template>
	<div class="">
		<h1>这是儿子</h1>
		<grandson></grandson>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import grandson from './grandson.vue';
export default defineComponent({
	name: 'App',
	setup() {
		return {};
	},
	components: {
		grandson,
	},
});
</script>

<style scoped></style>
