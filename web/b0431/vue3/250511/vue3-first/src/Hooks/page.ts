import { onMounted, ref } from 'vue';
export default function () {
	let x = ref(0);
	let y = ref(0);
	const clickPage = (e: MouseEvent) => {
		x.value = e.pageX;
		y.value = e.pageY;
	};
	onMounted(() => {
		// 不建议直接使用 最好放在声明周期中
		window.addEventListener('click', clickPage);
	});
	return { x, y };
}
