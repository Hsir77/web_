<template>
	<ul>
		<li v-for="(item, index) in todos" :key="index">
			<slot :item="item" :index="index"></slot>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'List',
	props: {
		todos: Array,
	},
};
</script>
