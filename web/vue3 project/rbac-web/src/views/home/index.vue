<template>
	<div>
		<h1 class="home_title" style="text-align: center">
			<el-button :icon="ArrowLeft" @click="getPreYearData">上一年</el-button>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span>{{ year }}</span>
			<span>年学员数量</span>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<el-button @click="getNextYearData">
				下一年
				<el-icon><ArrowRight /></el-icon>
			</el-button>
		</h1>
		<div id="myChart" style="height: 500px"></div>
	</div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { reqStudentDate } from '@/api/student';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';

// 当前年份（用于筛选数据）
const year = ref(new Date().getFullYear());
const getPreYearData = () => {
	year.value--;
	drawChart();
};

const getNextYearData = () => {
	year.value++;
	drawChart();
};
console.log(year.value.toString());

const drawChart = () => {
	reqStudentDate(year.value).then((response) => {
		console.log(response);

		const resp = response;
		console.log('resp', resp);
		if (resp.status == 0) {
			var chartDom = document.getElementById('myChart');
			var myChart = echarts.init(chartDom);
			var option;
			// 展示数据
			let dataArr = [0];
			if (resp.data && resp.data.length) {
				resp.data.forEach((item) => {
					dataArr[parseInt(item._id) - 1] = item.count;
				});
			} else {
				// this.$message({
				//   message:'当前年份无数据',
				//   type:'warning'
				// })
			}
			option = {
				xAxis: {
					type: 'category',
					data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				},
				yAxis: {
					type: 'value',
				},
				series: [
					{
						data: dataArr,
						type: 'bar',
					},
				],
			};
			option && myChart.setOption(option);
		}
	});
};
onMounted(() => {
	drawChart();
});
</script>

<style scoped></style>
