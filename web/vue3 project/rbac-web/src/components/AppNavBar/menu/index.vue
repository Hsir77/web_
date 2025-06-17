<template>
	<div>
		<template v-for="(item, index) in menuList" :key="index">
			<el-menu-item :index="item.index" v-if="!item.children">
				<el-icon>
					<!-- 这里为什么用component -->
					<!-- 因为图标的显示是标签名，不能将标签名渲染到页面上，如果想写只能 -->
					<!-- 
					<el-icon>
  				<HomeFilled v-if="item.icon === 'HomeFilled'" />
  				<User v-else-if="item.icon === 'User'" />
 				  <Medal v-else-if="item.icon === 'Medal'" />
 					更多图标... -->
					<!-- 这样一个个去判断 -->
					<!-- 会根据 item.icon 的值（如 'HomeFilled'）动态渲染对应的组件 -->

					<component :is="item.icon"></component>
				</el-icon>
				<span>{{ item.title }}</span>
			</el-menu-item>
			<!-- ****************************************************************** -->
			<el-sub-menu :index="item.index" v-if="item.children">
				<template #title>
					<el-icon>
						<component :is="item.icon"></component>
					</el-icon>
					<span>{{ item.title }}</span>
				</template>
				<!-- 递归写法 -->
				<!-- 如果有孩子el-sub-menu 才会显示，并且把孩子当成menulist重新渲染页面 -->
				<!-- 如果在js中进行判断有子无子只能判断一个层级，而递归的写法可以判断所有层级 -->
				<Menu :menuList="item.children"></Menu>
			</el-sub-menu>
		</template>
	</div>
</template>

<script lang="ts">
// 因为递归组件必须要有名称，所以使用vue2的写法给当前组件起一个名字
export default {
	name: 'Menu',
	props: ['menuList'],
};
</script>

<style scoped></style>
