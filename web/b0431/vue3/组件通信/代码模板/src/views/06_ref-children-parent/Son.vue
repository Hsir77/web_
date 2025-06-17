<template>
	<div class="son">
		<h1>这是儿子---{{ money }}</h1>
		<button @click="setMoney(500, $parent)">给父亲前500</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const money = ref(5000);
const setMoney = (money1: number, $parent: any) => {
	money.value -= money1;
	$parent.money += money1;
};
defineExpose({
	money,
});
</script>

<style scoped></style>
