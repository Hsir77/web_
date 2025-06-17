<template>
	<div class="">
		<label for="">
			<input type="text" v-model="name1.firstname" />
		</label>
		<label for="">
			<input type="text" v-model="name1.lastname" />
		</label>
		<label for="">
			<input type="text" v-model="allname" />
		</label>
		<label>
			<input type="text" v-model="allname1" />
		</label>
		<label>
			<span>姓名</span>
			<input type="text" v-model="fullname" />
		</label>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
export default defineComponent({
	name: 'App',
	setup() {
		const fullname = ref('');
		const name1 = reactive({
			firstname: '张',
			lastname: '三',
			obj: {
				age: 18,
				name: {
					name: {
						name: {},
					},
				},
			},
		});
		const allname = computed(() => {
			return name1.firstname + '-' + name1.lastname;
		});
		const allname1 = computed({
			get() {
				return name1.firstname + '-' + name1.lastname;
			},
			set(value) {
				const name = value.split('-');
				name1.firstname = name[0];
				name1.lastname = name[1];
			},
		});
		watch(
			name1,
			() => {
				return (fullname.value = name1.firstname + '-' + name1.lastname);
			},
			{ immediate: true },
		);

		return { name1, allname, allname1, fullname };
	},
});
</script>

<style scoped></style>
