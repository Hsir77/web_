<template>
	<div class="">
		<p>{{ user }}</p>
		<p>{{ readonlyUser }}</p>
		<p>
			{{ shallowUser }}
		</p>
		<button @click="updata1()">click</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, readonly, shallowReadonly } from 'vue';
export default defineComponent({
	name: 'App',
	setup() {
		const user = reactive({
			name: 'dacid',
			age: 18,
			sex: 'male',
			wife: {
				name: 'lacid',
				age: 18,
				sex: 'famale',
			},
		});
		const readonlyUser = readonly(user);
		const shallowUser = shallowReadonly(user);
		const updata1 = () => {
			// user.age += 1;
			// readonlyUser.age+=1
			shallowUser.wife.age += 1;
		};
		return { user, readonlyUser, shallowUser, updata1 };
	},
});
</script>

<style scoped></style>
