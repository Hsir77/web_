import React, { useEffect, useRef, memo } from 'react'
import * as echarts from 'echarts'
import { CSSProperties } from 'react'

interface TrustChartProps {
  // 核心数据
  xData: string[]
  yData: number[]
  seriesName?: string

  // 新增：维度名称
  xAxisName?: string
  yAxisName?: string

  // 样式配置
  color?: string | string[]
  width?: string | number
  height?: string | number
  barWidth?: string

  // 文本配置
  title?: string
  titleFontSize?: number
  axisFontSize?: number

  // 布局配置
  gridLeft?: string
  gridRight?: string

  // 新增：Y轴刻度控制
  yAxisMin?: number
  yAxisMax?: number
  yAxisInterval?: number

  style?: CSSProperties
}

const TrustChart: React.FC<TrustChartProps> = memo(({
  xData,
  yData,

  seriesName = '数据指标',


  color = ['#8360c3', '#2ebf91'],
  width = '100%',
  height = 220,
  barWidth = '40%',

  title = '{xAxisName} - {yAxisName} 数据可视化',

  titleFontSize = 14,
  axisFontSize = 11,

  gridLeft = '8%',
  gridRight = '4%',

  yAxisMin,
  yAxisMax,
  yAxisInterval,

  style = {}
}) => {

  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    if (!chartRef.current) return

    const myChart = echarts.init(chartRef.current)


    // 自动计算Y轴范围
    const maxValue = Math.max(...yData)
    const minValue = Math.min(...yData)

    const defaultYMin = yAxisMin ?? Math.floor(minValue * 0.9)
    const defaultYMax = yAxisMax ?? Math.ceil(maxValue * 1.1)

    const option = {

      title: {
        left: 'center',
        textStyle: {
          fontSize: titleFontSize,
          color: '#333',
          fontWeight: 600
        }
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },

      grid: {
        left: gridLeft,
        right: gridRight,
        bottom: '15%',
        top: '18%',
        containLabel: true
      },

      xAxis: {
        type: 'category',

        nameLocation: 'middle',
        nameGap: 0,

        nameTextStyle: {
          fontSize: axisFontSize,
          color: '#2a2a2a'
        },

        data: xData,

        axisLabel: {
          fontSize: axisFontSize,
          color: '#2a2a2a',
          rotate: 0
        }
      },

      yAxis: {
        type: 'value',

        nameLocation: 'middle',
        nameGap: 35,

        nameTextStyle: {
          fontSize: axisFontSize,
          color: '#666'
        },

        min: defaultYMin,
        max: defaultYMax,
        interval: yAxisInterval,

        axisLabel: {
          fontSize: axisFontSize,
          color: '#666'
        },

        // 关键：显示刻度线
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e7eb'
          }
        }
      },

      series: [
        {
          name: seriesName,
          type: 'bar',
          data: yData,

          itemStyle: {
            color: Array.isArray(color)
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: color[0] },
                  { offset: 1, color: color[1] }
                ])
              : color,

            borderRadius: [6, 6, 0, 0]
          },

          barWidth: barWidth,

          // 柱子顶部显示数值
          label: {
            show: true,
            position: 'top',
            fontSize: axisFontSize,
            color: '#333'
          }
        }
      ]
    }

    myChart.setOption(option)

    const resizeHandler = () => myChart.resize()

    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
      myChart.dispose()
    }

  }, [
    xData,
    yData,
    seriesName,
    color,
    barWidth,
    title,
    titleFontSize,
    axisFontSize,
    gridLeft,
    gridRight,
    yAxisMin,
    yAxisMax,
    yAxisInterval
  ])

  const containerStyle: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style
  }

  return <div ref={chartRef} style={containerStyle} />
})

export default TrustChart