<template>
	<div class="box">
		<h1>{{ money }}</h1>
		<button @click="updateMoney">+100</button>
		<Child :money="money"></Child>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import Child from './Child.vue';
const money = ref(1000);
const updateMoney = () => {
	money.value += 100;
};
</script>

<style scoped></style>
