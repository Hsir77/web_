import api from "../index";
import useNovelStore from "../../store/novel";
import { NovelItem, NovelType, NovelFilter } from "../../types/store";

export interface NovelListResult {
  list: NovelItem[];
  total: number;
  page: number;
  size: number;
}

export async function fetchNovelList(
  type: NovelType,
  page: number,
  size: number,
  filter: Partial<NovelFilter> = {}
): Promise<NovelListResult> {
  try {
    const queryObj: Record<string, string> = {
      page: String(page),
      size: String(size),
    };

    Object.entries(filter).forEach(([key, val]) => {
      if (val != null && val !== "") {
        queryObj[key] = String(val);
      }
    });

    const query = new URLSearchParams(queryObj);
    const url = `/${type}/list?${query.toString()}`;

    const res = await api.get(url);
    const data = res.data;
    if (!data) throw new Error("data 为空");

    const list: NovelItem[] = (data.list || []).map((item: any) => ({
      book_id: item.book_id,
      source: item.source,
      title: item.book_name,
      author: item.author_name,
      status: item.book_status,
      words: item.word_count,
      category: item.category,
      desc: item.book_intro,
      cover: item.cover_url,
    }));

    const store = useNovelStore.getState();
    switch (type) {
      case "zongheng":
        store.setZonghengList(list);
        break;
      case "qimao":
        store.setQimaoList(list);
        break;
      case "shuqi":
        store.setShuqiList(list);
        break;
    }

    return {
      list,
      total: data.total || 0,
      page: data.page || page,
      size: data.size || size,
    };
  } catch (error) {
    console.error("请求失败:", error);
    throw error;
  }
}


export async function fetchBookChapters(book_id:string, source:string, user_id:string) {
  try {
    const res = await api.get("/detail", {
      params: {
        book_id,
        source,
        user_id
      }
    });
    console.log('haugdjhada', res);
    return res.data || {};
  } catch (error) {
    console.error(error);
    throw error;
  }
}


// 加入书架
export async function addToBookshelf(
  user_id: number,
  book_id: string,
  source: string
): Promise<{ success: boolean; message: string }> {
  try {
    // 直接组装参数，不需要外面包对象
    const res = await api.post('/addToBookshelf', {
      user_id,
      book_id,
      source
    });
    const dataRes = res.data;
    if (!dataRes) throw new Error('data 为空');
    return dataRes;
  } catch (error) {
    console.error('加入书架失败:', error);
    throw error;
  }
}

// 从书架移除
export async function removeFromBookshelf(
  user_id: number,
  book_id: string,
  source: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.post('/removeFromBookshelf', {
      user_id,
      book_id,
      source
    });
    const dataRes = res.data;
    if (!dataRes) throw new Error('data 为空');
    return dataRes;
  } catch (error) {
    console.error('移除书架失败:', error);
    throw error;
  }
}

export async function fetchMyBookshelfList(user_id: string) {
  try {
    const res = await api.get('/myBookshelfList', {
      params: { user_id }
    });
    
    const data = res.data;
    console.log('api-data',data)
    if (!data) throw new Error('data 为空');


    const store = useNovelStore.getState();
    store.setMyBookshelfList(data);

    return data;
  } catch (error) {
    console.error('查询书架列表失败:', error);
    throw error;
  }
}

// 搜索我的书架
export async function searchMyBookshelf(
  user_id: string | number,
  keyword: string
) {
  try {
    const res = await api.get('/myBookSearch', {
      params: {
        user_id,
        keyword
      }
    });
    const data = res.data;
    if (!data) throw new Error('data 为空');

    const list = (data || []).map((item: any) => ({
      book_id: item.book_id,
      source: item.source,
      book_name: item.book_name,
      author_name: item.author_name,
      book_status: item.book_status,
      category: item.category,
      word_count: item.word_count,
      book_intro: item.book_intro,
      cover_url: item.cover_url
    }));

    const store = useNovelStore.getState();
    store.setMyBookshelfList(list);
    return list;
  } catch (error) {
    console.error('书架搜索失败:', error);
    throw error;
  }
}


// 全站搜索（无 user_id、无分页、无 size）
export async function searchAllNovels(keyword:string) {
  try {
    const res = await api.get("/search", {
      params: {
        keyword,
      },
    });

    const data = res.data;
    if (!data) return [];

    // 字段结构和书架搜索 100% 对齐
    const list = data.map((item:any) => ({
      book_id: item.book_id,
      book_name: item.book_name,
      author_name: item.author_name,
      book_status: item.book_status,
      category: item.category,
      word_count: item.word_count,
      book_intro: item.book_intro,
      cover_url: item.cover_url,
      source: item.source,
    }));

    // 存入独立搜索列表
    useNovelStore.getState().setSearchList(list);
    return list;
  } catch (error) {
    console.error("全站搜索失败：", error);
    useNovelStore.getState().setSearchList([]);
    throw error;
  }
}