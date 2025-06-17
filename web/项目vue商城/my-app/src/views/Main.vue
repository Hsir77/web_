<template>
	<div class="">
		<el-container>
			<el-aside width="auto"><CommonAside></CommonAside></el-aside>
			<el-container>
				<el-header> <CommonHeader></CommonHeader></el-header>

				<CommonTag></CommonTag>

				<el-main> <router-view /></el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import CommonAside from '@/components/CommonAside.vue';
import CommonHeader from '@/components/CommonHeader.vue';
import CommonTag from '@/components/CommonTag.vue';

export default {
	name: '',
	data() {
		return {};
	},
	components: {
		CommonAside,
		CommonHeader,
		CommonTag,
	},
	methods: {},
};
</script>

<style scoped lang="less">
.el-header,
.el-main {
	padding: 0;
}
</style>
