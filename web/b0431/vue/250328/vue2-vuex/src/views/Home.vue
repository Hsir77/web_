<template>
	<div class="">
		<!-- 调用vuex中的数据 -->
		<h1>{{ todos }}</h1>
		<h1>{{ count }}</h1>
		<ul>
			<li v-for="(item, index) in $store.state.todos" :key="index">
				{{ item.name }}
			</li>
		</ul>
		<button @click="jia(10)">加法</button>
		<button @click="jian(5)">减法</button>
		<h1>派生属性：{{ $store.getters.desc }}</h1>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	name: '',
	data() {
		return {};
	},
	components: {},
	computed: {
		...mapState({
			count: (state) => state.count,

			todos: (state) => state.todos,
		}),
	},
	methods: {
		...mapMutations(['jia', 'jian']),

		// jia(num) {
		// 	console.log(num);
		// 	// commit 就是用来调用vuex仓库中的mutations中的方法
		// 	// dispatch就是用来调用vuex仓库中actions中的方法
		// 	// commit(参数1，参数2)
		// 	// 参数1: mutations中的方法名 是一个字符串的形式
		// 	// 参数2: 要给方法传递的数据
		// 	this.$store.commit('jia1', num);
		// 	// console.log(this.$store);
		// 	// this.$store.dispatch('add', num);
		// },
		// jian(num) {
		// 	this.$store.commit('jian', num);
		// },
	},
};
</script>

<style scoped></style>
