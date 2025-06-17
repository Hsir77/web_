<template>
	<div>
		<h1>v-model</h1>
		<input type="text" v-model="info" />
		<span>{{ money }}</span>
		<!-- <Child :modelValue="money" @update:modelValue="handler"></Child> -->

		<!-- v-model可以事件父子组件的数据同步
         v-model相当于给子组件传递一个数据 这个数据的名称是modelValue
                 传递了一个方法 这个方法的名称 update:modelValue
                 自动定义了一个方法 这个方法可以将子组件传递过来的值重新复制给v-model绑定的数据
    -->
		<Child v-model="money"></Child>
		<!-- 如果父组件传递多个数据 -->
		<Child1 v-model:money="money" v-model:bank="bank" v-model:name="name"></Child1>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Child from './Child.vue';
import Child1 from './Child1.vue';
const info = ref();
const money = ref(1000);
// const handler = (data) => {
//   money.value = data;
// }
const bank = ref('工商银行');
const name = ref('张三');
</script>

<style scoped></style>
