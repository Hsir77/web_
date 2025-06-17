<template>
	<el-tree
		style="max-width: 600px"
		:data="authList"
		show-checkbox
		node-key="index"
		default-expanded-all
		:default-checked-keys="checkedKeys"
		@check-change="handleCheckChange"
	/>
</template>

<script lang="ts" setup>
import menuList from '@/config/menuConfig';
import { onMounted, reactive, ref } from 'vue';
let props = defineProps(['role']);

//存储选中的节点
let checkedKeys = reactive<any>([]);

interface Tree {
	index: string;
}

//选中节点触发的事件
const handleCheckChange = (data: Tree, checked: boolean /*indeterminate: boolean*/) => {
	/**	共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点 */
	if (checked) {
		if (data.index !== '/students' && checkedKeys.indexOf(data.index) === -1) {
			checkedKeys.push(data.index);
		}
	} else {
		if (checkedKeys.indexOf(data.index) !== -1) {
			checkedKeys.splice(checkedKeys.indexOf(data.index), 1);
		}
	}
};

//创建树形控件所绑定的值
const authList = ref([]);
//递归迭代方法用于拿取menuList的值转为树形控件使用的值（authList）
const getAuthNodes = (menuList: any) => {
	return menuList.map((item: any) => {
		if (!item.children) {
			return {
				index: item.index,
				label: item.title,
			};
		} else {
			return {
				index: item.index,
				label: item.title,
				children: getAuthNodes(item.children),
			};
		}
	});
};
const getMenu = () => {
	return checkedKeys;
};
onMounted(() => {
	authList.value = getAuthNodes(menuList);
	//将角色名称写入到form中
	checkedKeys = props.role.menus;
});
defineExpose({
	getMenu,
});
</script>
