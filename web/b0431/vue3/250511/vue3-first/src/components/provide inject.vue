<template>
	<div class="">
		<p>{{ color }}</p>
		<button @click="color = 'blue'">蓝色</button>
		<button @click="color = 'pink'">分数</button>
		<button @click="color = 'green'">粉色</button>
		<son></son>
	</div>
</template>

<script lang="ts">
//provide inject 应用于祖孙或者更远的传递数据 在传递的数据provide依赖
//provide('参数名', 传递的值);
//在使用的时候
//const xxx = inject('参数名');
import { defineComponent, provide, ref } from 'vue';
import son from './children/son.vue';
export default defineComponent({
	name: 'App',
	setup() {
		const color = ref('red');
		provide('color', color);
		return { color };
	},
	components: {
		son,
	},
});
</script>

<style scoped></style>
