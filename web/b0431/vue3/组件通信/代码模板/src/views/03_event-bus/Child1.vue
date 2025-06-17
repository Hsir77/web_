<template>
	<div class="child1">
		<h1>Child1</h1>
		{{ car }}
	</div>
</template>

<script setup lang="ts">
// import $bus from '@/bus';
import { onMounted, reactive } from 'vue';
let car: any = reactive({ aa: '' });

// 接收数据 使用$bus.on(执行的名称，回调函数(形参接收的数据))
onMounted(() => {
	// $bus.on('car', (data) => {
	// 	console.log('接收的数据', data);
	// 	car.aa = data;
	// });
});
</script>

<style scoped></style>
