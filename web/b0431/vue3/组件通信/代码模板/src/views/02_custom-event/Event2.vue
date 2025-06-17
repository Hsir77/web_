<template>
	<div>
		<p>event2</p>
		<button @click="ccc">event2摁扭</button>
	</div>
</template>
<script lang="ts" setup>
let emit = defineEmits(['click']);
const ccc = () => {
	emit('click', '子组件回传');
};
</script>
<style scoped></style>
