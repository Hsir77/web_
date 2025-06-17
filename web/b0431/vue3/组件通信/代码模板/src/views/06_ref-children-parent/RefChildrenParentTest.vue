<template>
	<div class="box">
		<h1>我是父亲--{{ money }}</h1>
		<button @click="borrowMoneytoson(1000)">像儿子借钱</button>
		<button @click="borrowMoneytodaughter(500)">像女儿借钱</button>
		<SonVue ref="son"></SonVue>
		<DaughterVue ref="daughter"></DaughterVue>
	</div>
</template>

<script setup lang="ts">
//ref 和$parent 同样是父子传参，区别是数据要进行绑定，而父级子级都有各自的参数，用props 或v-model太复杂
//原理是绑定ref或通过parent去寻找到对应的元素，通过寻找到元素内部的值而进行修改
import { ref } from 'vue';
import DaughterVue from './Daughter.vue';
import SonVue from './Son.vue';
const son = ref();
const daughter = ref();
const money = ref(10000);
const borrowMoneytoson = (sonmoney: number) => {
	money.value += sonmoney;
	console.log(son);

	son.value.money -= sonmoney;
};
const borrowMoneytodaughter = (daughtermoney: number) => {
	money.value += daughtermoney;
	daughter.value.money -= daughtermoney;
};
defineExpose({
	money,
});
</script>

<style scoped></style>
