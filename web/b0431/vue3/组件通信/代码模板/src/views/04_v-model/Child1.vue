<template>
	<div class="child2">
		<h1>child1</h1>
		<h3>{{ name }}在{{ bank }}存款：{{ money }}</h3>
		<button @click="handler1">改名</button>
		<button @click="handler2">改银行</button>
		<button @click="handler3">加钱</button>
	</div>
</template>

<script setup lang="ts">
let props = defineProps(['name', 'bank', 'money']);
let emit = defineEmits(['update:name', 'update:bank', 'update:money']);
let name1 = '李四';
let bank1 = '建设银行';
const handler1 = () => {
	emit('update:name', name1);
};
const handler2 = () => {
	emit('update:bank', bank1);
};
const handler3 = () => {
	emit('update:money', props.money + 1000);
};
</script>

<style scoped></style>
