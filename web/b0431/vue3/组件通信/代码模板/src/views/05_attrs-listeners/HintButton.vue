<template>
	<div>
		<el-button v-bind="attrs">子组件按钮</el-button>
	</div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
// let porps = defineProps(['type', 'title'])
// vue3中提供了一个useAttres 接收父组件传递过来的所有的参数
let attrs = useAttrs();
// useAttrs 返回结果事一个对象 里面存储父组件传递过来的数据
// 注意点: 如果已经使用defineProps接收的数据 那么这个对象重中不会存在
console.log(attrs);
</script>

<style scoped></style>
