<template>
	<div class="Todos">
		<h3>待办事项</h3>
		<div class="todosheader">
			<span> 双击表示完成</span>
			<span> <span id="green"></span>=已完成 </span>
			<span> <span id="black"></span>=未完成 </span>
		</div>
		<div class="todofa">
			<div
				class="todo"
				v-for="(item, index) in alltodos"
				:key="index"
				:class="{ active: item.completed }"
				@dblclick="changeColor(item)"
			>
				{{ item.id }}.{{ item.title }}
				<img src="@/assets/del.png" alt="" @click="deleteTodo(item.id)" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
	name: 'Todos',
	data() {
		return {};
	},
	components: {},
	methods: {
		...mapActions(['fetchtodos', 'deleteTodos', 'changeItemCompleted']),
		deleteTodo(id) {
			this.deleteTodos(id);
		},
		changeColor(item) {
			item.completed = !item.completed;
			this.changeItemCompleted(item);
		},
	},
	computed: {
		...mapGetters(['alltodos']),
	},
	created() {
		this.fetchtodos();
	},
};
</script>

<style scoped>
div.active {
	background-color: #35495e;
	box-sizing: border-box;
	border-radius: 5px;
	width: 31.33%;
	margin: 1%;
	padding: 10px;
	border: 1px solid #35495e;
	position: relative;
}
.todosheader {
	display: flex;
	justify-content: space-around;
}
#green {
	display: inline-block;
	width: 10px;
	height: 10px;
	background-color: #41b883;
}
#black {
	display: inline-block;
	width: 10px;
	height: 10px;
	background-color: #35495e;
}
.todofa {
	display: flex;
	flex-wrap: wrap;
}
.todo {
	background-color: #41b883;
	box-sizing: border-box;
	border-radius: 5px;
	width: 31.33%;
	margin: 1%;
	padding: 10px;
	border: 1px solid #41b883;
	position: relative;
}
img {
	position: absolute;
	right: 10px;
	bottom: 10px;
	width: 17px;
	height: 17px;
}
</style>
