<template>
	<div class="home">
		<el-row class="home">
			<el-col :span="8">
				<el-card class="box-card">
					<div class="user">
						<img src="../assets/img/熊大.png" alt="" />
						<div class="user-text">
							<p>Admin</p>
							<p>管理员</p>
						</div>
					</div>
					<div class="logo-info">
						<p>上次登陆的时间是：<span>2025:4:22</span></p>
						<p>上次登陆的地点是：<span>哈尔滨</span></p>
					</div>
				</el-card>
				<el-card style="margin-top: 10px; height: auto" class="box-card1">
					<el-table :data="tableData" style="width: 100%">
						<el-table-column prop="name" label="课程"> </el-table-column>
						<el-table-column prop="todayBuy" label="今日购买"> </el-table-column>
						<el-table-column prop="monthBuy" label="本月购买"> </el-table-column>
						<el-table-column prop="totalBuy" label="总购买"> </el-table-column>
					</el-table>
				</el-card>
			</el-col>
			<!-- 左1/3区域 -->

			<el-col :span="16">
				<div class="num">
					<el-card v-for="item in countData" :key="item.name" :body-style="{ display: 'flex', padding: 0 }">
						<i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color }"></i>
						<div>
							<p>￥{{ item.value }}</p>
							<p>{{ item.name }}</p>
						</div>
					</el-card>
				</div>
				<!-- 右下方三个图表 -->
				<div class="threeChart">
					<el-card style="height: 240px">
						<div ref="echarts1" style="height: 240px; width: 100% margin:0 auto"></div>
						<!-- 折线图 -->
					</el-card>
					<div class="graph">
						<el-card style="height: 200px">
							<div ref="echarts2" style="height: 200px; width: 100% margin:0 auto"></div>
						</el-card>
						<el-card style="height: 200px"
							><div ref="echarts3" style="height: 180px; width: 100% margin:0 auto"></div
						></el-card>
					</div>
				</div>
			</el-col>
			<!-- 右2/3区域 -->
		</el-row>
		<!-- <HelloWorld></HelloWorld> -->
	</div>
</template>

<script>
import { getData } from '../api';
import * as echarts from 'echarts';
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

export default {
	name: 'Home',
	data() {
		return {
			tableData: [],
			countData: [
				{
					name: '今日支付订单',
					value: 1234,
					icon: 'success',
					color: '#2ec7c9',
				},
				{
					name: '今日收藏订单',
					value: 210,
					icon: 'star-on',
					color: '#ffb980',
				},
				{
					name: '今日未支付订单',
					value: 1234,
					icon: 's-goods',
					color: '#5ab1ef',
				},
				{
					name: '本月支付订单',
					value: 1234,
					icon: 'success',
					color: '#2ec7c9',
				},
				{
					name: '本月收藏订单',
					value: 210,
					icon: 'star-on',
					color: '#ffb980',
				},
				{
					name: '本月未支付订单',
					value: 1234,
					icon: 's-goods',
					color: '#5ab1ef',
				},
			],
		};
	},
	mounted() {
		//在api index中封装了该方法 其中用axios获取数据（在utils）在生命周期中调用方法获取后端数据
		getData().then(({ data }) => {
			const { tableData, orderData, userData, videoData } = data.data;
			this.tableData = tableData;

			/**************************** */
			/*图表一数据段 */

			const orderDataKey = Object.keys(orderData.data[0]);
			var echarts1Option = {};
			echarts1Option.xAxis = {
				data: orderData.date,
			};
			echarts1Option.yAxis = {};
			echarts1Option.legend = {
				data: orderDataKey,
			};
			echarts1Option.series = [];
			orderDataKey.forEach((key) => {
				echarts1Option.series.push({
					name: key,
					type: 'line',
					data: orderData.data.map((item) => item[key]),
				});
			});
			const echarts1 = echarts.init(this.$refs.echarts1); //创建一个echarts实例，对象中存放该图标的数据
			echarts1.setOption(echarts1Option);
			/***************************************** */
			//柱状图
			var echarts2Option = {
				textStyle: {
					color: '#333',
				},
				legend: {},
				grid: {
					left: '20%',
				},
				// 提示框
				tooltip: {
					trigger: 'axis',
				},
				series: [
					{
						name: '新增用户',
						type: 'bar',
						data: userData.map((item) => item.new),
					},
					{ name: '活跃用户', type: 'bar', data: userData.map((item) => item.active) },
				],
			};
			echarts2Option.xAxis = {
				type: 'category', // 类目轴
				data: userData.map((item) => item.date),
				axisLine: {
					lineStyle: {
						color: '#17b3a3',
					},
				},
				axisLabel: {
					interval: 0,
					color: '#333',
				},
			};
			echarts2Option.yAxis = {
				type: 'value',
				axisLine: {
					lineStyle: {
						color: '#17b3a3',
					},
				},
			};

			const echarts2 = echarts.init(this.$refs.echarts2);
			echarts2.setOption(echarts2Option);
			/************************************************* */
			//饼状图
			var echarts3Option = {
				tooltip: {
					trigger: 'item',
				},
				legend: {
					orient: 'vertical',
					left: 'left',
				},
				series: [
					{
						name: 'Access From',
						type: 'pie',
						radius: '50%',
						data: videoData,
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)',
							},
						},
					},
				],
			};
			const echarts3 = echarts.init(this.$refs.echarts3);
			echarts3.setOption(echarts3Option);
		});
	},
	components: {
		// HelloWorld,
	},
};
</script>
<style lang="less" scoped>
// .el-card__body,
// .el-main {
// 	margin: 10px;
// }
.home {
	height: calc(100vh - 114px);
	overflow-y: scroll;
	scrollbar-width: none;
}
.box-card {
	margin-left: 7px;
	margin-top: 7px;
}
.box-card1 {
	margin-left: 7px;
}

.user {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 1px solid #ccc;
	margin-bottom: 10px;
	img {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		margin-right: 40px;
	}
	.user-text > p:nth-child(1) {
		font-size: 32px;
		margin-bottom: 10px;
	}
	.user-text > p:nth-child(2) {
		color: #999999;
	}
}
.logo-info {
	p {
		line-height: 28px;
		font-size: 14px;
		color: #999;
		span {
			margin-left: 60px;
			color: #666666;
		}
	}
}
.num {
	margin-top: 7px;
	display: flex;
	flex-wrap: wrap;
	.el-card {
		margin-bottom: 20px;
		width: 31%;
	}
	.icon {
		width: 80px;
		height: 80px;
		font-size: 30px;
		text-align: center;
		line-height: 80px;
		color: #fff;
	}
	div {
		margin-left: 15px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		p:nth-child(1) {
			font-size: 30px;
			margin-bottom: 10px;
			line-height: 30px;
			height: 30px;
		}
		p:nth-child(2) {
			font-size: 14px;
			color: #999999;
			text-align: center;
		}
	}
}
.threeChart {
	margin-left: 14px;
	margin-top: 5px;
	margin-right: 10px;
	.graph {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
		.el-card {
			width: 49%;
		}
	}
}
</style>
