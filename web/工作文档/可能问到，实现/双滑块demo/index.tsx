/* eslint-disable */
// @ts-nocheck

import { createElement, useState, useRef, useImperativeHandle, forwardRef, ForwardRefRenderFunction } from '@max/max';
import { Image, Text, View, LinearGradient } from '@max/mbc-fusion';
import { isMPN, isWeb, isWeChatMiniProgram } from '@max/meituan-uni-env';
import { getScreenSize } from '@max/meituan-uni-fusion';
import './index.scss';

// 基础常量 - 名字直白，一眼能懂
const 屏幕宽度 = getScreenSize().width;
const 滑块间隙宽度 = 0; // 防滑块重叠的辅助宽度
const 默认滑块轨道宽度 = 屏幕宽度 - 2 * 23;
const 默认滑块按钮宽度 = 44;

// 接口定义 - 用中文注释说明用途，名字简化
interface 滑块参数 {
  touchWidth: number;        // 滑块按钮触摸宽度
  slideWidth: number;        // 滑块轨道宽度
  最小值: number;            // 可选数值最小值
  最大值: number;            // 可选数值最大值
  初始最小值: number;        // 初始选中的最小值
  初始最大值: number;        // 初始选中的最大值
  最小值文案: string;        // 最小值显示文字
  最大值文案: string;        // 最大值显示文字
  步长: number;              // 每次滑动变化的数值
  数值变化回调: (min: number, max: number) => void;
  设置禁止滚动: (disable: boolean) => void;
  是否单滑块: boolean;       // 是否是单滑块模式
}

interface 滑块暴露方法 {
  重置: (min?: number, max?: number) => { 左滑块位置: number; 右滑块位置: number };
}

interface 触摸事件数据 {
  pageX: number;
  pageY: number;
}

interface 统一触摸事件 {
  nativeEvent: 触摸事件数据;
  touches: 触摸事件数据[];
}

interface 滑块内部状态 {
  起始偏移: number | null;
  结束偏移: number | null;
  初始触摸起始值: number;
  初始触摸结束值: number;
}

interface 滑块像素范围 {
  start: number;
  end: number;
  max: number;
  min: number;
  最大像素值: number;
}

// 工具函数 - 名字直白，说明做什么
/**
 * 计算滑块按钮宽度（不同模式下）
 */
function 计算滑块宽度(容器宽度: number, 是否单滑块: boolean) {
  if (是否单滑块) {
    return 0.944 * 容器宽度 - 271.52;
  }
  return 0.788 * 容器宽度 - 166.0;
}

/**
 * 把数值转换成滑块的像素位置
 */
function 数值转像素(初始最小值: number, 初始最大值: number, 最大像素值: number, 最小值: number, 最大值: number) {
  const start = (初始最小值 / (最大值 - 最小值)) * 最大像素值;
  const end = (初始最大值 / (最大值 - 最小值)) * 最大像素值;
  return {
    最大像素值,
    start,
    end,
    min: 0,
    max: 最大像素值,
  };
}

/**
 * 统一不同平台的触摸事件
 */
function 统一触摸事件(event: 统一触摸事件) {
  const 标准化事件 = {} as 统一触摸事件;
  if (isMPN) {
    标准化事件.nativeEvent = event.nativeEvent;
  } else if (isWeb || isWeChatMiniProgram) {
    标准化事件.nativeEvent = event.touches[0];
  }
  return 标准化事件;
}

// 核心组件
const 双滑块: ForwardRefRenderFunction<滑块暴露方法, 滑块参数> = (props, ref) => {
  // 解构参数 - 用中文别名，好懂
  const {
    最小值 = 0,
    最大值 = 200,
    初始最小值 = 0,
    初始最大值 = 200,
    最小值文案 = '',
    最大值文案 = '',
    步长 = 10,
    数值变化回调 = () => {},
    设置禁止滚动 = () => {},
    是否单滑块 = false,
    touchWidth = 默认滑块按钮宽度,
    slideWidth = 默认滑块轨道宽度,
  } = props;

  // 状态管理 - 名字简单直白
  const [实际轨道宽度, 设置实际轨道宽度] = useState(slideWidth);
  const 已初始化布局 = useRef(false);
  const 容器引用 = useRef(null);
  const 滑块显示宽度 = 计算滑块宽度(实际轨道宽度, 是否单滑块);
  
  // 滑块像素位置（核心状态）
  const [滑块位置, 设置滑块位置] = useState(
    数值转像素(初始最小值, 初始最大值, slideWidth - 滑块间隙宽度, 最小值, 最大值)
  );
  
  const [当前激活滑块, 设置当前激活滑块] = useState<'left' | 'right'>('left');
  const 滑块状态 = useRef<滑块内部状态>({
    起始偏移: null,
    结束偏移: null,
    初始触摸起始值: 0,
    初始触摸结束值: 0,
  }).current;

  // --- 触摸事件处理（核心逻辑）---
  // 左滑块触摸开始
  const 左滑块触摸开始 = (event: 统一触摸事件) => {
    设置禁止滚动(true);
    const 标准事件 = 统一触摸事件(event);
    if (!滑块状态.起始偏移 || !滑块状态.结束偏移) {
      滑块状态.起始偏移 = 标准事件.nativeEvent.pageX;
      滑块状态.结束偏移 = 标准事件.nativeEvent.pageX;
    }
    滑块状态.初始触摸起始值 = 滑块位置.start;
    滑块状态.初始触摸结束值 = 滑块位置.end;
    设置当前激活滑块('left');
    return true;
  };

  // 左滑块触摸移动
  const 左滑块触摸移动 = (event: 统一触摸事件) => {
    const 标准事件 = 统一触摸事件(event);
    const 新滑块位置 = {
      ...滑块位置,
      start: 标准事件.nativeEvent.pageX - (滑块状态.起始偏移 || 0) + 滑块状态.初始触摸起始值,
    };
    校验并更新滑块位置(新滑块位置);
  };

  // 左滑块触摸结束
  const 左滑块触摸结束 = () => {
    设置禁止滚动(false);
    滑块状态.起始偏移 = null;
    滑块状态.初始触摸起始值 = 滑块位置.start;
  };

  // 右滑块触摸开始
  const 右滑块触摸开始 = (event: 统一触摸事件) => {
    设置禁止滚动(true);
    const 标准事件 = 统一触摸事件(event);
    if (!滑块状态.起始偏移 || !滑块状态.结束偏移) {
      滑块状态.起始偏移 = 标准事件.nativeEvent.pageX;
      滑块状态.结束偏移 = 标准事件.nativeEvent.pageX;
    }
    滑块状态.初始触摸起始值 = 滑块位置.start;
    滑块状态.初始触摸结束值 = 滑块位置.end;
    设置当前激活滑块('right');
    return true;
  };

  // 右滑块触摸移动
  const 右滑块触摸移动 = (event: 统一触摸事件) => {
    const 标准事件 = 统一触摸事件(event);
    const 新滑块位置 = {
      ...滑块位置,
      end: 标准事件.nativeEvent.pageX - (滑块状态.结束偏移 || 0) + 滑块状态.初始触摸结束值,
    };
    校验并更新滑块位置(新滑块位置);
  };

  // 右滑块触摸结束
  const 右滑块触摸结束 = () => {
    设置禁止滚动(false);
    滑块状态.结束偏移 = null;
    滑块状态.初始触摸结束值 = 滑块位置.end;
  };

  // 布局初始化
  const 处理容器布局 = (event) => {
    if (已初始化布局.current) return;
    const { width } = event.nativeEvent.layout;
    设置实际轨道宽度(width);
    已初始化布局.current = true;
  };

  // 校验滑块位置是否合法（防越界、防重叠）
  const 校验并更新滑块位置 = (新位置: 滑块像素范围) => {
    const 间隙 = 滑块间隙宽度;
    
    // 正常情况：左滑块 <= 右滑块
    if (新位置.start <= 滑块位置.end - 间隙 && 新位置.end - 间隙 >= 滑块位置.start) {
      if (新位置.start >= 滑块位置.min && 新位置.end <= 滑块位置.max) {
        更新滑块位置(新位置); // 位置合法，直接更