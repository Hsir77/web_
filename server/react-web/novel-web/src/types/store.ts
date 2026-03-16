export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  role: string;
}

export interface ChartData {
  [key: string]: any;
}

export interface UserStoreActions {
  login: (data: { userInfo: UserInfo; permissions: string[] }) => void;
  logout: () => void;
}

export type UserStoreState = {
  userInfo: UserInfo | null;
  permissions: string[];
  isLogin: boolean;
} & UserStoreActions;

export interface ChapterItem {
  chapter_id: string | number;
  title: string;
  sort?: number;
  content?: string;
  chapter1_content?: string;
  chapter2_content?: string;
  chapter3_content?: string;
}

export interface NovelItem {
  book_id: string;
  source: string;
  title: string;
  author: string;
  status: string;
  words: string;
  category: string;
  desc: string;
  cover: string;
}
export interface UserBookshelfItem {
  book_id: string;
  book_name: string;
  author_name: string;
  book_status: string;
  category: string;
  word_count: number;
  book_intro: string;
  cover_url: string;
  source: string;
  last_view_time?: string;
}

export interface ChapterItem {
  chapter_id: string | number;
  title: string;
  sort?: number;
  content?: string;
  chapter1_content?: string;
  chapter2_content?: string;
  chapter3_content?: string;
  url?: string;
  chapterCatalog?: any;
}

export interface NovelFilter {
  category: string;
  source: string;
  minWords: number;
  sort: string;
}

export interface NovelStoreState {
  type: "zongheng" | "qimao" | "shuqi";
  filter: Partial<NovelFilter>;
  loading: boolean;
  zonghengList: NovelItem[];
  qimaoList: NovelItem[];
  shuqiList: NovelItem[];
  chapterList: ChapterItem[];
  myBookshelfList: UserBookshelfItem[];
  searchList: UserBookshelfItem[];
  setType: (type: "zongheng" | "qimao" | "shuqi") => void;
  setFilter: (filter: Partial<NovelFilter>) => void;
  setLoading: (loading: boolean) => void;
  setZonghengList: (list: NovelItem[]) => void;
  setQimaoList: (list: NovelItem[]) => void;
  setShuqiList: (list: NovelItem[]) => void;
  setChapterList: (list: ChapterItem[]) => void;
  setMyBookshelfList: (list: UserBookshelfItem[]) => void;
  setSearchList: (list: UserBookshelfItem[]) => void;
}

export type NovelType = "zongheng" | "qimao" | "shuqi";

export interface EchartsState {
  chartData: ChartData;
  chartType: "bar" | "line" | "pie";
  refresh: boolean;
}

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  questionIndex?: number; // 哪条问题的序号
  timestamp?: number;
};

export interface AiStoreState {
  prompt: string;
  messages: Message[];
  loading: boolean;

  setPrompt: (text: string) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

// 新增书籍详情类型（兼容后端返回的完整对象）
export interface BookDetail {
  author_name?: string;
  book_id?: string;
  book_info?: string;
  book_name?: string;
  book_status?: string;
  chapters?: ChapterItem[];
  intro?: string;
  cover?: string;
  gender?: string;
  id?: string;
  is_collected?: boolean;
  source?: string;
  total_click?: number;
  total_subscribe?: number;
  url?: string;
  week_subscribe?: number;
  words?: number;
}
