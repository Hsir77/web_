<template>
	<div class="">
		<el-menu
			active-text-color="#ffd04b"
			background-color="#545c64"
			class="el-menu-vertical-demo"
			:default-active="$route.path"
			text-color="#fff"
			router="true"
		>
			<Menu :menuList="menuNodes"></Menu>
		</el-menu>
	</div>
</template>

<script lang="ts" setup>
import Menu from './menu/index.vue';
import menuList from '@/config/menuConfig';
import type { MenuChildrenData, MenuData } from './types/type';
import userUserStore from '@/stroe/modules/user';

let userStore = userUserStore();

const hashAuth = (item: MenuData) => {
	// menuList中的某一个元素
	const { index, isPublic } = item;
	// 当前登录的用户权限列表
	const menus = userStore.user?.role?.menus;
	// 当前登录的用户名
	const username = userStore.user?.username;

	if (username === 'admin' || isPublic || menus?.indexOf(index) !== -1) {
		return true;
	} else if (item.children) {
		return !!item.children.find((child: MenuChildrenData) => menus.indexOf(child.index) !== -1);
	} else {
		return false;
	}
};

// 存储要展示的菜单项
let menuNodes: any[] = [];
// 计算需要展示的菜单项
const getMenuNodes = () => {
	menuList.forEach((item) => {
		if (!item.children) {
			if (hashAuth(item)) {
				menuNodes.push(item);
			}
		} else {
			// 用于存储与当前登录用户权限列表匹配的二级菜单
			let tempArr: any = [];
			// 循环遍历二级菜单项数组
			item.children.forEach((i) => {
				// 如果当前循环遍历到的二级菜单项在登录的用户权限列表中存在，就添加到临时数组中
				if (hashAuth(i)) {
					tempArr.push(i);
				}
			});
			// 循环遍历结束后tempArr中存储的就是所有与当前登录用户权限列表匹配的二级菜单，赋值给students的children属性中
			let obj = { ...item, children: tempArr };
			// 将拥有二级菜单的菜单项添加到menuNodes
			menuNodes.push(obj);
		}
	});
};

getMenuNodes();
</script>

<style scoped></style>
