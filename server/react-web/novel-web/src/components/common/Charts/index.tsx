import React from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts-for-react";

export interface ChartItem {
  category?: string;
  total_recommend?: string | number;
  chapter_count?: number;
  word_count?: number;
}

interface CommonChartProps {
  type: "bar" | "barH" | "pie" | "scatter";
  data: ChartItem[] | number[][];

  width?: string | number;
  height?: string | number;

  color?: string;
  pieColors?: string[];

  title?: string;
  titleColor?: string;

  scatterXName?: string;
  scatterYName?: string;

  // 🔥 这里我给你加好了
  yAxisMin?: number;
  yAxisMax?: number;
}

// 统一数字格式化：12000 → 1.2W
function formatNum(n: number | string) {
  const num = Number(n);
  if (isNaN(num)) return "0";
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "W";
  }
  return num.toString();
}

const CommonChart: React.FC<CommonChartProps> = ({
  type,
  data,
  width = "100%",
  height = 400,
  color = "#2f80ed",
  pieColors = ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
  title,
  titleColor = "#333",
  scatterXName = "X轴",
  scatterYName = "Y轴",
  // 🔥 这里必须接收！
  yAxisMin,
  yAxisMax,
}) => {
  const isScatter = type === "scatter";
  const chartData = data as ChartItem[] | number[][];

  const xData = isScatter ? [] : (chartData as ChartItem[]).map(item => item.category);
  const values = isScatter ? [] : (chartData as ChartItem[]).map(item => Number(item.total_recommend));

  const option: EChartsOption = {
    title: title
      ? {
          text: title,
          left: "center",
          textStyle: { color: titleColor, fontSize: 16, fontWeight: 500 },
        }
      : undefined,

    tooltip: {
      trigger: type === "pie" ? "item" : "axis",
      backgroundColor: "#fff",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      borderRadius: 6,
      padding: [8, 12],
      textStyle: { color: "#333", fontSize: 14 },
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        if (type === "scatter") {
          const x = p.data[0];
          const y = p.data[1];
          return `${scatterXName}: ${formatNum(x)}<br/>${scatterYName}: ${formatNum(y)}`;
        }
        return `${p.name}<br/>${formatNum(p.value)}`;
      },
    },

    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: title ? "15%" : "5%",
      containLabel: true,
    },
  };

  // 柱状图
  if (type === "bar") {
    option.xAxis = {
      type: "category",
      data: xData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "#666",
        fontSize: 13,
        interval: 0,
        formatter: function (value: string) {
          const labelWidth = value.length * 13;
          const chartWidth = typeof width === "number" ? width : 1000;
          const maxLabelWidth = chartWidth / xData.length;
          if (labelWidth > maxLabelWidth) {
            return value.split('').join('\n');
          }
          return value;
        },
        lineHeight: 16,
        align: "center",
      },
    };

    option.yAxis = {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#f0f2f5" } },
      axisLabel: {
        color: "#666",
        fontSize: 13,
        formatter: (val) => formatNum(val),
      },
    };

    option.series = [
      {
        type: "bar",
        data: values,
        barWidth: "40%",
        itemStyle: {
          color: color,
          borderRadius: [4, 4, 0, 0],
        },
      },
    ];
  }

  // 横向柱状
  if (type === "barH") {
    option.xAxis = {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#f0f2f5" } },
      axisLabel: {
        color: "#666",
        fontSize: 13,
        formatter: (val) => formatNum(val),
      },
    };

    option.yAxis = {
      type: "category",
      data: xData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#666", fontSize: 13 },
    };

    option.series = [
      {
        type: "bar",
        data: values,
        barWidth: "40%",
        itemStyle: {
          color: color,
          borderRadius: [0, 4, 4, 0],
        },
      },
    ];
  }

  // 饼图
  if (type === "pie") {
    option.series = [
      {
        type: "pie",
        radius: ["40%", "55%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
        label: { show: true, formatter: "{b}: {d}%" },
        data: (chartData as ChartItem[]).map(item => ({
          name: item.category || "",
          value: Number(item.total_recommend),
        })),
        color: pieColors,
      },
    ];
  }

  // 散点图
  if (type === "scatter") {
    option.xAxis = {
      name: scatterXName,
      type: "value",
      nameLocation: "end",
      nameGap: 10,
      nameTextStyle: { color: "#666", fontSize: 12 },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      splitLine: { lineStyle: { color: "#f3f4f6", type: "dashed" } },
      axisLabel: {
        color: "#666",
        formatter: (val) => formatNum(val),
      },
    };

    option.yAxis = {
      name: scatterYName,
      type: "value",
      nameLocation: "end",
      nameGap: 10,
      // 🔥 已修复
      min: yAxisMin,
      max: yAxisMax,
      nameTextStyle: { color: "#666", fontSize: 12 },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      splitLine: { lineStyle: { color: "#f3f4f6", type: "dashed" } },
      axisLabel: {
        color: "#666",
        formatter: (val) => val,
      },
    };

    option.series = [
      {
        type: "scatter",
        symbol: "circle",
        symbolSize: 10,
        data: chartData as number[][],
        itemStyle: {
          color: color,
          opacity: 0.8,
        },
        emphasis: {
          itemStyle: {
            color: color,
            opacity: 1,
            borderColor: "#fff",
            borderWidth: 2,
          },
        },
      },
    ];
  }

  return (
    <ReactECharts
      option={option}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        backgroundColor: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        padding: 10,
      }}
    />
  );
};

export default CommonChart;