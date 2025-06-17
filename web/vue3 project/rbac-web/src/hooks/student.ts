import { ref } from 'vue';

export default function () {
	// 假设 FilterData 类型定义如下，若已有可复用，没有则补充
	interface FilterData {
		_id: string;
		name: string;
	}
	//性别
	let genderOptions = ref<FilterData[]>([
		{ _id: '0', name: '男' },
		{ _id: '1', name: '女' },
	]);

	// 学习方向选项
	let directionOptions = ref<FilterData[]>([
		{ _id: '0', name: 'Web前端' },
		{ _id: '1', name: 'JAVA' },
		{ _id: '2', name: 'C++' },
		{ _id: '3', name: '少儿编程' },
	]);

	// 年级选项
	let gradeOptions = ref<FilterData[]>([
		{ _id: '0', name: '大一' },
		{ _id: '1', name: '大二' },
		{ _id: '2', name: '大三' },
		{ _id: '3', name: '大四' },
		{ _id: '4', name: '在读研究生' },
	]);

	// 学历选项
	let educationOptions = ref<FilterData[]>([
		{ _id: '0', name: '高中' },
		{ _id: '1', name: '专科' },
		{ _id: '2', name: '本科' },
		{ _id: '3', name: '硕士' },
	]);

	// 通用 ID 转名称工具函数
	const dataFilter = (_id: string, options: FilterData[]): string => {
		const target = options.find((item) => item._id === _id);
		return target ? target.name : '';
	};
	// ID 转班级名工具函数
	const classFilter = (_id: string, options: any): string => {
		const target = options.find((item: any) => item._id === _id);
		return target ? target.classname : '';
	};
	// ID 转学校名工具函数
	const schoolFilter = (_id: string, options: any): string => {
		const target = options.find((item: any) => item._id === _id);
		return target ? target.schoolname : '';
	};
	// ID 转专业名工具函数
	const majorFilter = (_id: string, options: any): string => {
		const target = options.find((item: any) => item._id === _id);
		return target ? target.majorname : '';
	};
	//格式化性别
	const resetGender = (row: any, column: any, cellValue: any, index: number) => {
		let role = genderOptions?.value?.find((item) => {
			return item._id == cellValue;
		});
		return role?.name;
	};
	//格式化学习方向
	const resetDiredction = (row: any, column: any, cellValue: any, index: number) => {
		let role = directionOptions?.value?.find((item) => {
			return item._id == cellValue;
		});
		return role?.name;
	};

	return {
		genderOptions,
		directionOptions,
		educationOptions,
		gradeOptions,
		dataFilter,
		classFilter,
		schoolFilter,
		majorFilter,
		resetGender,
		resetDiredction,
	};
}
