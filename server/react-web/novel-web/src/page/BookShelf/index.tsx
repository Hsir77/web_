import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import useUserStore from "../../store/user";
import useNovelStore from "../../store/novel";
import { fetchMyBookshelfList } from "../../api/novel";
import { searchMyBookshelf } from "../../api/novel";
import styles from "./index.module.css";

const MyBookshelf = () => {
  const navigate = useNavigate();
  const { userInfo } = useUserStore();
  const { myBookshelfList } = useNovelStore();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // 初始加载书架
  useEffect(() => {
    const loadData = async () => {
      if (!userInfo?.id) {
        alert("请先登录");
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        await fetchMyBookshelfList(String(userInfo.id));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userInfo?.id, navigate]);

  // 搜索书架
  const handleSearch = async (value: string) => {
    if (!userInfo?.id) return;
    setLoading(true);
    try {
      await searchMyBookshelf(userInfo.id, value);
    } finally {
      setLoading(false);
    }
  };

  // 跳转详情
  const goToDetail = (book: any) => {
    navigate("/detail", {
      state: {
        book_id: book.book_id,
        source: book.source,
        user_id: userInfo?.id,
      },
    });
  };

  return (
    <div className={styles.bookshelfPage}>
      <h1 className={styles.pageTitle}>我的书架</h1>

      {/* 搜索框 */}
     <div className={styles.searchBox}>
  <Input.Search
    placeholder="搜索书架书籍"
    allowClear
    enterButton="搜索"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    onSearch={handleSearch}
    className={styles.bookshelfSearch}
  />
</div>

      {loading ? (
        <div className={styles.loading}>加载中...</div>
      ) : (
        <div className={styles.bookGrid}>
          {myBookshelfList.length === 0 ? (
            <div className={styles.empty}>暂无收藏书籍</div>
          ) : (
            myBookshelfList.map((book) => {
              let cleanIntro = book.book_intro;
              if (book.source === "zongheng") {
                const regex = /^content=".*?观看小说：/;
                cleanIntro = cleanIntro.replace(regex, "").trim();
              }

              let tagColor = "#999";
              let tagLabel = book.source;
              if (book.source === "zongheng") {
                tagColor = "#ff4d4f";
                tagLabel = "纵横";
              } else if (book.source === "qimao") {
                tagColor = "#faad14";
                tagLabel = "七猫";
              } else if (book.source === "shuqi") {
                tagColor = "#52c41a";
                tagLabel = "书旗";
              }

              return (
                <div
                  key={book.book_id}
                  className={styles.bookCard}
                  onClick={() => goToDetail(book)}
                >
                  <div className={styles.sourceTag} style={{ background: tagColor }}>
                    {tagLabel}
                  </div>

                  <img src={book.cover_url} alt={book.book_name} className={styles.bookCover} />
                  <div className={styles.bookInfo}>
                    <h3 className={styles.bookTitle}>{book.book_name}</h3>
                    <p className={styles.bookAuthor}>作者：{book.author_name}</p>
                    <p className={styles.bookTags}>
                      <span>{book.category}</span>
                      <span>{book.book_status}</span>
                      <span>{book.word_count}字</span>
                    </p>
                    <p className={styles.bookIntro} title={cleanIntro}>{cleanIntro}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookshelf;