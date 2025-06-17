<template>
	<div class="child">
		<h1>child</h1>
		<h3>{{ modelValue }}</h3>
		<button @click="handler">父子组件数据同步</button>
	</div>
</template>

<script setup lang="ts">
let props = defineProps(['modelValue']);
let emit = defineEmits(['update:modelValue']);
const handler = () => {
	emit('update:modelValue', props.modelValue + 1000);
};
</script>

<style scoped></style>
