//获取专业班级学校
import { ref } from 'vue';

import useClassStore from '@/stroe/modules/class';
import useMajorStroe from '@/stroe/modules/major';
import useSchoolStroe from '@/stroe/modules/school';
let classStore = useClassStore();
let majorStore = useMajorStroe();
let schoolStore = useSchoolStroe();

//约束类型
import type { classInfoData } from '@/api/class/type';
import type { schoolInfoData } from '@/api/school/type';
import type { majorInfoData } from '@/api/major/type';
export default function () {
	let schoolOptions = ref<schoolInfoData[]>([]);
	let classOptions = ref<classInfoData[]>([]);
	let majorOptions = ref<majorInfoData[]>([]);

	const getClassAll = (): void => {
		// 如果班级数据已存在，直接赋值
		if (classStore.classes?.length) {
			classOptions.value = classStore.classes;
		} else {
			// 异步获取班级数据，成功后赋值
			classStore.getClassAll().then(() => {
				classOptions.value = classStore.classes as classInfoData[];
			});
		}
	};
	const getMajorAll = (): void => {
		if (majorStore.majors?.length) {
			majorOptions.value = majorStore.majors;
		} else {
			majorStore.getMajorAll().then(() => {
				majorOptions.value = majorStore.majors as majorInfoData[];
			});
		}
	};
	const getSchoolAll = (): void => {
		if (schoolStore.schools?.length) {
			schoolOptions.value = schoolStore.schools;
		} else {
			schoolStore.getSchoolAll().then(() => {
				schoolOptions.value = schoolStore.schools as schoolInfoData[];
			});
		}
	};
	//格式化数据
	//@ts-ignore
	const resetClassName = (row: any, column: any, cellValue: any, index: number) => {
		let role = classOptions?.value?.find((item) => {
			return item._id == cellValue;
		});
		return role?.classname;
	};
	return { schoolOptions, majorOptions, classOptions, getClassAll, getMajorAll, getSchoolAll, resetClassName };
}
