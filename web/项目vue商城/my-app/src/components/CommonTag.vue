<template>
	<div class="tabs">
		<el-tag
			v-for="(item, index) in tags"
			:key="item.path"
			size="small"
			:closable="item.name != 'home'"
			:effect="$route.path === item.path ? 'dark' : 'plain'"
			@click="clickMenu(item)"
			@close="closeMenu(item, index)"
			>{{ item.label }}</el-tag
		>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	name: 'CommonTag',
	data() {
		return {};
	},
	components: {},
	methods: {
		...mapMutations(['deleteTag']),
		clickMenu(item) {
			this.$router.push(item.path);
		},
		closeMenu(item, index) {
			this.deleteTag(item);

			if (this.$route.path === item.path) {
				this.$router.push(this.tags[index - 1].path);
			}
		},
	},
	computed: {
		...mapState({
			tags: (state) => state.tab.tagLists,
		}),
	},
};
</script>

<style scoped lang="less">
.tabs {
	padding: 15px;
	height: 24px;
	.el-tag {
		margin-right: 15px;
		cursor: pointer;
	}
}
</style>
