<template>
	<div class="">
		<p>
			{{ user }}
		</p>
		<h4>ref</h4>
		<p>
			{{ age }}
		</p>
		<button @click="updata">click</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
export default defineComponent({
	name: 'App',
	setup() {
		const user = reactive({
			name: 'lisa',
			age: 18,
			sex: 'female',
		});
		const age = ref(user.age);
		//ref目的是将对象中某个属性单拿出来，使成为两个独立的个体，其中一个改变的时候不会影响另外一个
		//拷贝的是当前属性的值
		const updata = () => {
			age.value += 1;
		};
		//而toRef是拷贝当前的地址（没什么用）因为会变为浅拷贝，当前值改变也会带动原对象改变，不如直接obj.age
		return { user, age, updata };
	},
});
</script>

<style scoped></style>
