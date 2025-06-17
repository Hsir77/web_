<template>
	<div class="">
		<ul>
			<li v-for="(item, index) in arr" :key="index">{{ item.name }}------{{ item.age }}</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: '',
	data() {
		return {
			arr: [
				{ name: 'li', age: 18 },
				{ name: 'ki', age: 18 },
				{ name: 'mi', age: 18 },
				{ name: 'ni', age: 18 },
			],
		};
	},
	components: {},
	methods: {},
};
</script>

<style scoped>
li {
	color: red;
}
</style>
