import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	// 专门存储仓库中的数据
	state: {
		count: 1,
		todos: [
			{ name: '张三', age: 18 },
			{ name: '李四', age: 18 },
			{ name: '王五', age: 18 },
			{ name: '赵六', age: 18 },
		],
	},
	// 里面存放的方法，这个方法用来修改mutations中的数据
	mutations: {
		jia(state, n) {
			console.log(state);
			// console.log(n);
			state.count += n;
		},
		jian(state, n) {
			// console.log(state);
			// console.log(n);
			state.count -= n;
		},
	},
	// 可以获取异步请求，获取请求回来的数据，调用mutations中的方法，达到修改state中的数据
	actions: {
		add(content, n) {
			// console.log(content);
			// console.log(n);
			content.commit('jia', n);
			content.state.count += n;
		},
	},
	// 派生属性，基于state衍生出来的数据
	getters: {
		desc(state) {
			if (state.count < 50) {
				return '吃饭';
			} else if (state.count < 100) {
				return '睡觉';
			} else {
				return '呆着';
			}
		},
	},
	modules: {},
});
