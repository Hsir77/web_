<template>
	<div class="common-layout">
		<el-container>
			<el-header height="50px">
				<AppHeader></AppHeader>
			</el-header>

			<el-container>
				<el-aside width="230px">
					<AppNavBar></AppNavBar>
				</el-aside>

				<el-main>
					<AppMain></AppMain>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script lang="ts" setup>
import AppHeader from '@/components/AppHeader/index.vue';
import AppMain from '@/components/AppMain/index.vue';
import AppNavBar from '@/components/AppNavBar/index.vue';
</script>

<style scoped>
.el-container {
	height: calc(100vh - 50px);
}
.el-header {
	background-color: #2d3a4b;
}
.el-aside {
	background-color: #545c64;
	overflow-y: auto;
	height: calc(100vh - 50px);
}
.el-main {
	background-color: #ffffff;
	overflow-y: auto;
}

.el-aside::-webkit-scrollbar {
	/*去除滚动条 */
	display: none;
}
.el-main::-webkit-scrollbar {
	/*去除滚动条 */
	display: none;
}
</style>
