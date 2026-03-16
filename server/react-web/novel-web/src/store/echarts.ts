import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { EchartsState, ChartData } from '../types/store';

const useEchartsStore = create(immer<EchartsState>((set) => ({
  chartData: {},
  chartType: 'bar',
  refresh: false,

  setChartData: (data: ChartData) =>
    set((state) => {
      state.chartData = data;
    }),

  setChartType: (type: 'bar' | 'line' | 'pie') =>
    set((state) => {
      state.chartType = type;
    }),

  triggerRefresh: () =>
    set((state) => {
      state.refresh = !state.refresh;
    }),
})));

export default useEchartsStore;