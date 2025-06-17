<template>
	<div class="header-container">
		<div class="left-content">
			<el-button icon="el-icon-menu" size="mini" style="margin-right: 20px" @click="handleMenu1"></el-button>
			<!-- 面包屑区域 -->
			<el-breadcrumb separator="/">
				<el-breadcrumb-item
					v-for="item in tags"
					:key="item.path"
					:to="{ path: item.path }"
					:class="{
						'is-active': $route.path === item.path,
						//添加类名实现高亮
					}"
				>
					{{ item.label }}
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="right-content">
			<el-dropdown @command="handleClick">
				<span class="el-dropdown-link"> <img src="../assets/img/熊大.png" alt="" /></span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item>个人中心</el-dropdown-item>
					<el-dropdown-item command="cancel">退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import Cookie from 'js-cookie';
export default {
	name: '',
	data() {
		return {};
	},
	components: {},
	methods: {
		...mapMutations(['handleMenu']),

		handleMenu1() {
			this.handleMenu();
		},
		handleClick(command) {
			if (command == 'cancel') {
				//清除cookie中的token
				Cookie.remove('token');
				//清除cookie中的menu
				Cookie.remove('menu');
				this.$router.go(0);
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
.header-container {
	padding: 0 20px;
	background-color: #333;
	height: 60px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.text {
	font-size: 14px;
	color: #fff;
	margin-left: 10px;
}
.el-dropdown-link {
	img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
}
.left-content {
	display: flex;
	align-items: center;

	/deep/ .el-breadcrumb__item {
		.el-breadcrumb__inner {
			font-weight: normal;
			&.is-link {
				color: #666;
			}
		}

		// 当前激活的面包屑项样式
		&.is-active {
			.el-breadcrumb__inner {
				color: #ffffff;
				font-weight: bold;
			}
		}
	}
}
</style>
