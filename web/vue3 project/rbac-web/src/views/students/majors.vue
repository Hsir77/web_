<template>
	<div>
		<!-- 添加按钮 -->
		<div class="role_button_box">
			<el-button type="primary" @click="handleAdd">新增专业</el-button>
		</div>
		<!-- 表单 -->
		<el-table :data="majors" style="width: 100%">
			<!-- type="index" 获取索引值，从1开始； label 显示的标题； prop 数据字段名； width 列的宽度 -->
			<el-table-column type="index" label="序号" width="100"></el-table-column>
			<el-table-column prop="majorname" label="专业名称"></el-table-column>

			<el-table-column label="操作" width="200">
				<template #default="scope">
					<el-button size="small" @click="handleEdit(scope.row._id)"> 编辑 </el-button>

					<el-button size="small" type="danger" @click="handleDelete(scope.row._id)"> 删除 </el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页控件 -->
		<el-pagination
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			:page-sizes="[5, 10, 15, 20]"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
		<!-- 添加/编辑的弹出框 -->
		<el-dialog v-model="dialogFormVisible" title="专业添加/编辑" width="500">
			<el-form :model="majorForm" label-width="auto" ref="majorFormRef" :rules="rules">
				<el-form-item label="专业名称" prop="majorname">
					<el-input v-model="majorForm!.majorname" autocomplete="off" placeholder="请输入专业名称" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取消</el-button>

					<el-button
						type="primary"
						@click="majorForm._id == null ? confirmAdd(majorFormRef) : confirmEdit(majorFormRef)"
					>
						确认
					</el-button>
					<!-- 提交的数据为什么要通过ref传递进来，因为通过ref可以获取表单元素的实例，则ref具有表单校验的方法 -->
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref, reactive, nextTick } from 'vue';
// 引入数据类型
import type { majorInfoData } from '@/api/major/type';
// 引入专业小仓库
import useMajorStore from '@/stroe/modules/major';
let majorStore = useMajorStore();

// 专业数据列表(从store仓库中获取)
const majors = ref<majorInfoData[] | undefined>([]);
//弹出框表单数据绑定
let majorForm = ref<majorInfoData>({
	majorname: '',

	_id: null,
});
//定义弹出框绑定的ref
const majorFormRef = ref<FormInstance>();

const dialogFormVisible = ref(false);

// 当前页面
const currentPage = ref(1);
// 一页显示多少条数据
const pageSize = ref(5);
// 总条数
const total = ref(0);
// 总页数
const totalPage = ref(1);
// 当每页显示条数发送变化时回调函数
const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getMajorList();
};
// 当页码发送变化时回调函数
const handleCurrentChange = (val: number) => {
	currentPage.value = val;
	getMajorList();
};
//定义表单校验规则
const rules = reactive<FormRules>({
	majorname: [{ required: true, trigger: ['blur', 'change'], message: '请填写专业名称' }],
});
//添加按钮事件
const handleAdd = () => {
	dialogFormVisible.value = true;
};
//编辑专业
const handleEdit = (id: string) => {
	handleAdd();
	majorStore.getMajorById(id).then((res) => {
		majorForm.value = res;
	});
	// majorForm.value = {
	// 	majorname: '',
	// 	_id: null,
	// };
};
//删除专业
const handleDelete = (id: string) => {
	ElMessageBox.confirm('确定要删除此条数据吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			majorStore.deleteMajor(id).then(() => {
				getMajorList();
				ElMessage({
					type: 'success',
					message: '删除成功',
				});
			});
		})
		.catch(() => {});
};
//确认添加
const confirmAdd = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			majorStore.addMajor(majorForm.value).then(() => {
				getMajorList();
				dialogFormVisible.value = false;
				majorForm.value = {
					majorname: '',
					_id: null,
				};
			});
		} else {
		}
	});
	dialogFormVisible.value = false;
};
//确认修改
const confirmEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			majorStore.updateMajor(majorForm.value).then(() => {
				getMajorList();
				dialogFormVisible.value = false;
				majorForm.value = {
					majorname: '',
					_id: null,
				};
			});
		} else {
		}
	});
	dialogFormVisible.value = false;
};
// 获取专业列表
const getMajorList = () => {
	majorStore.getMajorList({ page: currentPage.value, size: pageSize.value }).then((response) => {
		majors.value = majorStore.majors;
		total.value = response?.total as number;
		totalPage.value = total.value / pageSize.value;
	});
};
onMounted(() => {
	getMajorList();
});
</script>

<style scoped>
.el-pagination {
	margin-top: 20px;
}
</style>
