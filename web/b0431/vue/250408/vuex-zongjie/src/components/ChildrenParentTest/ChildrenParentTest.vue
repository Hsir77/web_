<template>
	<div>
		<h2>BABA有存款: {{ money }}</h2>
		<button @click="jieQianSon(100)">找小明借钱100</button><br />
		<button @click="jieQianDaughter(150)">找小红借钱150</button><br />
		<button @click="jieQianAll(200)">找所有孩子借钱200</button><br />
		<br />
		<!-- 小明 -->
		<Son ref="son" />
		<br />
		<!-- 小红 -->
		<Daughter ref="daughter" />
	</div>
</template>

<script>
import Son from './Son';
import Daughter from './Daughter';

export default {
	name: 'ChildrenParentTest',
	data() {
		return {
			money: 1000,
		};
	},

	methods: {
		jieQianSon(m) {
			this.money += m;
			this.$refs.son.money -= m;
		},
		jieQianDaughter(m) {
			this.money += m;
			this.$refs.daughter.money -= m;
		},
		jieQianAll(m) {
			this.money += m * this.$children.length;
			this.$children.forEach((item) => {
				item.money -= m;
			});
		},
	},

	components: {
		Son,
		Daughter,
	},
};
</script>

<style></style>
