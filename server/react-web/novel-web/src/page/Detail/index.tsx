import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useNovelStore from "../../store/novel";
import { fetchBookChapters } from "../../api/novel";
import styles from "./index.module.css";
import { normalizeChapterList } from "./chaptorHelper";
import { addToBookshelf, removeFromBookshelf } from "../../api/novel/index";

const formatNumber = (num: number | string | undefined) => {
  if (!num && num !== 0) return "";
  const n = Number(num);
  if (isNaN(n)) return String(num);
  if (n >= 10000) {
    return (n / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  }
  return String(n);
};

const formatScore = (score: number | string | undefined) => {
  if (!score && score !== 0) return "";
  const n = Number(score);
  if (isNaN(n)) return String(score);
  return n.toFixed(1);
};

const getSourceColor = (source: string | undefined) => {
  switch (source) {
    case "zongheng":
      return "#ff4d4f";
    case "qimao":
      return "#ffb800";
    case "shuqi":
      return "#52c41a";
    default:
      return "#999";
  }
};

const Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { book_id, source, user_id } = location.state || {};
  const [openVolumes, setOpenVolumes] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [operateLoading, setOperateLoading] = useState(false); // 操作按钮加载

  const chapterList = useNovelStore((state) => state.chapterList);
  const setChapterList = useNovelStore((state) => state.setChapterList);

  const handleBack = () => {
     navigate(-1);

  };

  // 刷新书籍信息（操作书架后调用）
  const refreshBookInfo = async () => {
    try {
      const data = await fetchBookChapters(
        book_id as string,
        source as string,
        String(user_id),
      );
      setChapterList(data as any);
    } catch (err) {
      console.error("刷新失败", err);
    }
  };

  // ===================== 加入书架 =====================
  const handleAddShelf = async () => {
    if (!user_id || !book_id || !source) {
      alert("参数异常，无法加入书架");
      return;
    }
    try {
      setOperateLoading(true);
      await addToBookshelf(
        Number(user_id),
        book_id as string,
        source as string,
      );
      alert("✅ 加入书架成功");
      await refreshBookInfo(); // 刷新状态
    } catch (err) {
      console.error(err);
      alert("❌ 加入书架失败");
    } finally {
      setOperateLoading(false);
    }
  };

  // ===================== 移除书架 =====================
  const handleRemoveShelf = async () => {
    if (!user_id || !book_id || !source) {
      alert("参数异常，无法移除");
      return;
    }
    try {
      setOperateLoading(true);
      await removeFromBookshelf(
        Number(user_id),
        book_id as string,
        source as string,
      );
      alert("✅ 已移出书架");
      await refreshBookInfo(); // 刷新状态
    } catch (err) {
      console.error(err);
      alert("❌ 移除失败");
    } finally {
      setOperateLoading(false);
    }
  };

  useEffect(() => {
    if (user_id === undefined || user_id === null) {
      alert("用户ID不能为空，请重新登录");
      setLoading(false);
      return;
    }
    if (book_id == null || source == null) {
      alert("书籍信息异常");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchBookChapters(
          book_id as string,
          source as string,
          String(user_id),
        );
        setChapterList(data as any);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [book_id, source, user_id, setChapterList]);

  if (loading) return <div style={{ padding: "20px" }}>加载中...</div>;

  const book = chapterList as any;
  const sourceColor = getSourceColor(source);
  const catalog = normalizeChapterList(
    book?.chapter_catalog || [],
    source as string,
    book_id as string | number,
  );

  const commonStats = [
    { label: "字数", value: formatNumber(book?.word_count) },
    {
      label: "章节数",
      value: formatNumber(
        book?.chapter_count ||
          catalog.filter((item) => item.type === "chapter").length,
      ),
    },
  ].filter((item) => item.value);

  let platformStats: { label: string; value: string }[] = [];
  if (source === "zongheng") {
    platformStats = [
      { label: "总点击", value: formatNumber(book?.total_click) },
      { label: "总推荐", value: formatNumber(book?.total_recommend) },
      { label: "周推荐", value: formatNumber(book?.weekly_recommend) },
    ].filter((item) => item.value);
  } else if (source === "qimao") {
    platformStats = [
      { label: "热度值", value: formatNumber(book?.popularity) },
      { label: "阅读数", value: formatNumber(book?.read_count) },
      { label: "评分", value: formatScore(book?.score) },
    ].filter((item) => item.value);
  } else if (source === "shuqi") {
    platformStats = [
      { label: "人气值", value: formatNumber(book?.popularity) },
    ].filter((item) => item.value);
  }

  const handleChapterClick = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backBar}>
        <button onClick={handleBack} className={styles.backBtn}>
          ← 返回
        </button>
      </div>

      <div className={styles.mainRow}>
        <div className={styles.coverWrapper}>
          <img
            src={book?.cover_url || "https://picsum.photos/180/250"}
            alt={book?.book_name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://picsum.photos/180/250";
            }}
            className={styles.coverImg}
            style={{ border: `2px solid ${sourceColor}` }}
          />
        </div>

        <div className={styles.infoWrapper}>
          <div>
            <h1 className={styles.title}>
              {book?.book_name || "未知书籍"}
              <span
                className={styles.sourceTag}
                style={{
                  color: sourceColor,
                  border: `1px solid ${sourceColor}`,
                }}
              >
                {source === "zongheng"
                  ? "纵横"
                  : source === "qimao"
                    ? "七猫"
                    : source === "shuqi"
                      ? "书旗"
                      : "未知平台"}
              </span>
              <span
                className={styles.authorTag}
                style={{
                  marginLeft: 12,
                  fontSize: 16,
                  fontWeight: "normal",
                  color: "#666",
                }}
              >
                作者：{book?.author_name || "未知作者"}
              </span>
            </h1>

            <div className={styles.tagBar}>
              <span className={styles.collectTag}>
                {book?.is_collect === 1 ? "已加入书架" : "未加入书架"}
              </span>
              <span
                className={styles.statusTag}
                style={{
                  border: `1px solid ${sourceColor}`,
                  color: sourceColor,
                }}
              >
                {book?.book_status || "连载中"}
              </span>
              <span className={styles.categoryTag}>
                {book?.category || "未知分类"}
              </span>
            </div>

            <div className={styles.statsSection}>
              <div className={styles.commonStatsRow}>
                {commonStats.map((item, idx) => (
                  <span key={idx}>
                    {item.label}：{item.value}
                  </span>
                ))}
              </div>
              <div className={styles.platformStatsRow}>
                {platformStats.map((item, idx) => (
                  <span key={idx} style={{ color: sourceColor }}>
                    {item.label}：{item.value}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.btnBar}>
            <button
              className={styles.readBtn}
              style={{ backgroundColor: sourceColor }}
              onClick={() => {
                // 未登录拦截
                if (!user_id) {
                  alert("请先登录");
                  return;
                }
                // 跳转到阅读页，传递三个参数
                navigate("/read", {
                  state: {
                    user_id: user_id,
                    book_id: book_id,
                    source: source,
                    is_collect: book.is_collect,
                  },
                });
              }}
            >
              试阅读
            </button>

            {/* ===================== 书架按钮 ===================== */}
            {book?.is_collect ? (
              <button
                className={styles.shelfBtn}
                style={{ border: `1px solid ${sourceColor}` }}
                onClick={handleRemoveShelf}
                disabled={operateLoading}
              >
                {operateLoading ? "处理中..." : "移除此书"}
              </button>
            ) : (
              <button
                className={styles.shelfBtn}
                style={{ border: `1px solid ${sourceColor}` }}
                onClick={handleAddShelf}
                disabled={operateLoading}
              >
                {operateLoading ? "处理中..." : "加入书架"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tabBar}>
        <div
          className={styles.tabItem}
          onClick={() => setActiveTab("info")}
          style={{
            fontWeight: activeTab === "info" ? "bold" : "normal",
            color: activeTab === "info" ? sourceColor : "#666",
            borderBottom:
              activeTab === "info" ? `2px solid ${sourceColor}` : "none",
          }}
        >
          作品信息
        </div>
        <div
          className={styles.tabItem}
          onClick={() => setActiveTab("catalog")}
          style={{
            fontWeight: activeTab === "catalog" ? "bold" : "normal",
            color: activeTab === "catalog" ? sourceColor : "#666",
            borderBottom:
              activeTab === "catalog" ? `2px solid ${sourceColor}` : "none",
          }}
        >
          目录 ({catalog.filter((item) => item.type === "chapter").length}章)
        </div>
      </div>

      <div>
        {activeTab === "info" && (
          <div className={styles.infoContent}>
            <p>{book?.book_intro || "暂无简介"}</p>
          </div>
        )}

        {activeTab === "catalog" && (
          <>
            <div
              style={{
                height: "500px",
                overflowY: "auto",
                paddingRight: "8px",
                paddingBottom: "10px",
              }}
            >
              {catalog.length === 0 ? (
                <div className={styles.emptyCatalog}>暂无章节数据</div>
              ) : (
                (() => {
                  let currentVolumeOpen = true;

                  return catalog.map((item, idx) => {
                    if (item.type === "volume") {
                      const isOpen = openVolumes[item.volumeId] ?? false;
                      currentVolumeOpen = isOpen;

                      return (
                        <div
                          key={`volume-${item.volumeId || idx}`}
                          style={{
                            marginBottom: 16,
                            padding: "8px 0",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setOpenVolumes((prev) => ({
                              ...prev,
                              [item.volumeId]: !prev[item.volumeId],
                            }))
                          }
                        >
                          <h3
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              color: sourceColor,
                              margin: "0 0 8px 0",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              {item.volumeName}
                              <span
                                style={{
                                  fontSize: 14,
                                  color: "#666",
                                  fontWeight: "normal",
                                  marginLeft: 12,
                                }}
                              >
                                {item.totalChapterNum}章 ·{" "}
                                {formatNumber(item.totalWords)}字
                              </span>
                            </span>

                            <span style={{ fontSize: 14 }}>
                              {isOpen ? "▼" : "▶"}
                            </span>
                          </h3>
                        </div>
                      );
                    }

                    if (item.type === "chapter") {
                      if (!currentVolumeOpen) return null;

                      return (
                        <div
                          key={`chapter-${item.chapterId || idx}`}
                          className={styles.catalogItem}
                          style={{
                            border: `1px solid ${sourceColor}33`,
                            backgroundColor: item.isFree
                              ? "transparent"
                              : "#fff8f8",
                            cursor: "pointer",
                            position: "relative",
                            padding: "10px 12px",
                            marginBottom: 8,
                            borderRadius: 4,
                          }}
                          onClick={() => handleChapterClick(item.url)}
                        >
                          {item.title}

                          {!item.isFree && (
                            <span
                              style={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                fontSize: 10,
                                color: "#ff4d4f",
                                backgroundColor: "#fff0f0",
                                padding: "1px 4px",
                                borderRadius: 2,
                              }}
                            >
                              付费 {item.price}币
                            </span>
                          )}
                        </div>
                      );
                    }

                    return null;
                  });
                })()
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
