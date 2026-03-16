import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import useUserStore from "../../../store/user";

interface Props {
  title: string;
  author: string;
  status: string;
  words: string;
  category: string;
  desc: string;
  cover: string;
  book_id: string;
  source: string;
}

const BookCard: React.FC<Props> = ({
  title,
  author,
  status,
  words,
  category,
  desc,
  cover,
  book_id,
  source,
}) => {
  const navigate = useNavigate();
  const userInfo = useUserStore((state: any) => state.userInfo);
  const user_id = userInfo?.id;

  const platformMap: any = {
    zongheng: { label: "纵横", tagColor: "#ff4d4f" },
    qimao: { label: "七猫", tagColor: "#faad14" },
    shuqi: { label: "书旗", tagColor: "#52c41a" },
  };

  // ======================================
  // ✅ 修复：用当前书籍自己的 source，不是全局 type
  // ======================================
  const platform = platformMap[source] || { label: "书籍", tagColor: "#999" };

  let realDesc = desc;

  // ======================================
  // ✅ 修复：desc 清洗也按当前书籍 source 判断
  // ======================================
  if (source === "zongheng") {
    const prefixRegex = /^content=".*?观看小说：/;
    realDesc = desc.replace(prefixRegex, "");
  }

  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * 2;
      if (el.scrollHeight > maxHeight + 2) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    requestAnimationFrame(checkOverflow);
  }, [realDesc]);

  const formatWords = (words: string | number) => {
    const num =
      typeof words === "number"
        ? words
        : parseInt(words.replace(/[^\d]/g, ""), 10);
    if (!num) return "0万字";
    if (num >= 10000) {
      return `${Math.round(num / 10000)}万字`;
    }
    return `${num}字`;
  };

  const goToDetail = () => {
    if (!user_id) {
      alert("请先登录再查看小说详情");
      return;
    }

    navigate("/detail", {
      state: { book_id, source, user_id },
    });
  };

  return (
    <div className={styles.card} onClick={goToDetail}>
      <div
        className={styles.platform}
        style={{ background: platform.tagColor }}
      >
        {platform.label}
      </div>

      <img
        className={styles.cover}
        src={cover}
        alt={title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "https://picsum.photos/180/250";
        }}
      />

      <div className={styles.info}>
        <div className={styles.title}>{title}</div>

        <div className={styles.meta}>
          {author} · {category} · {status} · {formatWords(words)}
        </div>

        <div
          ref={descRef}
          className={`${styles.desc} ${
            expanded ? styles.expandedDesc : styles.clampDesc
          }`}
        >
          {realDesc}
        </div>

        {showButton && (
          <button
            className={styles.showMoreBtn}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? "收起" : "查看全部"}
          </button>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.buttons}>
          <button
            className={styles.btn2}
            onClick={(e) => {
              e.stopPropagation();
              goToDetail();
            }}
          >
            立即阅读
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;