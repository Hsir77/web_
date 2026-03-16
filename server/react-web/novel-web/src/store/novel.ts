import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { NovelStoreState } from "../types/store";

const useNovelStore = create<NovelStoreState>()(
  immer((set) => ({
    type: "zongheng",
    filter: {},
    loading: false,
    zonghengList: [],
    qimaoList: [],
    shuqiList: [],
    chapterList: [],
    myBookshelfList:[],
    searchList: [],
    setType: (type) => set((state) => { state.type = type; }),
    setFilter: (filter) => set((state) => { state.filter = { ...state.filter, ...filter }; }),
    setLoading: (loading) => set((state) => { state.loading = loading; }),
    setZonghengList: (list) => set((state) => { state.zonghengList = list;}),
    setQimaoList: (list) => set((state) => { state.qimaoList = list; }),
    setShuqiList: (list) => set((state) => { state.shuqiList = list; }),
    setChapterList: (list) => set((state) => { 
      state.chapterList = list;
      console.log('章节列表已存储：', state.chapterList);
    }),
    setMyBookshelfList:(list) => set((state)=>{state.myBookshelfList = list}),
    setSearchList: (list) => set((state)=>{ state.searchList = list }),
  }))
);

export default useNovelStore;