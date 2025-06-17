<template>
	<div class="manage">
		<el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
			<!-- 用户的表单信息 -->
			<el-form ref="form" :model="form" :inline="true" label-width="80px" :rules="rules">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="form.name" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="年龄" prop="age">
					<el-input v-model="form.age" placeholder="请输入年龄"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="form.sex" placeholder="请选择性别">
						<el-option label="男" :value="1"></el-option>
						<el-option label="女" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="出生日期" prop="birth">
					<el-date-picker v-model="form.birth" type="date" placeholder="选择日期" value-format="yyyy-MM-DD">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="地址" prop="addr">
					<el-input v-model="form.addr" placeholder="请输入地址"></el-input>
				</el-form-item>
			</el-form>
			<!-- 添加页编辑部分***************************************************************************************** -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="submitData()">确 定</el-button>
			</span>
			<!-- ***************************************************************************************************** -->
		</el-dialog>
		<!-- 新增button部分 -->
		<div class="manage-header">
			<el-button type="primary" @click="handAdd()">新增</el-button>
			<!-- 搜索部分 -->
			<el-form :model="userForm" :inline="true">
				<el-form-item>
					<el-input placeholder="请输入名称" v-model="userForm.name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!--  表格部分******************************************************************************************** -->

		<el-table :data="tableData" height="90%" style="width: 100%" stripe>
			<el-table-column prop="name" label="姓名"> </el-table-column>
			<el-table-column prop="age" label="年龄"> </el-table-column>
			<el-table-column prop="sex" label="性别">
				<!-- 自定义组件用于映射sex属性 -->
				<template slot-scope="scope">
					<span>{{ scope.row.sex === 1 ? '男' : '女' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="birth" label="出生日期"> </el-table-column>
			<el-table-column prop="addr" label="地址"> </el-table-column>
			<el-table-column prop="addr" label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleChange(scope.row)">编辑</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页部分********************************************************************************************* -->
		<div class="page">
			<el-pagination layout="prev, pager, next" :total="total" @current-change="handlePage"> </el-pagination>
		</div>
	</div>
</template>

<script>
import { getUser, addUser, editUser, delUser } from '../api';
export default {
	name: '',
	data() {
		return {
			dialogVisible: false,
			form: {
				name: '',
				age: '',
				sex: '',
				birth: '',
				addr: '',
			},
			rules: {
				name: [{ required: true, message: '请输入姓名' }],
				age: [{ required: true, message: '请输入年龄' }],
				sex: [{ required: true, message: '请选择性别' }],
				birth: [{ required: true, message: '请输入出生日期' }],
				addr: [{ required: true, message: '请输入地址' }],
			},
			tableData: [],
			modelType: 0, //用来控制新增和编辑的区别，新增为0编辑为1
			total: 0, //一共有多少条数据
			pageDate: {
				page: 1,
				limit: 10,
			},
			userForm: {
				name: '',
			},
		};
	},
	mounted() {
		//访问mock接口接收数据
		this.getList();
	},
	components: {},
	methods: {
		//提交用户表单
		submitData() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					//此时的form为表单填写的数据
					if (this.modelType == 0) {
						addUser(this.form).then(() => {
							this.getList();
						});
					} else {
						editUser(this.form).then(() => {
							this.getList();
						});
					}
					this.$refs.form.resetFields(); //清空表单数据
					this.dialogVisible = false; //关闭表单
				}
			});
		},
		//取消和关闭表单触发
		handleClose() {
			this.$refs.form.resetFields();
			this.dialogVisible = false;
		},
		//编辑表格中元素时触发
		handleChange(row) {
			this.dialogVisible = true;
			this.modelType = 1;
			this.form = JSON.parse(JSON.stringify(row));
		},
		//删除表格中元素时触发
		handleDelete(row) {
			console.log(row);
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					delUser({ id: row.id }).then(() => {
						this.$message({
							type: 'success',
							message: '删除成功!',
						});
						this.getList();
					});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		//新增元素时触发
		handAdd() {
			this.dialogVisible = true;
			this.modelType = 0;
		},
		handlePage(val) {
			this.pageDate.page = val;
			this.getList();
		},
		//列表查询
		onSubmit() {
			this.getList();
		},
		//将获取数据的方法封装起来，在生命周期调用一次，在新增和编辑的时候也进行调用（重新渲染数据）
		getList() {
			getUser({ params: { ...this.pageDate, ...this.userForm } }).then(({ data }) => {
				this.tableData = data.list;
				console.log(data); // 正确地在回调函数内部使用 data
				this.total = data.count;
			});
		},
	},
};
</script>

<style scoped lang="less">
.manage {
	height: 89%;
	padding: 0 10px;

	.manage-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.page {
		width: 100%;
		height: 10%;
		position: relative;
		::v-deep .el-pagination {
			position: absolute;
			bottom: 0;
			right: 20px;
		}
	}
}
</style>
