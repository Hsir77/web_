<template>
	<div>
		<h1>事件</h1>
		<button @click="c1">摁扭1</button>
		<button @click="c2">摁扭2</button>

		<Event1 @click="c3"></Event1>
		<Event2 @click="c4"></Event2>
	</div>
</template>

<script setup lang="ts">
import Event1 from './Event1.vue';
import Event2 from './Event2.vue';
const c1 = () => {
	console.log(1);
};
const c2 = () => {
	console.log(event);
};
const c3 = () => {
	console.log(3);
};
const c4 = (value) => {
	console.log(value);
};
</script>

<style scoped></style>
