import axios from 'axios';
const state = {
	todos: [],
};
const mutations = {
	settodos(state, data) {
		state.todos = data;
	},
	newTodos(state, obj) {
		state.todos.unshift(obj);
	},
	deleteTodo(state, id) {
		state.todos = state.todos.filter((item) => item.id != id);
	},
	filterTodo1(state, data) {
		state.todos = data;
	},
	changeColor(state, data) {
		const dataIndex = state.todos.findIndex((item) => {
			return item.id == data.id;
		});

		state.todos.splice(dataIndex, 1, data);
		console.log(state.todos);
	},
};
const getters = {
	alltodos(state) {
		return state.todos;
	},
};
const actions = {
	async fetchtodos({ commit }) {
		const res = await axios.get('https://jsonplaceholder.typicode.com/todos');
		console.log(res.data);
		commit('settodos', res.data);
	},

	async submittodos({ commit, state }, title) {
		let obj = {
			completed: false,
			id: state.todos[state.todos.length - 1].id + 1,

			title: title,

			userId: 11,
		};
		const req = await axios.get('https://jsonplaceholder.typicode.com/todos', obj);
		commit('newTodos', obj);
	},

	async deleteTodos({ commit }, id) {
		commit('deleteTodo', id);
	},
	async filterTodo({ commit }, count) {
		const req = await axios.get(`https://jsonplaceholder.typicode.com/todos?_limit=${count}`);
		commit('filterTodo1', req.data);
	},
	async changeItemCompleted({ commit }, item) {
		const req = await axios.post('https://jsonplaceholder.typicode.com/todos', item);
		console.log(req.data);
		commit('changeColor', item);
	},
};
export default {
	state,
	mutations,
	getters,
	actions,
};
