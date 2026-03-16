export type PlatformType = "zongheng" | "qimao" | "shuqi";

export type FilterOption = {
  label: string;
  value: number | string;
};

export type FilterItem = {
  key: string;
  title: string;
  type: "tag" | "dropdown";
  multiple: boolean;
  options: FilterOption[];
};

export const fixedFilters: FilterItem[] = [
  {
    key: "gender",
    title: "性别",
    type: "tag",
    multiple: false,
    options: [
      { label: "男频", value: "male" },
      { label: "女频", value: "female" },
    ],
  },
  {
    key: "word_count",
    title: "字数",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "100 万以上", value: 1000000 },
      { label: "200 万以上", value: 2000000 },
      { label: "300 万以上", value: 3000000 },
      { label: "500 万以上", value: 5000000 },
      { label: "1000 万以上", value: 10000000 },
    ],
  },
  {
    key: "chapter_count",
    title: "章节数",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "300 章以上", value: 300 },
      { label: "500 章以上", value: 500 },
      { label: "1000 章以上", value: 1000 },
      { label: "2000 章以上", value: 2000 },
      { label: "5000 章以上", value: 5000 },
    ],
  },
];

export const zonghengSpecialFilters: FilterItem[] = [
  {
    key: "book_status",
    title: "状态",
    type: "tag",
    multiple: false,
    options: [
      { label: "连载中", value: "连载中" },
      { label: "已完结", value: "已完结" },
    ],
  },
  {
    key: "category",
    title: "分类",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "玄幻奇幻", value: "玄幻奇幻" },
      { label: "都市", value: "都市" },
      { label: "历史", value: "历史" },
      { label: "武侠仙侠", value: "武侠仙侠" },
      { label: "科幻", value: "科幻" },
      { label: "奇闻异事", value: "奇闻异事" },
      { label: "游戏", value: "游戏" },
      { label: "现实题材", value: "现实题材" },
      { label: "N次元", value: "N次元" },
      { label: "体育", value: "体育" },
    ],
  },
  {
    key: "total_click",
    title: "总点击",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "10 万以上", value: 100000 },
      { label: "50 万以上", value: 500000 },
      { label: "100 万以上", value: 1000000 },
      { label: "500 万以上", value: 5000000 },
      { label: "1000 万以上", value: 10000000 },
    ],
  },
  {
    key: "total_recommend",
    title: "总推荐",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "1000 以上", value: 1000 },
      { label: "5000 以上", value: 5000 },
      { label: "1 万以上", value: 10000 },
      { label: "5 万以上", value: 50000 },
      { label: "10 万以上", value: 100000 },
    ],
  },
  {
    key: "weekly_recommend",
    title: "周推荐",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "50 以上", value: 50 },
      { label: "100 以上", value: 100 },
      { label: "300 以上", value: 300 },
      { label: "500 以上", value: 500 },
      { label: "1000 以上", value: 1000 },
    ],
  },
];

export const qimaoSpecialFilters: FilterItem[] = [
  {
    key: "book_status",
    title: "状态",
    type: "tag",
    multiple: false,
    options: [
      { label: "连载中", value: "连载中" },
      { label: "已完结", value: "完结" },
    ],
  },
  {
    key: "category",
    title: "分类",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "都市", value: "都市" },
      { label: "现代言情", value: "现代言情" },
      { label: "古代言情", value: "古代言情" },
      { label: "玄幻奇幻", value: "玄幻奇幻" },
      { label: "历史", value: "历史" },
      { label: "幻想言情", value: "幻想言情" },
      { label: "奇闻异事", value: "奇闻异事" },
      { label: "现实主义", value: "现实主义" },
      { label: "游戏", value: "游戏" },
      { label: "科幻", value: "科幻" },
      { label: "武侠仙侠", value: "武侠仙侠" },
      { label: "N次元", value: "N次元" },
      { label: "军事", value: "军事" },
      { label: "体育", value: "体育" },
      { label: "衍生言情", value: "衍生言情" },
      { label: "现实题材", value: "现实题材" },
    ],
  },
  {
    key: "score",
    title: "评分",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "7 分以上", value: 7 },
      { label: "8 分以上", value: 8 },
      { label: "8.5 分以上", value: 8.5 },
      { label: "9 分以上", value: 9 },
      { label: "9.5 分以上", value: 9.5 },
    ],
  },
  {
    key: "popularity",
    title: "人气值",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "10 万以上", value: 100000 },
      { label: "50 万以上", value: 500000 },
      { label: "100 万以上", value: 1000000 },
      { label: "300 万以上", value: 3000000 },
      { label: "500 万以上", value: 5000000 },
    ],
  },
  {
    key: "read_count",
    title: "阅读量",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "1 万以上", value: 10000 },
      { label: "5 万以上", value: 50000 },
      { label: "10 万以上", value: 100000 },
      { label: "30 万以上", value: 300000 },
      { label: "50 万以上", value: 500000 },
    ],
  },
];

export const shuqiSpecialFilters: FilterItem[] = [
  {
    key: "book_status",
    title: "状态",
    type: "tag",
    multiple: false,
    options: [
      { label: "连载中", value: "连载" },
      { label: "已完结", value: "完结" },
    ],
  },
  {
    key: "category",
    title: "分类",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "扮猪吃虎", value: "扮猪吃虎" },
      { label: "穿越", value: "穿越" },
      { label: "重生", value: "重生" },
      { label: "系统", value: "系统" },
      { label: "修炼", value: "修炼" },
      { label: "逆袭", value: "逆袭" },
      { label: "HE", value: "HE" },
      { label: "虐渣打脸", value: "虐渣打脸" },
      { label: "情有独钟", value: "情有独钟" },
      { label: "日常", value: "日常" },
      { label: "打脸", value: "打脸" },
      { label: "1V1", value: "1V1" },
      { label: "异界", value: "异界" },
      { label: "升级", value: "升级" },
      { label: "风水相术", value: "风水相术" },
    ],
  },
  {
    key: "popularity",
    title: "人气值",
    type: "dropdown",
    multiple: false,
    options: [
      { label: "10 万以上", value: 100000 },
      { label: "50 万以上", value: 500000 },
      { label: "100 万以上", value: 1000000 },
      { label: "300 万以上", value: 3000000 },
      { label: "500 万以上", value: 5000000 },
    ],
  },
];
