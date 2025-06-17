<template>
	<div class="">
		<el-menu
			:default-active="$route.path"
			class="el-menu-vertical-demo"
			@open="handleOpen"
			@close="handleClose"
			:collapse="isCollapse"
			background-color="#545c64"
			text-color="#fff"
			active-text-color="#ffd04b"
		>
			<h3>{{ isCollapse ? '后台' : '通用后台管理系统' }}</h3>

			<!-- 无子菜单的菜单项 -->
			<el-menu-item v-for="item in nochildren" :key="item.name" :index="item.path" @click="clickMenu(item)">
				<i :class="`el-icon-${item.icon}`"></i>
				<span slot="title">{{ item.label }}</span>
			</el-menu-item>

			<!-- 有子菜单的菜单项 -->
			<el-submenu v-for="item in haschildren" :key="item.label" :index="item.label">
				<template slot="title">
					<i :class="`el-icon-${item.icon}`"></i>
					<span>{{ item.label }}</span>
				</template>
				<el-menu-item-group>
					<el-menu-item
						v-for="secondItem in item.children"
						:key="secondItem.name"
						:index="secondItem.path"
						@click="clickMenu(secondItem)"
					>
						{{ secondItem.label }}
					</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
import Cookie from 'js-cookie';
export default {
	data() {
		return {};
	},
	methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		},
		clickMenu(item) {
			if (this.$route.path != item.path) {
				this.$router.push(item.path); // 路由跳转
			}
			this.$store.commit('updateTag', item); // 更新标签栏
		},
	},
	computed: {
		nochildren() {
			return this.menuData.filter((item) => !item.children);
		},
		haschildren() {
			return this.menuData.filter((item) => item.children);
		},
		isCollapse() {
			return this.$store.state.tab.isCollapse;
		},
		menuData() {
			//将menu数据存在cookie和vuex中取出哪个都可
			return JSON.parse(Cookie.get('menu')) || this.$store.state.tab.menu;
		},
	},
};
</script>

<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 200px;
	min-height: 400px;
}
.el-menu {
	border-right: 0;
	height: 100vh;
	h3 {
		color: #fff;
		text-align: center;
		line-height: 48px;
		font-size: 16px;
		font-weight: 400;
	}
}
</style>
