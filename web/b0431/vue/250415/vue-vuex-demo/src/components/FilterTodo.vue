<template>
	<div class="FilterTodo">
		<span>筛选：</span>
		<select v-model="count" @change="filtertodos(count)">
			<option value="200">200</option>
			<option value="150">150</option>
			<option value="100">100</option>
			<option value="50">50</option>
			<option value="20">20</option>
			<option value="10">10</option>
			<option value="5">5</option>
		</select>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	name: '',
	data() {
		return {
			count: 200,
		};
	},
	components: {},
	methods: {
		...mapActions(['filterTodo']),
		filtertodos(count) {
			this.filterTodo(count);
		},
	},
};
</script>

<style scoped>
.FilterTodo {
	margin: 0 auto;
}
select {
	cursor: pointer;
	border: 1px solid #41b883;
}
</style>
