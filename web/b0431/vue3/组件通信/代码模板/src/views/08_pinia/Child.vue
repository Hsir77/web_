<template>
	<div class="child">
		<h1>这是Child</h1>
		<h3>count:{{ infoStore.count }}</h3>
		<h3>arr数组的和：{{ infoStore.ArrAdd }}</h3>
		<ul>
			<li v-for="(item, index) in infoStore.arr" :key="index">{{ item }}</li>
		</ul>
		<button @click="updateCount">更新仓库数据</button>
	</div>
</template>

<script setup lang="ts">
// 使用仓库 先进行引入仓库
import userInfo from '../../store/modules/info';

let infoStore = userInfo();

const updateCount = () => {
	infoStore.unpdateNum(10);
};
</script>

<style scoped></style>
