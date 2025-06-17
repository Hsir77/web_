<template>
	<div class="AddTodos">
		<h3>添加待办事项</h3>
		<form @submit.prevent="onSubmit">
			<input type="text" v-model="title" />
			<input type="submit" />
		</form>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	name: '',
	data() {
		return {
			title: '',
		};
	},
	components: {},
	methods: {
		...mapActions(['submittodos']),
		onSubmit() {
			this.submittodos(this.title);
		},
	},
};
</script>

<style scoped>
.AddTodos {
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	margin-bottom: 20px;
}

form {
	display: flex;
	width: 100%;
	height: 35px;
}
input[type='text'] {
	flex: 8;
	border: 1px solid #41b883;
	outline: none;
}
input[type='submit'] {
	flex: 2;
	background-color: #41b883;
	color: #fff;
	cursor: pointer;
	border: 1px solid #41b883;
}
</style>
