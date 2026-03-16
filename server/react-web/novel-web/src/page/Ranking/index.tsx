import React, { useEffect, useState, useCallback } from "react";
import styles from "./index.module.css";
import { Segmented, Pagination, Empty, Input, Button } from "antd";
import BookCard from "../../components/common/BookCard";
import { fetchNovelList, searchAllNovels } from "../../api/novel/index";
import useNovelStore from "../../store/novel";
import Filter from "../../components/common/Filter";
import { NovelFilter, NovelType } from "../../types/store";

const RankPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [filter, setFilter] = useState<Partial<NovelFilter>>({});

  const type = useNovelStore((state) => state.type);
  const setType = useCallback(
    (val: NovelType) => useNovelStore.getState().setType(val),
    [],
  );
  const setLoading = useCallback(
    (val: boolean) => useNovelStore.getState().setLoading(val),
    [],
  );

  const zonghengList = useNovelStore((state) => state.zonghengList);
  const qimaoList = useNovelStore((state) => state.qimaoList);
  const shuqiList = useNovelStore((state) => state.shuqiList);
  const searchList = useNovelStore((state) => state.searchList);
  const setSearchList = useNovelStore.getState().setSearchList;

  // 模式完全手动控制
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [keyword, setKeyword] = useState("");

  const list =
    type === "zongheng"
      ? zonghengList
      : type === "qimao"
      ? qimaoList
      : shuqiList;

  // 只在按搜索或回车时触发
  const handleSearch = async (value: string) => {
    const v = value?.trim();
    if (!v) {
      backToRank();
      return;
    }
    setKeyword(v);
    setIsSearchMode(true);
    setLoading(true);
    try {
      await searchAllNovels(v);
    } finally {
      setLoading(false);
    }
  };

  // 返回榜单
  const backToRank = () => {
    setIsSearchMode(false);
    setKeyword("");
    setSearchList([]);
  };

  const handleTypeChange = useCallback(
    (val: NovelType) => {
      setType(val);
      setFilter({});
      setCurrentPage(1);
      backToRank();
    },
    [setType],
  );

  const handleFilterChange = useCallback((queryString: string) => {
    const params = new URLSearchParams(queryString);
    const newFilter: Partial<NovelFilter> = {};
    params.forEach((v, k) => {
      (newFilter as any)[k] = v;
    });
    setFilter(newFilter);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (isSearchMode) return;
    let isUnmounted = false;
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchNovelList(type, currentPage, 20, filter);
        if (!isUnmounted) setTotal(res.total);
      } catch (err) {
        console.error(err);
      } finally {
        if (!isUnmounted) setLoading(false);
      }
    };
    loadData();
    return () => { isUnmounted = true; };
  }, [type, currentPage, filter, isSearchMode]);

  return (
    <div className={styles.container}>

      {/* ====================================== */}
      {/* 榜单模式 */}
      {!isSearchMode && (
        <>
          <div className={styles.header}>
            <Segmented
              className={styles.segmented}
              onChange={handleTypeChange}
              value={type}
              options={[
                {
                  label: (
                    <div style={{ padding: 4 }}>
                      <img
                        src="../../../public/75641db48248f87ac33872961541150f0664ca355157-vkNfoU_fw1200webp.webp"
                        alt="纵横"
                        style={{
                          transform: "scale(1.3) translateY(2px)",
                          width: "200px",
                          marginBottom: "5px",
                        }}
                      />
                    </div>
                  ),
                  value: "zongheng",
                },
                {
                  label: (
                    <div style={{ padding: 4 }}>
                      <img
                        src="https://cdn-front.qimao.com/qimao/pc/img/header/logo.d026f02.png"
                        alt="七猫"
                        style={{
                          transform: "scale(0.9) translateY(-10px)",
                          width: "200px",
                          marginBottom: "5px",
                          marginTop: "20px",
                        }}
                      />
                    </div>
                  ),
                  value: "qimao",
                },
                {
                  label: (
                    <div style={{ padding: 4 }}>
                      <img
                        src="https://img-tailor.11222.cn/cms/upload/img/1744254321654a5b1cd29-e04a-4891-a663-ef25c5ad1829.png"
                        alt="书旗"
                        style={{
                          width: "200px",
                          marginBottom: "15px",
                          marginTop: "20px",
                        }}
                      />
                    </div>
                  ),
                  value: "shuqi",
                },
              ]}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
            <Filter key={type} onFilterChange={handleFilterChange} />
            {/* 小搜索框：输入不会跳页 */}
            <Input.Search
              placeholder="搜索全站小说"
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
            />
          </div>
        </>
      )}

      {/* ====================================== */}
      {/* 搜索模式 */}
      {isSearchMode && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <Button type="text" onClick={backToRank} style={{ fontSize: 14 }}>
            ← 返回榜单
          </Button>
          <Input.Search
            placeholder="搜索全站小说"
            allowClear
            onSearch={handleSearch}
            style={{ flex: 1 }}
          />
        </div>
      )}

      <div className={styles.list}>
        {/* 原有榜单 */}
        {!isSearchMode && list?.length ? (
          list.map((item) => (
            <BookCard
              key={item.book_id}
              book_id={item.book_id}
              source={item.source}
              title={item.title}
              author={item.author}
              status={item.status}
              words={item.words}
              category={item.category}
              desc={item.desc}
              cover={item.cover}
            />
          ))
        ) : null}

        {/* 搜索结果 */}
        {isSearchMode && searchList?.length ? (
          searchList.map((item) => (
            <BookCard
              key={item.book_id}
              book_id={item.book_id}
              source={item.source}
              title={item.book_name}
              author={item.author_name}
              status={item.book_status}
              words={item.word_count}
              category={item.category}
              desc={item.book_intro}
              cover={item.cover_url}
            />
          ))
        ) : null}

        {/* 空 */}
        {((!isSearchMode && !list?.length) || (isSearchMode && !searchList?.length)) && (
          <Empty style={{ padding: 40 }} />
        )}
      </div>

      {!isSearchMode && list?.length > 0 && (
        <div className={styles.pagination}>
          <Pagination
            current={currentPage}
            pageSize={20}
            total={total}
            onChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default RankPage;